const mongoose = require("mongoose")

const ticketCommentSchema = new mongoose.Schema({
    sender: { type: String, required: [true, " sender name  is required"] },
    message: { type: String, required: [true, " message is required"] },
    msgAt: {type: Date, default:Date.now()}
})

const ticketComment = mongoose.model("ticketComment", ticketCommentSchema)
module.exports = ticketComment