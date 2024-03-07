const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    mobile: {
        type: String,
        maxLength: 10,
        minLength: 10,
        required: true,
        unique: true,
    },
    email: {
        type: String,
    },
    dob: {
        type: Date,
        default: new Date("1970-01-01T00:00:00.000Z"),
        required: false,
    },
    otp: {
        type: Number,
        length: 4,
        required: false
    },
    otpExpiry: {
        type: Date,
        default: new Date(new Date().getTime() + 120000)
    }


}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
