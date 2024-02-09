const mongoose = require("mongoose")

const ticketListSchema = new mongoose.Schema({
    _id: { type: String, },
    title: { type: String, required: [true, " project title is required"] },
    priority:{ type:String, required: [true," required priority "]},
   department:{type:String, required:[true,'department is required']},
   agentName:{type:String, required:[true,'agent name is required']},
   date:{type:Date, required:[true, " date is required"]} ,
   activity:{type:mongoose.Schema.Types.ObjectId, ref:""}
})

const ticketList = mongoose.model("ticketList", ticketListSchema)
module.exports = ticketList