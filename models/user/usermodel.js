const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({

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
        type: Array,
        required: true
    },
    role: {
        type: Array,
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
    },
    profilePhoto: {

        type:String
      }
    
    
});



const profileModel = mongoose.model('User', profileSchema);
module.exports = profileModel