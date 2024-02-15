const nodemailer = require('nodemailer');
const {sendMail}=require("../middlewares/mailer")
const Client = require("../models/client/clientSchema");
const mailToClient = async (req,res)=>{
    try {
        const client= await Client.findById(req.params.clientId)
         if(!client){
            return res.status(404).json({message:"client not found for send email"})

         }
        const clientEmail =client.clientEmail
        console.log(clientEmail)
        const {  subject, content } = req.body;
        if (!subject|| !content){
            return res.status(404).json({message:"missing field"})
        }
        await sendMail(clientEmail, subject, content )
        res.status(200).json({message:"email sent succesfully"})
    }catch (error){
        console.log(error)
        res.status(500).json({message:"interrnal server error",error})
    }
}

module.exports={
    mailToClient
}
