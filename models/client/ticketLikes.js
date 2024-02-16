const mongoose = require("mongoose")

const ticketLikeSchema = new mongoose.Schema({
    likeBy: { type: String, },
    likeUserId:{type:String},
    msgAt: { type: Date, default: Date.now() },
})

const ticketLikes = mongoose.model("ticketLikes", ticketLikeSchema)
module.exports = ticketLikes