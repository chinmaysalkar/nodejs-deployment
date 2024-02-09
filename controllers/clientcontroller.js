const Project = require("../models/client/projectSchema");
const Client = require("../models/client/clientSchema");
const Taskboard = require("../models/client/taskboard");
const bodyParser = require("body-parser");
// const { param } = require("../routes/userRoute");
const ticketList = require("../models/client/ticketList");
const toDoList = require("../models/client/todoList");

  //project
  const createData =  async (req, res) => {
    try {
      const project = new Project(req.body);
      console.log(req.params.clientId);
      const client = await Client.findById(req.params.clientId);
      if (!client) {
        console.error(
          "Client not found for project creation. Client ID:",
          req.params.clientId
        );
        return res
          .status(404)
          .json({
            message:
              "client not found for this project please create a client first",
          });
      }
      const result = await project.save();
      client.projects.push(result._id);

      await client.save();
      res
        .status(201)
        .json({ message: "new project creataed succesfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server error", error });
    }
  }
  const getAllData = async (req, res) => {
    try {
      const project = await Project.find();
      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server error", error });
    }
  }
  const searchProject = async (req, res) => {
    try {
      const key = req.params.key;
      console.log(key);
      const searchQuery = {};
      if (key) {
        searchQuery.pname = new RegExp(key, "i");
      }
      const searchResults = await Project.find(searchQuery);

      res.status(200).json({ message: "search result is :", searchResults });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server error", error });
    }
  }
  const updateProject = async (req, res) => {
    try {
      const projectIdToUpdate = req.params.projectId;
      const project = await Project.findById({ _id: projectIdToUpdate });
      if (!project) {
        res.status(404).json("project not found");
      }
      project.pname = req.body.pname || project.pname;
      project.description = req.body.description || project.description;
      project.tools = req.body.tools || project.tools;
      project.createDate = req.body.createData || project.createDate;
      project.creator = req.body.creator || project.creator;
      project.clientEmail = req.body.clientEmail || project.clientEmail;
      project.team = req.body.team || project.team;
      project.clientId = req.body.clientId || project.clientId;
      project.deal = req.body.deal || project.deal;

      const updatedProject = await project.save();
      if (req.body.clientId) {
        console.log(req.body.clientId);
        const client = await Client.findById(req.body.clientId);

        if (client) {
          const projectIndex = client.projects.indexOf(projectIdToUpdate);

          if (projectIndex !== -1) {
            // If the project ID is already in the client's projects array, update it
            client.projects[projectIndex] = updatedProject._id;
          } else {
            // If the project ID is not in the client's projects array, add it
            client.projects.push(updatedProject._id);
          }

          await client.save();
        }
      }

      return res
        .status(200)
        .json({
          message: "Project updated successfully",
          project: updatedProject,
        });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message }); // Use an object with an "error" property
    }
  }
  const dropProject= async (req, res) => {
    try {
      const deleteProject = await Project.findByIdAndDelete(
        req.params.projectId
      );
      if (!deleteProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      res
        .status(200)
        .json({ message: "project deleted succesfully", deleteProject });
    } catch (error) {
      console.error(error);
      res.status(500).json("internal server error", error);
    }
  }

  //client
  const createClients = async (req, res) => {
    try {
      const client = new Client(req.body);
      const result = await client.save();
      res
        .status(200)
        .json({ message: "new client created succesfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server error", error });
    }
  }
  const getClientData = async (req, res) => {
    try {
      const clients = await Client.find().populate({
        path: "projects",
        model: "Project",
      });
      const clientsWithDetails = clients.map((client) => {
        const totalProjects = client.projects.length;
        const totalDealAmount = client.projects.reduce(
          (total, project) => total + (project.deal || 0),
          0
        );
        return {
          _id: client._id,
          clientName: client.clientName,
          email: client.email,
          place: client.place,
          link: client.link,
          totalProjects,
          totalDealAmount,
          projects: client.projects,
        };
      });

      res
        .status(200)
        .json({
          message: "Client details and project",
          clients: clientsWithDetails,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server error", error });
    }
  }
  const searchClients = async (req, res) => {
    try {
      const key = req.params.key;
      const searchQuery = {};
      if (key) {
        searchQuery.clientName = new RegExp(key, "i");
      }
      const searchResults = await Client.find(searchQuery);

      res.status(200).json({ message: "search result is :", searchResults })
    } catch (error) {
            console.error(error)
            res.status(500).json({ message: "internal server error", error })
        }
  }
    const updateClient = async (req,res)=>{
    try{
      const client =await Client.findById (req.params.clientId)
      if (!client){
        res.status(404).json(" client id not found")
      }
      client.clientName = req.body.clientName || client.clientName;
      client.email = req.body.email || client.email;
      client.link = req.body.link || client.link;
      client.place = req.body.place || client.place;
      client.project = req.body.projectId || client.project;

      result = await client.save();
      res
        .status(200)
        .json({ message: "client is updated succesfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server error", error });
    }
  }
  const dropClient = async (req, res) => {
    try {
      const dropClient = await Client.findByIdAndDelete(req.params.clientId);
      if (!dropClient) {
        return res.status(404).json({ error: "client not found" });
      }
      res
        .status(200)
        .json({ message: "client deleted succesfully", dropClient });
    } catch (error) {
      console.error(error);
      res.status(500).json("internal server error", error);
    }
  }

  //taskboard
  const addNewTask= async (req, res) => {
    try {
      const task = new Taskboard(req.body);
      const result = await task.save();
      console.log(result);
      res
        .status(200)
        .json({ message: "new client created succesfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json("internal server error", error);
    }
  }
  const getAllTaskData = async (req, res) => {
    try {
      const taskData = await Taskboard.find();
      res
        .status(200)
        .json({ message: "task board data shown succesfully", taskData });
    } catch (error) {
      console.error(error);
      res.status(500).json("internal server error", error);
    }
  }
  const updateTaskboard = async (req, res) => {
    try {
      const task = await Taskboard.findById(req.params.taskId);
      if (!task) {
        return res.status(404).json({ message: "task not found" });
      }
      task.taskname = req.body.task || task.taskname;
      task.team = req.body.team || task.team;
      task.startDate = req.body.startDate || task.startDate;
      task.endDate = req.body.endDate || task.endDate;
      task.action = req.body.action || task.action;

      result = await task.save();
      res
        .status(200)
        .json({ message: "client is updated succesfully", Result: result });
    } catch (error) {
      console.error(error);
      res.status(500).json("internal server error", error);
    }
  }
  const searchTask = async (req, res) => {
    try {
      const key = req.params.key;
      console.log("Search key:", key);
      const searchQuery = {};
      if (key) {
        searchQuery.taskname = new RegExp(key, "i");
      }
      const searchResults = await Taskboard.find(searchQuery);
      res
        .status(200)
        .json({ message: "search result is :", searchResult: searchResults });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server error", error });
    }
  }
  const dropTask = async (req, res) => {
    try {
      const deleteTask = await Taskboard.findByIdAndDelete(req.params.taskId);
      if (!deleteTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res
        .status(200)
        .json({ message: "Task deleted succesfully", deletedTask: deleteTask });
    } catch (error) {
      console.error(error);
      res.status(500).json("internal server error", error);
    }
  }

  //ticket
  const addNewTicket = async (req, res) => {
    try {
      const maxTicketId = await ticketList
        .findOne({}, { _id: 1 }, { sort: { _id: -1 } })
        .exec();
      const startingId = maxTicketId
        ? parseInt(maxTicketId._id.split("-")[1]) + 1
        : 1;
      const newTicketId = `ASD-${startingId.toString().padStart(4, "0")}`;

      const newTicket = new ticketList({
        ...req.body,
        _id: newTicketId,
      });
      const result = await newTicket.save();
      res
        .status(200)
        .json({ message: "ticket created succesfully", ticket: result });
    } catch (error) {
      console.error(error);
      res.status(500).json("internal server error", error);
    }
  }
  const searchTickets = async (req, res) => {
    try {
      const key = req.params.key;
      const searchQuery = {};
      if (key) {
        searchQuery.title = new RegExp(key, "i");
      }
      const searchResults = await ticketList.find(searchQuery);

      res.status(200).json({ message: "search result is :", searchResults });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server error", error });
    }
  }
  const getAllTicketData = async (req, res) => {
    try {
      const ticketData = await ticketList.find();
      res
        .status(200)
        .json({ message: "ticket data is shown succesfully", ticketData });
    } catch (error) {
      console.error(error);
      res.status(500).json("internal server error", error);
    }
  }

  //todolist
  const addTodoList = async (req, res) => {
    try {
      const newlist = new toDoList(req.body);
      const result = await newlist.save();
      return res
        .status(200)
        .json({ message: "add task in todo list ", result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "internal server error", error });
    }
  }

module.exports = {
  getAllData,
  createClients,
  getClientData,
  searchClients,
  updateClient,
  dropClient,
  createData,
  getAllTaskData,
  addNewTask,
  searchTask,
  updateTaskboard,
  dropTask,
  addNewTicket,
  searchTickets,
  getAllTicketData,
  addTodoList,
  searchProject,
  updateProject,
  dropProject,
  addNewTask,
  searchTask,
  dropTask,
  addNewTicket,
  searchTickets,
  getAllTicketData,
  addTodoList,
  getClientData,
  updateClient,
  dropClient
}
