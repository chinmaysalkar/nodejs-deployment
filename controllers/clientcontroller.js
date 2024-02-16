
const Client = require("../models/client/clientSchema");
const toDoList = require("../models/client/todoList");
const bcrypt = require('bcrypt');


   //client
    const createClients= async(req,res)=>{
        try {
            const maxUserId = await Client.findOne({}, { _id: 1 }, { sort: { _id: -1 } }).exec();
            const startingId = maxUserId ? parseInt(maxUserId._id.split('-')[1]) + 1 : 1;
            const newUserId = `CLI-${startingId.toString().padStart(4, '0')}`;
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            const newClient = new Client({ ...req.body, _id: newUserId, password: hashedPassword })
            
            

            const saveClient = await newClient.save()
            res.status(200).json({message:"new client created succesfully",saveClient})

            }catch(error){
                console.error(error)
                res.status(500).json({message:"internal server error", error})
             }
    }
    const getClientData=async(req,res)=>{
        try{
            const clients = await Client
                       .find()
                       .populate({ path: 'projects', select:["pname","creator","team","deal"] })
           //manually populate  
              const clientsWithDetails = clients.map(client => {
                const totalProjects = client.projects.length;
                const totalDealAmount = client.projects.reduce((total, project) => total +Number(project.deal || 0), 0);
                return {
                    _id: client._id,
                    clientName: client.clientName,
                    clientEmail: client.clientEmail,
                    place: client.place,
                    link: client.link,
                    companyName:client.companyNameName,
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
            const client =await Client.findByIdAndUpdate(req.params.Id)
            console.log(client)
            if (!client){
                return  res.status(404).json(" client id not found")
            }
            
            ["clientName", "clientEmail", "projects", "link","place","compalyName"].forEach(field =>{
            client[field] = req.body[field] || client[field]
          });

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