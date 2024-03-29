const  ticketList = require("../models/client/ticketList")
const ticketComment = require("../models/client/ticketComment");
const User=require("../models/user/usermodel")
const ticketLikes= require("../models/client/ticketLikes")
const { sendMail } = require("../middlewares/mailer");
const Profile = require("../models/user/profileModel")
const { uploadClientDocToDrive } = require("../middlewares/upload")

//ticket 
const addNewTicket = async (req, res) => {
    try {
        //gives unique Id
        const maxUserId = await ticketList.findOne({}, { _id: 1 }, { sort: { _id: -1 } }).exec();
        const startingId = maxUserId ? parseInt(maxUserId._id.split('-')[1]) + 1 : 1;
        const newUserId = `TIC-${startingId.toString().padStart(4, '0')}`;
        
        const user = await Profile.findById(req.params.userId)
        if (!user) {
            return res.status(404).json({ message: "Employee not found" })
        }
        const newTicket = new ticketList({ 
            ...req.body,
             _id: newUserId,
            createdBy: req.params.userId })
      
       
        // if (req.body.ticketDoc) {

        //     const _id = newUserId;
        //     const photoPath = req.body.ticketDoc;
        //     // Assuming savedUser is the user object returned after saving to MongoDB
        //     const fileId = await uploadClientDocToDrive(_id, photoPath);

        //     // Update the user's profilePhoto field with the Google Drive file ID
        //     newTicket.ticketDoc = fileId;
        // } else {
        //     console.error(error);
        //     return res.status(400).json({
        //         message: "Error occurred while uploading photo ",
        //     });
        // } 
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
        const searchField = ['title', '_id', 'department', 'priority']
        const searchQuery = { 
            $or:searchField.map(field=>({[field]: new RegExp( key , 'i')}))
        };
        
        const searchResults = await ticketList.find(searchQuery);

        res.status(200).json({ message: "search result is :", searchResults })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}
const getAllTicketData = async (req, res) => {
    try {
        const ticketData = await ticketList
            .find()
            .populate({ path: 'comment', select: ["sender", "message"] })
            .populate({ path: 'likesBy'})//select: ["like_By"]
        
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
            .populate({ path: 'likesBy', select: ["likeBy"] })

            // const likeCount= ticketData.likesBy.length 
            //  ticketData.likes=likeCount
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
         if (ticket.closed==true) {
            return res.status(400).json({ message: 'Ticket is already closed' });
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
const closeTicket=async(req,res)=>{
    try{
        const ticket = await ticketList.findById(req.params.Id)
        if (!ticket) {
            return res.status(404).json({ message: "ticket not found" })
        }
        
        if (ticket.closed) {
            return res.status(400).json({ message: 'Ticket is already closed' });
        }
        ticket.closed=true;
        await ticket.save()
        res.status(200).json({message:"ticket is closed"})
    } catch (error) {
        console.error(error)
        res.status(500).json({ messaage: "internal server error" })
    }
}


//Comments

const addTicketcomment = async (req, res) => {
    try {
         userId = req.user.userId
        
      const user =await User.findById(userId)
        
        if (!user){
            return res.status(404).json("user not found")
        } 
        //check ticket is available or not n
        const ticket = await ticketList.findById(req.params.ticketId)
        if (!ticket) {
            console.error("Ticket not found for comment. ticket ID:", req.params.ticketId);
            return res.status(404).json({ message: "ticket not found " })
        }
        //check ticket is closed or not 
        if (ticket.closed == true) {
            return res.status(400).json({ message: 'Ticket is already closed' });
        }
       
        const commentReply = new ticketComment({ ...req.body, sender: user.firstName });
        
        
        const result = await commentReply.save();
         //mail to the ticket creator
    //     const ticketCreator = await Profile.findById(ticket.createdBy);

    //    const subject ="Commented on your ticket"
    //   const msg =
    //         "<p>Hey " +
    //       user.username +
    //         ', is commented on your ticket '
    //            \n  result.message
            
    //     sendMail(ticketCreator.email, subject, msg);
       
         res.status(200).json({ message: " comment succesfully", result })
         const reply=ticket.comment.length
        console.log(reply)
        await ticketList.findByIdAndUpdate(req.params.ticketId, { $push: { comment: result._id , activity:reply } });
        
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
        if (ticket.closed == true) {
            return res.status(400).json({ message: 'Ticket is already closed' });
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

//likes and unlikes
const likeTicket = async (req,res)=>{
    try{
        userId = req.user.userId
       console.log(userId)
        //check the user 
        const user = await User.findById(userId)
        console.log(user)
        if (!user) {
            return res.status(404).json("user not found")
        } 
        // check the ticket 
        const ticket = await ticketList.findById(req.params.ticketId)
        if (!ticket) {
            console.error("Ticket not found for like the post. ticket ID:", req.params.ticketId);
            return res.status(404).json({ message: "ticket not found " })
        }
        const likes = new ticketLikes({ ...req.body, likeBy: user.fullName, likeUserId: req.user.userId });
        const result = await likes.save();
        //count likes
        const likesCount= ticket.likesBy.length
        
        await ticketList.findByIdAndUpdate(req.params.ticketId, { $push: { likesBy: result._id, likes: likesCount } });
        
        res.status(200).json({ message: "  succesfully like the post", result })


    } catch (error) {
        console.error(error)
        res.status(500).json({ messaage: "internal server error", error })

    }
   
}


module.exports={
    getAllTicketData,
    searchTickets,
    addNewTicket,
    deleteTicket,
    updateTicket,
    singleTicketData,
    closeTicket,

    
    addTicketcomment,
    getAllComment,
    updateComment,
    deleteComment,
    likeTicket,
}