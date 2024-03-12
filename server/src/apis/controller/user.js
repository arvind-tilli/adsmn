
require('dotenv').config();
const Users = require('../../db/models/users');
const Scores = require('../../db/models/score');

const getWeeklyRank = async ({ userId }) => {
    try {
        let rankResult = [];
        const userDetails = await Users.findById({ _id: userId });
        if (!userDetails) {
            return {
                error: true,
                message: "user not found!!!"
            }
        }
        const firstFriday = new Date(process.env.FIRST_FRIDAY);  // Replace with friday start date
        let startDate = new Date(userDetails.createdAt);
        while (firstFriday < startDate) {
            firstFriday.setDate(firstFriday.getDate() + 7);
        }
        let endDate = firstFriday;
        const now = new Date();
        while (endDate < now) {
            //calcualte rank of the selected week
            console.log("Start Date: " + startDate + " End Date: " + endDate);
            const rank = await Scores.aggregate([
                {
                    $match: {
                        userId: { $exists: true },
                        updatedAt: { $gte: startDate, $lt: endDate }
                    }
                }, {
                    $group: {
                        _id: {
                            userId: '$userId'
                        },
                        totalScore: { $sum: '$score' }
                    }
                }, {
                    $sort: {
                        totalScore: -1
                    }
                }
            ]);
            rankResult.push(rank);
            startDate = new Date(endDate);
            endDate = new Date(endDate.setDate(endDate.getDate() + 7));
        }
        console.log("Start Date: " + startDate + " End Date: " + now);
        let rank = await Scores.aggregate([
            {
                $match: {
                    userId: { $exists: true },
                    updatedAt: { $gte: startDate, $lt: now }
                }
            }, {
                $group: {
                    _id: {
                        userId: '$userId'
                    },
                    totalScore: { $sum: '$score' }
                }
            }, {
                $sort: {
                    totalScore: -1
                }
            }
        ]);
        rankResult.push(rank);

        console.log("Rank result is: ", JSON.stringify(rankResult));

        let rankOfUser = [];
        for (let i = 0; i < rankResult.length; i++) {
            let resultIndex = undefined;
            let rank = rankResult[i];
            console.log("rank is: ", rank)
            for (let index = 0; index < rank.length; index += 1) {
                if (rank[index]._id.userId.toString() == userId.toString()) {
                    resultIndex = index + 1;
                    break;
                }
            }
            if (!resultIndex) {
                rankOfUser.push({
                    week: i + 1,
                    userid: userId,
                    rank: rank.length,
                    score: 0
                })
                continue;
            }
            rankOfUser.push({
                week: i + 1,
                userId: rank[resultIndex - 1]._id?.userId,
                rank: resultIndex,
                score: rank[resultIndex - 1].totalScore
            });
        }
        return rankOfUser;

    } catch (error) {
        console.log(error);
        return 'error';
    }
}


const getRank = async ({ userId }) => {
    try {
        const rank = await getUserRankings();

        console.log("Rank is: ", rank);

        let resultIndex = undefined;
        for (let index = 0; index < rank.length; index += 1) {
            console.log("_id: ", rank[index]._id.toString(), " userId: ", userId);
            if (rank[index]._id.toString() == userId.toString()) {
                resultIndex = index + 1;
                break;
            }
        }
        console.log("Result index is: ", resultIndex);
        if (!resultIndex) {
            return "error"
        }
        return {
            userId: rank[resultIndex - 1]._id,
            rank: resultIndex,
            totalScore: rank[resultIndex - 1].totalScore
        };

    } catch (error) {
        console.log(error);
        return 'error';
    }
}

const saveScore = async ({ userId, score }) => {
    try {

        const userExist = await Users.findOne({ _id: userId });
        if (userExist) {
            const scoreList = await Scores.find({
                userId: userExist._id
            }).sort({ updatedAt: 'desc' }).limit(3);
            console.log("Score list is: ", scoreList);

            const now = new Date();
            now.setHours(0, 0, 0, 0);

            let addScore;
            if (scoreList.length < 3) {
                console.log("Score list is less than 3, so adding new one");
                addScore = await Scores.create({
                    userId: userId,
                    score: score
                });
                return "success"
            } else if (now > new Date(scoreList[2].updatedAt)) {
                console.log("Not more than 3 scores added in the same day, so adding");
                addScore = await Scores.create({
                    userId: userId,
                    score: score
                });
                return "success"
            } else {
                console.log("More than 3 scores added for the day!!!");
                return "error"
            }
        }
    } catch (error) {
        console.log(error);
        return 'error';
    }
}




const sendOtp = async ({ mobile }) => {

    const otp = 1234; //TODO: in realtime, generate random number
    try {
        const userExist = await Users.findOne({ mobile: mobile });
        console.log("User found: ", userExist);
        if (userExist) {
            const updateUser = await Users.updateOne({
                _id: userExist._id,
            }, {
                // ...userExist,
                otp: otp,//TODO: in realtime, generate it randomaly
                otpExpiry: new Date(new Date().getTime() + 60000)
            });
            console.log("User updated: ", updateUser, "user: ", userExist);
            console.log("User already created, otp sent: ", userExist);
            return "success"

        } else {
            const userCreate = await Users.create({
                mobile: mobile,
                otp: otp
            });
            console.log("User created: ", userCreate);
            return 'success';
        }
    } catch (error) {
        console.log(error);
        return 'error';
    }

}
const registerUser = async ({ mobile, dob, name, email, otp }) => {
    try {
        //return userId
        const userExist = await Users.findOne({ mobile: mobile });
        if (userExist) {
            if (userExist.otp == otp) {
                console.log("Current date: ", new Date());
                console.log("otpExpiry: ", userExist.otpExpiry);
                if (userExist.otpExpiry >= Date.now()) {
                    console.log("Otp is not expired!!!")

                    const userUpdate = await Users.updateOne({
                        _id: userExist._id
                    }, {
                        name: name,
                        dob: dob, email: email
                    });
                    return { userId: userExist._id };
                } else {
                    return "OTP EXPIRED, Send otp again"
                }
            } else {
                return "error"
            }

        } else {
            //this case will never come, logically
            return 'error'
        }

    } catch (error) {
        console.log(error);
        return 'error';
    }
}




const getUserByid = async (id) => {
    const user = await Users.findById(id);
    return user;
}
const getAllUser = async () => {
    const allUser = await Users.find();
    return allUser;
}

const createUser = async ({ name, mobile }) => {
    const body = {
        name: name, mobile: mobile
    }
    const createUser = await Users.create(body);
    return createUser;
}


async function getUserRankings() {
    const result = await Scores.aggregate([
        {
            $group: {
                _id: '$userId',
                totalScore: { $sum: '$score' },
            },
        },
        // {
        //     $lookup: {
        //         from: 'Users',  // Updated to 'Users'
        //         localField: '_id',
        //         foreignField: 'userId',
        //         as: 'userDetails',
        //     },
        // },
        // {
        //     $unwind: '$userDetails',
        // },
        {
            $sort: { totalScore: -1 },
        },
        // {
        //     $group: {
        //         _id: '$_id',
        //         user: { $first: '$userDetails' },
        //         totalScore: { $first: '$totalScore' },
        //         userRank: { $first: { $rank: {} } },
        //     },
        // },
        // {
        //     $sort: { totalScore: -1 },
        // },
    ]);
    // console.log("Result of the rank is: ", result);
    return result;
}


module.exports = {
    getUserByid,
    getAllUser,
    createUser,
    sendOtp,
    registerUser,
    saveScore,
    getRank,
    getWeeklyRank,
}
