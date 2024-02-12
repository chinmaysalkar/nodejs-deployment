const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    // userid: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    userId: {
        type:String,
        default: 'RAK0001',
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isMailVerified: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
    
    
});

const profileModel = mongoose.model('Profile', profileSchema);
module.exports = profileModel