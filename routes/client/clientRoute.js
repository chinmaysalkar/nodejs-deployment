const express=require("express")
const router=express.Router();
const usercontroller=require("../controller/usercontroller")
const project=require("../controller/projectcontroller")
const taskboard = require("../controller/taskcontroller")
const employee=require("../controller/democontroller")
const doList=require("../controller/todoController")
const ticket=require("../controller/ticketController")

//employee
router.post("/employee", employee.addEmployee)
router.get('/empData', employee.getEmpData)

//client
router.post("/clients", usercontroller.createClients)
router.get('/clientData',usercontroller.getClientData)
router.get('/searchClient/:key', usercontroller.searchClients)
router.put("/updateClient/:clientId", usercontroller.updateClient)
 router.delete("/dropClient/:clientId",usercontroller.deleteClient)

//project
router.post("/pDetails/:clientId", project.createData)
router.get('/pData', project.getAllData)
router.get('/searchProject/:key', project.searchProject)
router.put("/updateProject/:projectId", project.updateProject)
router.delete("/dropProject/:projectId", project.deleteProject)

//taskboard
router.post("/addTask", taskboard.addNewTask)
router.get('/taskData', taskboard.getAllTaskData)
router.get('/searchTrackboard/:key', taskboard.searchTask)
router.put("/updateTaskboard/:taskId", taskboard.updateTaskboard)
router.delete("/droptask/:taskId", taskboard.deleteTask)

//ticket
router.post("/addTicket", ticket.addNewTicket)
router.get('/ticketData', ticket.getAllTicketData)
router.get('/searchTicket/:key', ticket.searchTickets)

//todo
router.post("/addDoTask", doList.addTodoList)
router.get("/getTodoList", doList.getTodoList)
router.delete("/delete", doList.deleteTodoList)
module.exports= router;