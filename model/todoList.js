const mongoose = require("mongoose")

const todoListSchema=new mongoose.Schema({
    description:{type:String, required:[true, "descriptioon is required "]},
    due:{type:Date, required:[true, "due date is required "]},
    priority:{type:String, required:[true,"give the priority high/med"], enum:['high',"med"]},
    team:[{type:mongoose.Schema.Types.ObjectId,  ref:"Employee"}]
})

const toDoList = mongoose.model("toDoList", todoListSchema);
module.exports = toDoList