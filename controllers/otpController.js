const Otp = require('../models/user/otpSchema');
const User = require('../models/user/usermodel');
const { validationResult } = require('express-validator');
const { oneMinuteExpiry, threeMinuteExpiry } = require('../middlewares/otpExpiry');
const {sendMail} = require('../middlewares/mailer.js');




const generateRandom4digit = async (req, res) => {
    return Math.floor( 1000+ Math.random() *9000);
}

const sendOtp = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const {email} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({success: false, message: "User not found" });
        } else if (user.isVerified) {
            return res.status(200).json({success: true, message: "Already Verified" });
        } else {
            await user.save();

            const g_otp = await generateRandom4digit(req, res);

            const oldOtpData = await Otp.findOne({user_id: user._id});
            if (oldOtpData) {
                const sendNextOtp = await oneMinuteExpiry(oldOtpData.timestamp)
                if (!sendNextOtp) {
                    return res.status(400)
                    .json({success: false, message: "Please try after some time. "});
                }
            }
            const cdate = new Date();

            await Otp.findOneAndUpdate(
                {user_id: user._id},
                {otp: g_otp, timestamp: new Date(cdate.getTime())},
                {upsert: true, new: true, setDefaultsOnInsert: true},
            )

            const msg = '<p>Hii <b>'+user.name+'</b>, your account has been created successfully.Please verify otp <h4>'+g_otp+' </h4>  </p>';
            sendMail(user.email, 'OTP Verification', msg);            
            return res.status(200).json({message: "Otp has been sent to your email. Please check. "});
        }
    } catch (error) {
        return res.status(400)
      .json({ success: false,
           error: error.message });
        
    }
}

const verifyOtp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                error: errors.array() });
        }

        const {user_id, otp} = req.body;
        const otpData = await Otp.findOne({
            user_id, 
            otp
        });
        if (!otpData) {
            return res.status(400).json({ 
                success: false, 
                error: 'Wrong otp' });
        }
        const isOtpExpired = await threeMinuteExpiry(otpData.timestamp);
        if (isOtpExpired) {
            return res.status(400).json({ 
                success: false, 
                error: 'OTP Expired' });
        }
        
        await User.findByIdAndUpdate({_id:user_id}, { 
            $set:{  
                 isVerified: true
                 }  });

        return res.status(200).json({ 
            success: true, 
            message: 'Otp verified successfully' });

    } catch (error) {
        return res.status(400)
    .json({ success: false, 
        error: error.message });
        
    }
}

module.exports = {
    sendOtp,
    verifyOtp
}