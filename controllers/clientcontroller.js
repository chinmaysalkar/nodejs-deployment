
const Client = require("../models/client/clientSchema");
const User =require("../models/user/usermodel")
const toDoList = require("../models/client/todoList");
const bcrypt = require('bcrypt');
const {uploadClientDocToDrive}=require("../middlewares/upload")
const { sendMail } = require("../middlewares/mailer");

   //client
    const createClients= async(req,res)=>{
        try {
            const maxUserId = await Client.findOne({}, { _id: 1 }, { sort: { _id: -1 } }).exec();
            const startingId = maxUserId ? parseInt(maxUserId._id.split('-')[1]) + 1 : 1;
            const newUserId = `CLI-${startingId.toString().padStart(4, '0')}`;
            if (!req.body.password) {
                return res.status(400).json({ success: false, error: 'Password is required' });
            }
            // const saltRounds = 10;
            // const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newClient = new Client({ ...req.body, _id: newUserId, password: hashedPassword })
            
            //check client is already present or not 
            const existingUser = await Client.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ success: false, error: 'Client with this Email already exists ' });
            }
            //also save data to the user file
            const user = new User({
                ...req.body,
                _id: newUserId,
                password: hashedPassword,
            });
            const savedUser=await user.save();
            
            
            
            // Upload profile photo to Google Drive after saving user data to MongoDB
            if (req.body.profilePhoto) {
               
                    const _id = newUserId;
                    const photoPath = req.body.profilePhoto;
                    // Assuming savedUser is the user object returned after saving to MongoDB
                    const fileId = await uploadClientDocToDrive(_id, photoPath);

                    // Update the user's profilePhoto field with the Google Drive file ID
                    savedUser.profilePhoto = fileId;
            }else{
                    console.error(error);
                    return res.status(400).json({
                        message: "Error occurred while uploading photo ",
                    });
                } 
            const email = req.body.email
            const msg = '<p>Hii ' + req.body.firstName + ' ' + req.body.lastName + ', your account has been created successfully. Please <a href="http://localhost:3000/verify?id=' + newUserId + '">verify</a> your mail </p>';
            
            sendMail(email, ' Verify Account', msg);
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
            await User.findByIdAndDelete(dropClient)
            console.log(dropClient)
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