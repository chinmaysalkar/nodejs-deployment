const bcrypt = require('bcrypt');
const User = require("../models/user/userModel");
const Profile = require("../models/user/profileModel");
const { validationResult } = require("express-validator");
const {sendMail} = require("../middlewares/mailer");

const createUser = async (req, res) => {
    try {


        const { firstName, lastName, email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }
        
 
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User with this Email already exists ' });
        }

        saltRounds =10;

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        const savedUser = await user.save();

        
        const profile = new Profile({
            userId: savedUser._id,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword
        });
        await profile.save();

        const msg = '<p>Hii '+firstName+' '+lastName+', your account has been created successfully. Please <a href="http://localhost:3000/verify?id='+savedUser._id+'">verify</a> your mail </p>';

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

const updateUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        let user = await User.findOne({ _id: req.body.id });

        if (!user) {
            return res.status(400).json({ success: false, error: 'No user found with this email' });
        }
        
        if(req.body.firstName) {
            user.firstName = req.body.firstName;
        }
        if(req.body.lastName) {
            user.lastName = req.body.lastName;
        }
        if(req.body.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            user.password = hashedPassword;
        }

        user = await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'User updated successfully', 
            data: user 
        });

    }catch (error) {
        return res.status(400).json({ 
            success: false ,error: error.message 
        });
    }
}

const viewUser = async (req, res) => {
    try {

    }catch (error) {
        return res.status(400).json({ 
            success: false ,error: error.message 
        });
    }
}

const deleteUser = async (req, res) => {
    try {

    }catch (error) {
        return res.status(400).json({ 
            success: false ,error: error.message 
        });
    }
}

module.exports = {
    createUser, deleteUser, viewUser, updateUser
}