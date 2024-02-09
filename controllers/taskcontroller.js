const Taskboard = require("../models/client/taskboard")

//taskboard
const addNewTask = async (req, res) => {
    try {
        const task = new Taskboard(req.body)
        const result = await task.save()
        res.status(200).json({ message: "new client created succesfully", result })

    } catch (error) {
        console.error(error)
        res.status(500).json("internal server error", error)
    }
}
const getAllTaskData = async (req, res) => {
    try {
        const taskData = await Taskboard.find()
        .populate({ path: "team", select: ["employeeName", "_id"]})
            .populate({ path: "project", select: ["pname"]} )
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
        const updateFields = ['taskname', 'team', 'startDate', 'endDate', 'action'];

        updateFields.forEach(field => {
            task[field] = req.body[field] || task[field];
        });
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
        const searchableField=["taskname"]
        if (key) {
            searchableField.forEach(field =>{
            searchQuery[field] = new RegExp(key, 'i');
            })
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


//grid view 
const getPlanedTask = async(req,res)=>{
 try{
     const action = req.params.action;
     const totalTask =await Taskboard.find()
     const task = await Taskboard.find({ action });
     if (!action ){
        res.status(404).json ({message:"searched action not found "})
     }
     const progress= (task.length*100)/totalTask.length
     
     res.status(200).json({messaage:`the ${progress} % task is ${action} `});

 }catch(error){
    console.error(error)
    res.status(500).json({messaage:"internal server error"})
 }
}

module.exports = {
    addNewTask,
    getAllTaskData,
    updateTaskboard,
    searchTask,
    deleteTask,

    getPlanedTask
}