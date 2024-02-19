const mongoose = require("mongoose")

const ticketListSchema = new mongoose.Schema({
    _id: { type: String, default:"TIC-0001" },
    description: { type: String, required: [true, "Description  is required"] },
    title: { type: String, required: [true, " project title is required"] },
    department:{type:String, required:[true,'department is required']},
    openAt:{type:Date, required:true, default:Date.now()} ,
    createdBy:{type:String},
    closed: {
        type: Boolean,
        default: false,
    },
     priority:{ type:String, required: [false," required priority "]},
    comment: [{ 
        type: mongoose.Schema.Types.ObjectId, ref:"ticketComment" 
    }],
    likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref:"ticketLikes"}],
    likes: [{ type:String}],
    activity:[{ type: String }],
    ticketDoc: {
        type: String
    },
   
})

const ticketList = mongoose.model("ticketList", ticketListSchema)
module.exports = ticketList