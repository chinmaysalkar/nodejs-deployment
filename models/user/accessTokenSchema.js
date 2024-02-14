const mongoose = require('mongoose');


const accessTokenCheck = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true,
        
    },
    expiresAt: { 
        type: Date, 
        default: Date.now() + (12 * 60 * 60 * 1000) 
    }}, {
    timestamps: true
});

const accessTokenModel = mongoose.model('AccessToken', accessTokenCheck);

module.exports = accessTokenModel;