const express = require('express');
const userController = require('../controller/user');
const router = express.Router();

router.post('/save', async (req, res, next) => {
    try {
        const { userId, score } = req.body;
        if (!(typeof score === 'number')) {
            return res.status(200).json({
                success: false,
                message: "Score should be number!"
            })
        } else if (score < 50 && score > 500) {
            return res.status(200).json({
                success: false,
                message: "Score should be in range [50, 500]!!!"
            })
        }
        const response = await userController.saveScore({ userId, score });
        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.log(`Api failed: ${res.url} Reason: ${error}`);
        return res.status(500).json({
            success: false,
            message: error
        })
    }
})

router.get('/rank/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log("🎆Userid is: ", userId);
        const response = await userController.getRank({ userId });
        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.log(`Api failed: ${res.url} Reason: ${error}`);
        return res.status(500).json({
            success: false,
            message: error
        })
    }
})

router.get('/weeklyrank/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log("🎆Userid is: ", userId);
        const response = await userController.getWeeklyRank({ userId });
        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.log(`Api failed: ${res.url} Reason: ${error}`);
        return res.status(500).json({
            success: false,
            message: error
        })
    }
})



module.exports = router;
