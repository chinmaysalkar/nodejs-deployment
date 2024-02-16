const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'Profile'
    },
    token: {
        type: String,
        required: true,
        
    },
});

const userModel = mongoose.model('passwordReset', passwordResetSchema);

module.exports = userModel;