const mongoose=require("mongoose")
const validator=require("validator")
 const projectSchema= new mongoose.Schema({

   pname:{type:String, required:[true, "project name is required"]},
   technology:{type:String, },
   description :{type:String, required:[true, "Project Description is required"]},
   createDate:{type:String, required:[true, " date is required"] },
   creator:{type:String, required:[true," Creator name is requred"] },
   deal: { type: String, required: [true, "deal amount is requird"] },
   task: [{ type: mongoose.Schema.Types.ObjectId, ref: "Taskboard" }],
  //  clientId: { type: mongoose.Schema.Types.ObjectId, ref:"Client"},
   owner: { type: String, },
   milestone: {
     type: String,
     required: [true, " milestone is required is required "],
     enum: ["project approval", "requirement review", "design approval","processing project","final approval"]
   },
   workHour: { type: String },
   duration: { type: Date, required: [true, " time dureation is required"] },
   team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
   priority: { type: String, enum:["high","low","medium"] }

 })

 const Project  = mongoose.model('Project', projectSchema);
 module.exports =Project;