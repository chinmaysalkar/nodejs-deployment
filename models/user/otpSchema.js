const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    },
    otp: {
        type: Number,
        required: true,
    },
    timestamp: {
        type:Date,
        default: Date.now,
        required: true,
        get: (timestamp) => timestamp.getTime(),
        set: (timestamp) => new Date(timestamp),
    }
});

const userModel = mongoose.model('Otp', otpSchema);

module.exports = userModel;