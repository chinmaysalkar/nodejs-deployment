const ticketList = require("../models/client/ticketList");
const ticketComment = require("../models/client/ticketComment");
//ticket 
const addNewTicket = async (req, res) => {
    try {
    
        const newTicket = new ticketList(req.body)
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
        const ticketData = await ticketList.find().populate({ path: "comment", select: ["sender","message", "_id"] })
        res.status(200).json({ message: "ticket data is shown succesfully", ticketData })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}


const addTicketcomment = async (req, res) => {
    try {
       
        const newComment = new ticketComment(req.body);
        const ticket = await ticketList.findById(req.params.ticketId)
        if (!ticket) {
            console.error("ticket not found for  created comment. Client ID:", req.params.ticketId);
            return res.status(404).json({ message: "comment added succesfully" })
        }
        const result = await newComment.save()
        console.log(result)
        res.status(200).json({ message: "new comment add succesfully", result })
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
}