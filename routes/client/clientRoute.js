const express=require("express")
const router=express.Router();
const { deleteClient,updateClient,searchClients,getClientData,createClients, }=require("../../controllers/clientcontroller")
const { deleteProject,updateProject,searchProject,createData,getAllData, }=require("../../controllers/projectcontroller")
const { addNewTask,getAllTaskData,updateTaskboard,searchTask,deleteTask,getTaskPercentage } = require("../../controllers/taskcontroller")
const { addTodoList,getTodoList,deleteTodoList, }=require("../../controllers/todoController")
const { getAllTicketData, searchTickets, updateTicket, addTicketcomment,addNewTicket, deleteTicket, getAllComment, updateTicketReplay }=require("../../controllers/ticketController");
const { verifyToken } = require("../../middlewares/token");
// const { verifyToken } = require("../../middlewares/token");



//client
router.post("/clients", verifyToken, createClients)
router.get('/clientData',getClientData)
router.get('/searchClient/:key', searchClients)
router.put("/updateClient/:clientId", updateClient)
router.delete("/deleteClient/:clientId",deleteClient)

//project
router.post("/pDetails/:clientId", createData)
router.get('/pData', getAllData)
router.get('/searchProject/:key', searchProject)
router.put("/updateProject/:projectId", updateTicket)
router.delete("/deleteProject/:projectId", deleteProject)

//taskboard
router.post("/addTask", addNewTask)
router.get('/taskData/:action', getTaskPercentage)
router.get('/taskData', getAllTaskData)
router.get('/searchTrackboard/:key', searchTask)
router.put("/updateTaskboard/:taskId", updateTaskboard)
router.delete("/deletetask/:taskId", deleteTask)

//ticket
router.post("/addTicket/:userId" ,addNewTicket)
router.get('/ticketData', getAllTicketData)
router.get('/searchTicket/:key', searchTickets)
router.put("/Updateticket/:Id", updateTicket)
router.put("/ticketReply/:Id",updateTicketReplay)
router.delete("/deleteticket/:ticketId", deleteTicket)

//todo
router.post("/addDoTask", addTodoList)
router.get("/getTodoList", getTodoList)
router.delete("/deleteTask/:taskId", deleteTodoList)

//comment
router.post("/comment/:ticketId", addTicketcomment)
router.get("/getAllComments", getAllComment)


module.exports= router;