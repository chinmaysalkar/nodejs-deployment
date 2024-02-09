const mongoose = require("mongoose")

const taskBoardSchema = new mongoose.Schema({
    taskname :{type:String, required:[false, " task is required"]},
    team: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
    startDate: { type: String, required: [true, " enter the starting date of the task"] },
    endDate: { type: String, required: [true, " enter the end date of the task"] },
    action:{type:String, required:[true ," action is required "], 
    enum:["in progress"," planned", "completed"]}

})
const Taskboard = mongoose.model('Taskboard', taskBoardSchema);
module.exports =Taskboard ;