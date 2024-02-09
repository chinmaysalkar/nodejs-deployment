const Taskboard = require("../model/taskboard")

//taskboard
const addNewTask = async (req, res) => {
    try {
        const task = new Taskboard(req.body)
        const result = await task.save()
        console.log(result)
        res.status(200).json({ message: "new client created succesfully", result })

    } catch (error) {
        console.error(error)
        res.status(500).json("internal server error", error)
    }
}
const getAllTaskData = async (req, res) => {
    try {
        const taskData = await Taskboard.find().populate({ path: "team", select: ["employeeName", "_id"]})
        res.status(200).json({ message: "task board data shown succesfully", taskData })

    } catch (error) {
        console.error(error)
        res.status(500).json("internal server error", error)
    }
}
const updateTaskboard = async (req, res) => {
    try {
        const task = await Taskboard.findById(req.params.taskId)
        if (!task) {
            return res.status(404).json({ message: "task not found" })
        }
        task.taskname = req.body.task || task.taskname
        task.team = req.body.team || task.team
        task.startDate = req.body.startDate || task.startDate
        task.endDate = req.body.endDate || task.endDate
        task.action = req.body.action || task.action

        result = await task.save()
        res.status(200).json({ message: "client is updated succesfully", Result: result })


    } catch (error) {
        console.error(error)
        res.status(500).json("internal server error", error)
    }
}
const searchTask = async (req, res) => {
    try {
        const key = req.params.key;
        console.log("Search key:", key);
        const searchQuery = {};
        if (key) {
            searchQuery.taskname = new RegExp(key, 'i');
        }
        const searchResults = await Taskboard.find(searchQuery);
        res.status(200).json({ message: "search result is :", searchResult: searchResults })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}
const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Taskboard.findByIdAndDelete(req.params.taskId)
        if (!deleteTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted succesfully", deletedTask: deleteTask })


    } catch (error) {
        console.error(error)
        res.status(500).json("internal server error", error)
    }
}

module.exports = {
    addNewTask,
    getAllTaskData,
    updateTaskboard,
    searchTask,
    deleteTask,
}