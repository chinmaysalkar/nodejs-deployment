const ticketList = require("../models/client/ticketList");
const ticketComment = require("../models/client/ticketComment");
const User=require("../models/user/profileModel")
const jwt = require('jsonwebtoken');

//ticket 
const addNewTicket = async (req, res) => {
    try {
    
        const newTicket = new ticketList(req.body)
       const user = await User.findById(req.params.userId)
        if(!user){
             return res.status(404).json({message:"Employee not found"})
        }
        newTicket.employee=user.fullName
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
const singleTicketData = async (req, res) => {
    try {
        const ticketData = await ticketList
        .findById(req.params.ticketId)
        .populate({ path: 'comment', select: ["sender", "message"] })
        res.status(200).json({ message: "ticket data is shown succesfully", ticketData })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}
const updateTicket= async (req,res)=>{
    try{
        const ticket = await ticketList.findById(req.params.Id)
          if (!ticket){
           return res.status(404).json({message:"ticket not found"})
          }
        ["title", "department","description","employeeId","priority"].forEach(field=>{
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


//Comments

const addTicketcomment = async (req, res) => {
    try {
       
        // console.log(req.user)
        userId = req.user.userId
        console.log(userId)
        const user =await User.findById(userId)
        if (!user){
            return res.status(404).json("user not found")
        }
        const commentReply = new ticketComment({...req.body, sender:user.fullName});
        const ticket = await ticketList.findById(req.params.ticketId )
        if (!ticket) {
            console.error("Ticket not found for comment. ticket ID:", req.params.ticketId);
            return res.status(404).json({ message: "ticket not found " })
        }
        const result = await commentReply.save();
        await ticketList.findByIdAndUpdate(req.params.ticketId, { $push: { comment: result._id } });
        
        res.status(200).json({ message: " comment succesfully", result })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ messaage: "internal server error" })
    }
}
const getAllComment = async (req,res)=>{
    try{
        const commentList = await ticketComment.find().populate({ path: "sender", select: ["fullName","userId"]})
        res.status(200).json({ messaage: "Comment data", commentList })

    } catch (error) {
        console.error(error)
        res.status(500).json({ messaage: "internal server error" , error})
    }
}
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId
        const delComment = await ticketComment.findByIdAndDelete(commentId)
        if (!delComment) {
            return res.status(404).json({ message: "commentId is not found for deleting the comment" })
        }
           res.status(200).json({ message: "comment deleted succesfully ", delComment })
        await ticketList.updateMany(
            { comment: commentId },
            { $pull: { comment: commentId } }
        );
    } catch (error) {
        console.error(error)
        res.status(500).json({ messaage: "internal server error", error })

    }
}
const updateComment=async (req,res)=>{
    try {
        const comment=await ticketComment.findById(req.params.Id)
        if (!comment){
            res.status(404).json({message:"comment Id not found"})
        }
        comment.message = req.body.message || comment.message
        result= await comment.save()
        res.status(200).json({message:"comment updated succesfully",result})

    }catch(error){
        console.error(error)
        res.status(500).json({ messaage: "internal server error" ,error})

    }

   

}

module.exports={
    getAllTicketData,
    searchTickets,
    addNewTicket,
    deleteTicket,
    updateTicket,
    singleTicketData,

    
    addTicketcomment,
    getAllComment,
    updateComment,
    deleteComment
}