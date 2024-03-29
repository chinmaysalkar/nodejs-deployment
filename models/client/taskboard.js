const mongoose = require("mongoose")

const taskBoardSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: [true, "Task is required"]
    },
    description: {
        type: String,
        required: [false, "Description is required"]
    },
    startDate: {
        type: String,
        required: [true, "Enter the starting date of the task"]
    },
    endDate: {
        type: String,
        required: [true, "Enter the end date of the task"]
    },
    action: {
        type: String,
        required: [false, "Action is required"],
        enum: ["in progress", "planned", "completed"]
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

const Taskboard = mongoose.model('Taskboard', taskBoardSchema);
module.exports =Taskboard ;