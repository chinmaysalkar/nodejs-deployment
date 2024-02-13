const mongoose = require("mongoose")

const ticketListSchema = new mongoose.Schema({
    employeeId: { type: String, required: [false, "Employee Id is required"] },
    title: { type: String, required: [true, " project title is required"] },
    department:{type:String, required:[true,'department is required']},
    openAt:{type:Date, required:true, default:Date.now()} ,
    //    activity:{type:mongoose.Schema.Types.ObjectId, ref:""},
    //    agentName:{type:String, required:[true,'agent name is required']},
     priority:{ type:String, required: [false," required priority "]},
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "ticketComment" }]
   
})

const ticketList = mongoose.model("ticketList", ticketListSchema)
module.exports = ticketList