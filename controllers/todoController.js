const toDoList = require("../models/client/todoList");

//todolist
const addTodoList = async (req, res) => {
    try {
        const newlist = new toDoList(req.body)
        const result = await newlist.save()
        res.status(200).json({ message: "add task in todo list ", result })

    } catch (error) {
        console.error(error)
      res.status(500).json({ message: "internal server error", error })
    }
}
const getTodoList= async (req,res)=>{
    try{
        const list = await toDoList.find().populate({ path: "team", select: ["employeeName", "_id"] })
        res.status(200).json({ message: "this is the list  ", list })
    }catch(error){
        console.error(error)
        return res.status(500).json({ message: "internal server error", error })

    }
}

const deleteTodoList =async (req,res)=>{
    try{
        const deleteTodo=await toDoList.findByIdAndDelete(req.params.doListId)
        if (!doListId){
            res.status(404).json({error:" do_list not found "})
        }
        res.status(200).json({message:"delete succesfully ", deleteTodo})
      
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "internal server error", error })

    }
}


module.exports={ 
    addTodoList,
    getTodoList,
    deleteTodoList,

    
}

