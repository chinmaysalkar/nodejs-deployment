const profile = require("../models/user/profileSchema");
const { validationResult } = require("express-validator");
const User = require("../models/user/usermodel");


const createProfile = async (req, res) => {
    
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userid, email, name, position, role } = req.body;
        
        const user = await User.findById(userid)       
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified==false) {
            return res.status(400).json({ success: false, error: 'User not verified' });
        }

        const existingUser = await profile.findOne({ userid: user._id });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User with this Email already commited the profile' });
        }
        
        
        // Update profile's role
        const updatedProfile = new profile({
            userid: user._id,
            email: user.email,
            name: user.name,
            position: position,
            role: role
        });
        await updatedProfile.save();

        res.status(200).json({
            success: true,
            message: "Profile created successfully",
            data:updatedProfile});

    } catch (error) {
        
        res.status(400).json({ success: false, error: error.message });
    }
};



module.exports = { createProfile };
