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
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
    },
    department: {
        type: String,
    },
    designation: {
        type: Array,
    },
    role: {
        type: Array,
    },
    username: {
        type: String,  
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



const profileModel = mongoose.model('Profile', profileSchema);
module.exports = profileModel