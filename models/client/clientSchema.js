const mongoose= require("mongoose")
const validator = require("validator")

const clientSchema= new mongoose.Schema({
    _id: { type: String},
    firstName: {
        type: String,
        required: [true, "Client name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Client name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: validator.isEmail
    },
    designation: {
        type: String,
    },
    place: { type: String },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }],
    link: {
        type: String,
        required: [true, "Social media link is required"]
    },
    companyName: {
        type: String,
        required: [true, "Company name is required"]
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String
    },
    isMailVerified: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },

})
const Client = mongoose.model("Client", clientSchema)
module.exports=Client

