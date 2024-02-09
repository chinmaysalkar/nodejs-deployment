const Project = require("../models/client/projectSchema");
const Client = require("../models/client/clientSchema");

//project
const createData = async (req, res) => {
    try {

        const project = new Project(req.body);
        console.log(req.params.clientId)
        const client = await Client.findById(req.params.clientId)
        if (!client) {
            console.error("Client not found for project creation. Client ID:", req.params.clientId);
            return res.status(404).json({ message: "client not found for this project please create a client first" })
        }
        const result = await project.save();
        client.projects.push(result._id);

        await client.save();
        res.status(201).json({ message: "new project creataed succesfully", result })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}
const getAllData = async (req, res) => {
    try {
        const project = await Project.find().populate({ path: "team", select: ["employeeName", "_id"] })
        res.status(200).json(project)

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
        const deleteProject = await Project.findByIdAndDelete(req.params.projectId)
        if (!deleteProject) {
            return res.status(404).json({ error: "Project not found" });
        }
        Client.projects.remove(req.params.projectId);
        res.status(200).json({ message: "project deleted succesfully", deleteProject })

    } catch (error) {
        console.error(error)
        res.status(500).json("internal server error", error)
    }
}

module.exports = {
    deleteProject,
    updateProject,
    searchProject,
    createData,
    getAllData,
}