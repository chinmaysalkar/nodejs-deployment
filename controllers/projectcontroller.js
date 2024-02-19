const Project = require("../models/client/projectSchema");
const Client = require("../models/client/clientSchema");
const upComing = require("../models/client/upcomingProject")
//project
const createData = async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId)
        if (!client) {
            console.error("Client not found for project creation. Client ID:", req.params.clientId);
            return res.status(404).json({ message: "client not found for this project please create a client first" })
        }
        const project = new Project({ ...req.body, owner: client.clientName});
        console.log (req.body)
        const result = await project.save();
        client.projects.push(result._id);
        await client.save(result._id);
        
         res.status(201).json({ message: "new project created succesfully", result })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}
const getAllData = async (req, res) => {
    try {
        const project = await Project.find()
            .populate({ path: "team", select: ["firstName", "_id"] })
              .populate({ path: "task", select: ["taskname", "_id"] })
        res.status(200).json({ message: "Project created succesfully", project })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}
const searchProject = async (req, res) => {
    try {
        const key = req.params.key;
       
        const searchQuery = key ? { pname: new RegExp(key, 'i') } : {};
        const searchResults = await Project.find(searchQuery);

        res.status(200).json({ message: "Search result:", searchResults });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}
const updateProject = async (req, res) => {
    try {
        const projectIdToUpdate = req.params.projectId;
        const project = await Project.findById(projectIdToUpdate);

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        ['pname', 'description', 'tools', 'createDate', 'creator', 'clientEmail', 'team', 'deal'].forEach(field => {
            project[field] = req.body[field] || project[field];
        });

        const updatedProject = await project.save();
       res.status(200).json({ message: "Project updated successfully", project: updatedProject });


    } catch (error) {
        console.error(error)
         res.status(500).json({ error: "Internal server error", details: error.message }); // Use an object with an "error" property


    }
}
const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const deleteProject = await Project.findByIdAndDelete(projectId)
        if (!deleteProject) {
            return res.status(404).json({ error: "Project not found" });
        }
        // Client.projects.remove(req.params.projectId);
        res.status(200).json({ message: "project deleted succesfully", deleteProject })
        await Client.updateMany(
            { projects: projectId },
            { $pull: { projects: projectId } }
        );
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error", error });
    }
}
const upcomingProject =async (req,res)=>{ 
    try{
        const upcoming = await Project.find().select('owner milestone priority duration team')
        res.status(200).json({ message: "Upcoming project saved succesfully", upcoming })

    }catch(error){
        console.error(error)
        res.status(500).json({message:"internal server error"})
    }
}
const ongoingProject =async (req,res)=>{
    try {

        const projectId = req.params.projectId
        const ongoing = await Project.findById({_id:projectId})
        console.log(projectId)
        if (!ongoing){
            return res.status(404).json({messsage:" project not found "})
        }
        ongoing.status=true
        await ongoing.save()

            res.status(200).json({ message: "project update for ongoing succesfully "})

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error" })
    }
}
const viewOngoing =async(req,res)=>{
    try {
        const viewOngoingProject = await Project.find({ status: true })
            .populate({ path: "team", select: ["firstName", "_id"] })
            .populate({ path: "task", select: ["taskname", "_id"] })
        if (viewOngoingProject.length>0){
            res.status(200).json({message:"ongoing project show succesfully",viewOngoingProject})
        }else{
            res.status(404).json({message:"no ongoing project found"})
        }
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error" })
    } 
}
  
module.exports = {
    deleteProject,
    updateProject,
    searchProject,
    createData,
    getAllData,
    upcomingProject,
    ongoingProject,
    viewOngoing

}