const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const scoreRouter = require('./score');

router.use('/users', userRouter);
router.use('/score', scoreRouter);

router.get('/health', (req, res, next) => {
    return res.status(200).json({
        message: "Apis are running fine!!!"
    });
})

module.exports = router;
