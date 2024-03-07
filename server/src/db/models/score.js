const mongoose = require('mongoose');
const { Schema } = mongoose;

const scoreSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: {
        type: Number,
        requred: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Scores', scoreSchema);
