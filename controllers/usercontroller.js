
const Client = require("../models/clientSchema");
const toDoList = require("../models/todoList");

   //client
    const createClients= async(req,res)=>{
         try{
             const newClient = new Client(req.body,)
            const saveClient = await newClient.save()
            res.status(200).json({message:"new client created succesfully",saveClient})

            }catch(error){
                console.error(error)
                res.status(500).json({message:"internal server error", error})
             }
    }
    const getClientData=async(req,res)=>{
        try{
            const clients = await Client.find().populate({ path: 'projects', select:["pname","creator","team","deal"] })
            const clientsWithDetails = clients.map(client => {
                const totalProjects = client.projects.length;
                const totalDealAmount = client.projects.reduce((total, project) => total +Number(project.deal || 0), 0);
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
            const searchQuery = key ? { clientName: new RegExp(key, 'i') } : {};
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
    const deleteClient = async (req, res) => {
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


module.exports={
    deleteClient,
    updateClient,
    searchClients,
    getClientData,
    createClients,
   
}