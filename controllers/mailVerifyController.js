const User = require('../models/user/usermodel.js');
const { validationResult } = require('express-validator');


const mailVerification = async (req, res) => {
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }
        //const userId = req.params.id;
        const user = await User.findOne({_id :req.query.id});

        if (!user) {
            return res.status(404).render('verification',{message: "User not found" });
        } else if (user.isVerified) {
            return res.status(200).render('verification',{message: "Already Verified" });
        } else {
            user.isVerified = true;
            await user.save();
            return res.status(200).render('verification',{message: "Mail Verified successfully"});
        }


    } catch (error) {
        
        return res.status(400).json({ success: false, error: error.message, message: "Internal Server Error" });
        
    }
}

module.exports = {
    mailVerification
}