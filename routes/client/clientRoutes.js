const express=require("express")
const router=express.Router();
const {createClients,searchClients,getClientData,updateClient,dropClient,createData,getAllData,searchProject,updateProject,dropProject,addNewTask,searchTask,updateTaskboard,dropTask,addNewTicket,searchTickets,getAllTicketData, getAllTaskData}=require("../../controllers/clientController.js")

//client
router.post("/clients", createClients)
router.get('/clientData', getClientData)
router.get('/searchClient/:key', searchClients)
router.put("/updateClient/:clientId", updateClient)
 router.delete("/dropClient/:clientId", dropClient )
//project
router.post("/pDetails/:clientId", createData)
router.get('/pData', getAllData)
router.get('/searchProject/:key', searchProject)
router.put("/updateProject/:projectId", updateProject)
router.delete("/dropProject/:projectId",dropProject)

//taskboard
router.post("/addTask", addNewTask)
router.get('/taskData', getAllTaskData)
router.get('/searchTrackboard/:key', searchTask)
router.put("/updateTaskboard/:taskId", updateTaskboard)
router.delete("/droptask/:taskId", dropTask)

//ticket
router.post("/addTicket", addNewTicket)
router.get('/ticketData', getAllTicketData)
router.get('/searchTicket/:key', searchTickets)
module.exports= router;