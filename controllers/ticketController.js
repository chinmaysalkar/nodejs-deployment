const ticketList = require("../models/client/ticketList");

//ticket 
const addNewTicket = async (req, res) => {
    try {
        const maxTicketId = await ticketList.findOne({}, { _id: 1 }, { sort: { _id: -1 } }).exec();
        const startingId = maxTicketId ? parseInt(maxTicketId._id.split('-')[1]) + 1 : 1;
        const newTicketId = `ASD-${startingId.toString().padStart(4, '0')}`;

        const newTicket = new ticketList({
            ...req.body,
            _id: newTicketId
        })
        const result = await newTicket.save()
        res.status(200).json({ message: "ticket created succesfully", ticket: result })

    } catch (error) {
        console.error(error)
        res.status(500).json("internal server error", error)
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
        const ticketData = await ticketList.find()
        res.status(200).json({ message: "ticket data is shown succesfully", ticketData })

    } catch (error) {
        console.error(error)
        res.status(500).json("internal server error", error)
    }
}


module.exports={
    getAllTicketData,
    searchTickets,
    addNewTicket
}