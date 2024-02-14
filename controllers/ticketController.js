const ticketList = require("../models/client/ticketList");
const ticketComment = require("../models/client/ticketComment");
const User=require("../models/user/usermodel")

//ticket 
const addNewTicket = async (req, res) => {
    try {
    
        const newTicket = new ticketList(req.body)
      
        const user = await User.findById(req.params.userId)
        if(!user){
             return res.status(404).json({message:"Employee not found"})
        }
        const result = await newTicket.save()
        res.status(200).json({ message: "ticket created succesfully", ticket: result })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }

}
const searchTickets = async (req, res) => {
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
const getAllTicketData = async (req, res) => {
    try {
        const ticketData = await ticketList.find().populate({ path: 'comment', select: ["sender", "message"] })
        res.status(200).json({ message: "ticket data is shown succesfully", ticketData })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}
const updateTicket= async (req,res)=>{
    try{
        const ticket = await ticketList.findById(req.params.Id)
        console.log(req.params.Id)
          if (!ticket){
           return res.status(404).json({message:"ticket not found"})
          }
          ["title","department","comment","employeeId","priority"].forEach(field=>{
              ticket[field] = req.body[field] || ticket[field];
          })
        result = await ticket.save()
        res.status(200).json({ message: "Ticket update is updated succesfully", Result: result })

       
    }catch(error){
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}

const deleteTicket = async (req, res) => {
    try {
        const deleteticket = await ticketList.findByIdAndDelete(req.params.ticketId)
        if (!deleteticket){
            return res.status(404).json({ error: "ticket is not found" });
        }
     res.status(200).json({ message: "project deleted succesfully", deleteticket })

    } catch (error) {
        console.error(error)
        res.status(500).json({ messaage: "internal server error" })
    }
}



const updateTicketReplay = async (req, res) => {
    try {
        const comment= req.body.comment
        const ticket = await ticketList.findOneAndUpdate({_id:req.params.Id},
            { $push: { comments: comment } }, 
            { new: true})
        console.log(req.params.Id)
        if (!ticket) {
            return res.status(404).json({ message: "ticket not found" })
        }
       
        const addReply = await ticket.save()
        // result = await addReply.save()
        
        res.status(200).json({ message: "Ticket update is updated succesfully", Result: addReply })


    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}


//Comments

const addTicketcomment = async (req, res) => {
    try {
        const commentReply = new ticketComment(req.body);
        console.log(req.params.ticketId)
        const ticket = await ticketList.findById(req.params.ticketId)
        if (!ticket) {
            console.error("Ticket not found for comment creation. ticket ID:", req.params.ticketId);
            return res.status(404).json({ message: "ticket not found " })
        }
        const result = await commentReply.save();
        console.log(result.result_id)
        ticket.commentReply.push(result._id);
        await ticket.save();

        res.status(201).json({ message: "new project creataed succesfully", result })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ messaage: "internal server error" })
    }
}
const getAllComment = async (req,res)=>{
    try{
        const commentList = await ticketComment.find().populate({ path:"ticket"})
        res.status(200).json({ messaage: "Comment data", commentList })

    } catch (error) {
        console.error(error)
        res.status(500).json({ messaage: "internal server error" })
    }
}

module.exports={
    getAllTicketData,
    searchTickets,
    addNewTicket,
    addTicketcomment,
    deleteTicket,
    updateTicket,
   getAllComment,

    updateTicketReplay,
}