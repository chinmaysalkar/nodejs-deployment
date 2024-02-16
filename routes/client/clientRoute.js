const express=require("express")
const router=express.Router();
const { deleteClient,updateClient,searchClients,getClientData,createClients, }=require("../../controllers/clientcontroller")
const { deleteProject,updateProject,searchProject,createData,getAllData, }=require("../../controllers/projectcontroller")
const { addNewTask,getAllTaskData,updateTaskboard,searchTask,deleteTask,getTaskPercentage } = require("../../controllers/taskcontroller")
const { addTodoList,getTodoList,deleteTodoList, }=require("../../controllers/todoController")
const { getAllTicketData, searchTickets, updateTicket, addTicketcomment,addNewTicket, deleteTicket, getAllComment,  updateComment, deleteComment, singleTicketData, likeTicket, closeTicket }=require("../../controllers/ticketController");
const { verifyToken } = require("../../middlewares/token");
const { mailToClient } = require("../../controllers/sendMailController");




//client
router.post("/clients", createClients)
router.post("/sendMail/:clientId",  mailToClient)
router.get('/clientData',getClientData)
router.get('/searchClient/:key', searchClients)
router.put("/updateClient/:Id", updateClient)
router.delete("/deleteClient/:clientId",deleteClient)

//project
router.post("/pDetails/:clientId", createData)
router.get('/pData', getAllData)
router.get('/searchProject/:key', searchProject)
router.put("/updateProject/:projectId", updateProject)
router.delete("/deleteProject/:projectId", deleteProject)

//taskboard
router.post("/addTask/:projectId", addNewTask)
router.get('/taskData/:action', getTaskPercentage)
router.get('/taskData', getAllTaskData)
router.get('/searchTrackboard/:key', searchTask)
router.put("/updateTaskboard/:taskId", updateTaskboard)
router.delete("/deletetask/:taskId", deleteTask)

//ticket
router.post("/addTicket/:userId" ,addNewTicket)
router.get('/ticketData', getAllTicketData)
router.get('/ticketData/:ticketId', singleTicketData)
router.get('/searchTicket/:key', searchTickets)
router.put("/Updateticket/:Id", updateTicket)
router.put("/closedTicket/:Id/closed", closeTicket)
router.delete("/deleteticket/:ticketId", deleteTicket)

//todo
router.post("/addDoTask", addTodoList)
router.get("/getTodoList", getTodoList)
router.delete("/deleteTask/:taskId", deleteTodoList)

//comment,like,unlike
router.post("/comment/:ticketId", verifyToken, addTicketcomment)
router.get("/getAllComments", getAllComment)
router.put("/UpdateComment/:Id",updateComment)
router.delete("/deleteComment/:commentId",deleteComment)
router.put("/like/:ticketId",verifyToken,likeTicket)



module.exports= router;