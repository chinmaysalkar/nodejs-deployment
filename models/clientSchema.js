const mongoose= require("mongoose")
const validator = require("validator")

const clientSchema= new mongoose.Schema({
    clientName:{type:String,required:[true, "client name is required"]},
    clientEmail: { type: String, required: [false, " Email is required"],validate: validator.isEmail ,unique:true },
    place:{type:String},
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref:"Project"}],
    link:{type:String, required:[true,"social media link is required"]},
   
 

})
const Client = mongoose.model("Client", clientSchema)
module.exports=Client

