const express=require("express")
const router=express.Router();
const usercontroller=require("../controller/usercontroller")
const project=require("../controller/projectcontroller")
const taskboard = require("../controller/taskcontroller")



//client
router.post("/clients", usercontroller.createClients)
router.get('/clientData',usercontroller.getClientData)
router.get('/searchClient/:key', usercontroller.searchClients)
router.put("/updateClient/:clientId", usercontroller.updateClient)
 router.delete("/dropClient/:clientId",usercontroller.dropClient )
//project
router.post("/pDetails/:clientId", project.createData)
router.get('/pData', project.getAllData)
router.get('/searchProject/:key', project.searchProject)
router.put("/updateProject/:projectId", project.updateProject)
router.delete("/dropProject/:projectId", project.dropProject)

//taskboard
router.post("/addTask", taskboard.addNewTask)
router.get('/taskData', taskboard.getAllTaskData)
router.get('/searchTrackboard/:key', taskboard.searchTask)
router.put("/updateTaskboard/:taskId", taskboard.updateTaskboard)
router.delete("/droptask/:taskId", taskboard.dropTask)

//ticket
router.post("/addTicket", usercontroller.addNewTicket)
router.get('/ticketData', usercontroller.getAllTicketData)
router.get('/searchTicket/:key', usercontroller.searchTickets)
module.exports= router;