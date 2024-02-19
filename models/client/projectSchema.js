const mongoose=require("mongoose")
const validator=require("validator")
 const projectSchema= new mongoose.Schema({

   pname: {
     type: String,
     required: [true, "Project name is required"]
   },
   technology: {
     type: String
   },
   description: {
     type: String,
     required: [true, "Project description is required"]
   },
   createDate: {
     type: String,
     required: [true, "Date is required"]
   },
   creator: {
     type: String,
     required: [true, "Creator name is required"]
   },
   deal: {
     type: String,
     required: [true, "Deal amount is required"]
   },
   task: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "Taskboard"
   }],
   // clientId: {
   //     type: mongoose.Schema.Types.ObjectId,
   //     ref: "Client"
   // },
   owner: {
     type: String
   },
   milestone: {
     type: String,
     required: [true, "Milestone is required"],
     enum: ["project approval", "requirement review", "design approval", "processing project", "final approval"]
   },
   workHour: {
     type: String
   },
   duration: {
     type: Date,
     required: [true, "Time duration is required"]
   },
   team: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
   }],
   priority: {
     type: String,
     enum: ["high", "low", "medium"]
   }, 
   status: {
     type: Boolean,
     default: false,
   },

 })

 const Project  = mongoose.model('Project', projectSchema);
 module.exports =Project;