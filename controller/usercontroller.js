
const Client = require("../model/clientSchema");
const ticketList = require("../model/ticketList");
const toDoList = require("../model/todoList");




    //client
    const createClients= async(req,res)=>{
         try{
             const client = new Client(req.body,)
            const result = await client.save()
            res.status(200).json({message:"new client created succesfully",result})

            }catch(error){
                console.error(error)
                res.status(500).json({message:"internal server error", error})
             }
    }
    const getClientData=async(req,res)=>{
        try{
            const clients = await Client.find().populate({ path: 'projects', model: 'Project' })
            const clientsWithDetails = clients.map(client => {
                const totalProjects = client.projects.length;
                const totalDealAmount = client.projects.reduce((total, project) => total + (project.deal || 0), 0);
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

            res.status(200).json({ message: "Client details and project", clients: clientsWithDetails })

        }catch(error){
            console.error(error)
            res.status(500).json({ message: "internal server error", error })
        }
    }
    const searchClients= async (req, res) => {
        try {
            const key = req.params.key;
            const searchQuery = {};
            if (key) {
                searchQuery.clientName = new RegExp(key, 'i');
            }
            const searchResults = await Client.find(searchQuery);

            res.status(200).json({ message: "search result is :", searchResults })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "internal server error", error })
        }
    }
    const updateClient= async (req,res)=>{
        try{
            const client =await Client.findById (req.params.clientId)
            if (!client){
                res.status(404).json(" client id not found")
            }
            client.clientName=req.body.clientName||client.clientName
            client.email=req.body.email|| client.email
            client.link=req.body.link||client.link
            client.place=req.body.place|| client.place
            client.project=req.body.projectId|| client.project

            result=await client.save()
            res.status(200).json({message:"client is updated succesfully", result})

        }catch(error){
            console.error(error)
            res.status(500).json({ message: "internal server error", error })
        }

    }
    const dropClient= async (req, res) => {
        try {
            const dropClient = await Client.findByIdAndDelete(req.params.clientId)
            if (!dropClient) {
                return res.status(404).json({ error: "client not found" });
            }
            res.status(200).json({ message: "client deleted succesfully", dropClient })

        } catch (error) {
            console.error(error)
            res.status(500).json("internal server error", error)
        }
    }

    //ticket 
    const addNewTicket= async (req,res)=>{
        try{
            const maxTicketId = await ticketList.findOne({}, { _id: 1 }, { sort: { _id: -1 } }).exec();
            const startingId = maxTicketId ? parseInt(maxTicketId._id.split('-')[1]) + 1 : 1;
            const newTicketId = `ASD-${startingId.toString().padStart(4, '0')}`;

            const newTicket = new ticketList({
                ...req.body,
                _id: newTicketId})
            const result = await newTicket.save()
            res.status(200).json({message: "ticket created succesfully", ticket: result})

        } catch (error) {
            console.error(error)
            res.status(500).json("internal server error", error)
        }

    }
    const searchTickets= async(req, res)=> {
    try {
        const key = req.params.key;
        const searchQuery = {};
        if (key) {
            searchQuery.title = new RegExp(key, 'i');
        }
        const searchResults = await ticketList.find(searchQuery);

        res.status(200).json({ message: "search result is :", searchResults })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
    }
    const getAllTicketData =async (req, res) => {
        try {
            const ticketData = await ticketList.find()
            res.status(200).json({ message: "ticket data is shown succesfully", ticketData })

        } catch (error) {
            console.error(error)
            res.status(500).json("internal server error", error)
        }
    }

    //todolist
    const addTodoList =async (req,res)=>{
        try{
            const newlist= new toDoList(req.body)
            const result =await newlist.save()
            return res.status(200).json({message:"add task in todo list " , result})

        }catch(error){
            console.error(error)
            return res.status(500).json({message: "internal server error", error})
        }
    }

    

module.exports={
    getAllTicketData,
    addTodoList,
    searchTickets,
    addNewTicket,
    dropClient,
    updateClient,
    searchClients,
    getClientData,
    createClients,

   

}