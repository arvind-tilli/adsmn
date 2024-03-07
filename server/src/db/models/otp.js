const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
    userId: { type: Object, ref: 'User' },
    otp: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now()
    },
    wrongCount: {
        type: Number,
    }
}, {
    timestamps: true
});

export const Otp = mongoose.model("Otp", otpSchema);
