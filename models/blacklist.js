const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({

    token: {
        type: String,
        required: true,
        
    },
},{
    timestamps: true
});

const userModel = mongoose.model('Blacklist', blacklistSchema);

module.exports = userModel;