const mongoose=require("mongoose")
const validator=require("validator")
 const projectSchema= new mongoose.Schema({

   pname:{type:String, required:[true, "project name is required"]},
   tools:{type:String, },
   description :{type:String, required:[true, "Project Description is required"]},
   createDate:{type:String, required:[true, " date is required"] },
   creator:{type:String, required:[true," Creator name is requred"] },
   team:{type:mongoose.Schema.Types.ObjectId,ref:"employee"},
   clientEmail: { type: String, required: [false, " Email is required"], validate: validator.isEmail },
   deal: { type: String, required: [false, "deal amount is requird"] },
   clientId: { type: mongoose.Schema.Types.ObjectId, ref:"Client"}

 })

 const Project  = mongoose.model('Project', projectSchema);
 module.exports =Project;