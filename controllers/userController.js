const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const Profile = require('../models/user/profileSchema.js');
//model imported
const User = require('../models/user/usermodel.js'); 

const {sendMail} = require('../middlewares/mailer.js');

const createUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Please include name, email and password' });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User with this Email already exists' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await user.save();

        const msg = '<p>Hii '+name+', your account has been created successfully. Please <a href="http://localhost:5500/auth/verify?id='+savedUser._id+'">verify</a> your mail </p>';

        sendMail(email, ' Verify Account', msg);

        return res.status(200).json({ 
            success: true ,message: "Registered successfully", data: savedUser
        });

    } catch (error) {
        return res.status(400).json({ 
            success: false ,error: error.message 
        });
    }
};


const viewUser = async (req, res) => {
    try {
        const userData = req.user;
        return res.status(400)
        .json({ success:true,
             message: "User Profile Data!",
             data:userData});

    } catch (error) {
        return res.status(400)
        .json({ success: false,
             error: error.message });
    }
}

const updateUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const { name, email } = req.body;
        const data = {name, email};


        if(data.email) {

            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ success: false, error: 'User with this Email already exists' });
            }

            const verificationMsg = '<p>Hii '+data.name+', please click <a href="http://localhost:5500/auth/verify?id='+req.user.user._id+'">here</a> to verify your new email address</p>';

            // Save verification token and new email to the user document for later comparison
            await User.findByIdAndUpdate({_id:req.user.user._id}, { 
                $set:{ newEmail: data.email, isVerified:false }
            });
            sendMail(data.email, 'Verify New Email', verificationMsg);
        }

        const userData =await User.findByIdAndUpdate({_id:req.user.user._id}, { 
            $set:{  
                 name: data.name,
                 email: data.email
                 }},{new:true } );

        return res.status(200).json({ 
            success: true,message: "Profile Updated successfully",data: userData
        });

    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}


const deleteUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }
        
        const deletedUser = await User.findByIdAndDelete({_id:req.user.user._id});

        if (!deletedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        await Profile.findOneAndDelete({ email: deletedUser.email });

        if (!deletedUser) {
            return res.status(404).json({ success: false, error: 'User already deleted' });
        }
        
        res.status(200).json({ success: true, message: "User and his/her profile deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};





module.exports = {
  createUser,
  viewUser,
  updateUser,
  deleteUser
}; 
