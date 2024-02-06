const nodemailer= require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    //secure: true, // true for 465, false for other ports
    //requireTLS: true,
    secureConnection: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
})

const sendMail = async (email, subject, content)=>{

    try{
        var mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error);
            }
        console.log('Mail sent ');
        });
    }
    catch(error){
        console.log(error);
    }
}

module.exports ={sendMail} ;