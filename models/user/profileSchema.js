const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const profileModel = mongoose.model('Profile', profileSchema);
module.exports = profileModel