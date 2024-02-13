const express=require("express")
const router=express.Router();
const { deleteClient,updateClient,searchClients,getClientData,createClients, }=require("../../controllers/clientcontroller")
const { deleteProject,updateProject,searchProject,createData,getAllData, }=require("../../controllers/projectcontroller")
const { addNewTask,getAllTaskData,updateTaskboard,searchTask,deleteTask,getTaskPercentage } = require("../../controllers/taskcontroller")
const { addTodoList,getTodoList,deleteTodoList, }=require("../../controllers/todoController")
const { getAllTicketData, searchTickets, updateTicket, addTicketcomment,addNewTicket }=require("../../controllers/ticketController");
// const { verifyToken } = require("../../middlewares/token");



//client
router.post("/clients", createClients)
router.get('/clientData',getClientData)
router.get('/searchClient/:key', searchClients)
router.put("/updateClient/:clientId", updateClient)
 router.delete("/dropClient/:clientId",deleteClient)

//project
router.post("/pDetails/:clientId", createData)
router.get('/pData', getAllData)
router.get('/searchProject/:key', searchProject)
router.put("/updateProject/:projectId", updateProject)
router.delete("/dropProject/:projectId", deleteProject)

//taskboard
router.post("/addTask", addNewTask)
router.get('/taskData/:action', getTaskPercentage)
router.get('/taskData', getAllTaskData)
router.get('/searchTrackboard/:key', searchTask)
router.put("/updateTaskboard/:taskId", updateTaskboard)
router.delete("/droptask/:taskId", deleteTask)

//ticket
router.post("/addTicket" ,addNewTicket)
router.get('/ticketData', getAllTicketData)
router.get('/searchTicket/:key', searchTickets)
// router.put("/Updateticket/:Id", updateTicket)

//todo
router.post("/addDoTask", addTodoList)
router.get("/getTodoList", getTodoList)
router.delete("/delete", deleteTodoList)

//comment
router.post("/comment/:ticketId", addTicketcomment)

module.exports= router;