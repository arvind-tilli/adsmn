const express = require('express');
const userController = require('../controller/user');
const router = express.Router();

router.post('/sendotp', async (req, res, next) => {
    try {
        const { mobile } = req.body;
        console.log("here 🎉🎉")
        const response = await userController.sendOtp({ mobile });
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

router.post('/register', async (req, res, next) => {
    try {
        const { mobile, dob, name, email, otp } = req.body;
        const response = await userController.registerUser({ mobile, dob, name, email, otp });
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

router.post('/save', async (req, res, next) => {
    try {
        const { mobile } = req.body;
        const response = await userController.sendOtp({ mobile });
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




router.get('/all', async (req, res, next) => {
    try {
        const allUser = await userController.getAllUser();
        return res.status(200).json({
            success: true,
            data: allUser
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "API Failed due to: " + error.message
        })
    }
})
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userController.getUserByid(id);
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "API Failed due to: " + error.message
        })
    }
})
router.post('/', async (req, res, next) => {
    try {
        const { name, mobile, } = req.body;
        const createuser = await userController.createUser({
            name, mobile
        })
        return res.status(200).json({
            success: true,
            data: createuser
        })

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "API Failed due to: " + error.message
        })
    }
})
router.put('/', async (req, res, next) => {
    try {

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "API Failed due to: " + error.message
        })
    }
})
router.delete('/', async (req, res, next) => {
    try {

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "API Failed due to: " + error.message
        })
    }
})


module.exports = router;
