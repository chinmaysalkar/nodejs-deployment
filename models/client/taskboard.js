const mongoose = require("mongoose")

const taskBoardSchema = new mongoose.Schema({
    taskname :{type:String, required:[false, " task is required"]},
    startDate: { type: Date, required: [true, " enter the starting date of the task"] },
    endDate: { type: Date, required: [true, " enter the end date of the task"] },
    action:{type:String,
         required:[true ," action is required "], 
         enum:["in progress","planned", "completed"]},
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    project: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
    
})

const Taskboard = mongoose.model('Taskboard', taskBoardSchema);
module.exports =Taskboard ;