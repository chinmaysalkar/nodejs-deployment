const express=require("express")
const router=express.Router();
const usercontroller=require("../controller/")

//client
router.post("/clients", usercontroller.createClients)
router.get('/clientData',usercontroller.getClientData)
router.get('/searchClient/:key', usercontroller.searchClients)
router.put("/updateClient/:clientId", usercontroller.updateClient)
 router.delete("/dropClient/:clientId",usercontroller.dropClient )
//project
router.post("/pDetails/:clientId", usercontroller.createData)
router.get('/pData', usercontroller.getAllData)
router.get('/searchProject/:key', usercontroller.searchProject)
router.put("/updateProject/:projectId", usercontroller.updateProject)
router.delete("/dropProject/:projectId",usercontroller.dropProject)

//taskboard
router.post("/addTask", usercontroller.addNewTask)
router.get('/taskData', usercontroller.getAllTaskData)
router.get('/searchTrackboard/:key', usercontroller.searchTask)
router.put("/updateTaskboard/:taskId", usercontroller.updateTaskboard)
router.delete("/droptask/:taskId", usercontroller.dropTask)

//ticket
router.post("/addTicket", usercontroller.addNewTicket)
router.get('/ticketData', usercontroller.getAllTicketData)
router.get('/searchTicket/:key', usercontroller.searchTickets)
module.exports= router;