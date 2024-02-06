const mongoose= require("mongoose")
const validator = require("validator")

const clientSchema= new mongoose.Schema({
    clientName:{type:String,required:[true, "client name is required"]},
    clientEmail: { type: String, required: [false, " Email is required"],validate: validator.isEmail },
    place:{type:String},
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref:"Project"}],
    link:{type:String, required:[true,"social media link is required"]},
    comment:[
        {
            type:String,created:{type:Date,default:Date.now()},
            postedBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"}
        }
    ],
    question: [{ type: mongoose.Schema.Types.ObjectId, reff: "" }],
    bugs: [{ type: mongoose.Schema.Types.ObjectId, reff: "" }],
    team:[{type:mongoose.Schema.Types.ObjectId, ref:"employee"}]
 

})
const Client = mongoose.model("Client", clientSchema)
module.exports=Client

