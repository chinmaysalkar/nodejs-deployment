const mongoose= require("mongoose")
const validator = require("validator")

const clientSchema= new mongoose.Schema({
    _id: { type: String},
    clientName:{type:String,required:[true, "client name is required"]},
    clientEmail: { type: String, required: [true, " Email is required"], unique: true,validate: validator.isEmail },
    place:{type:String},
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref:"Project"}],
    link:{type:String, required:[true,"social media link is required"]},
    companyName: { type: String, required: [true, "company name  is required"] },
   mobile: {
        type: Number,
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

})
const Client = mongoose.model("Client", clientSchema)
module.exports=Client

