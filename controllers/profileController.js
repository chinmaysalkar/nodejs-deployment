const bcrypt = require('bcrypt');
const profile = require("../models/user/profileSchema");
const { validationResult } = require("express-validator");
const User = require("../models/user/usermodel");
const { getNextUserId, mergeAndFormatName } = require("../middlewares/helpers");
const {sendMail} = require("../middlewares/mailer");

const createProfile = async (req, res) => {
    
    try {

        const nextId = await getNextUserId();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const { email, fullName, mobile, department, designation, role , password } = req.body;
        

        const existingUser = await profile.findOne({ email:email});
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User with this Email already exist in the profile' });
        }
        //create username using fullName
        const  mergedName  = mergeAndFormatName(fullName);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        
        
        // Update profile's role
        const updatedProfile = new profile({
            userId: nextId,
            email: email,
            fullName: fullName,
            mobile: mobile,
            department: department,
            designation: designation,
            role: role,
            username: mergedName,
            password: hashedPassword,
        });

        const savedUser = await updatedProfile.save();

        const msg = '<p>Hii '+fullName+', your account has been created successfully. Please <a href="http://localhost:5500/auth/verify?id='+savedUser._id+'">verify</a> your mail </p>';

        sendMail(email, ' Verify Account', msg);


        res.status(200).json({
            success: true,
            message: "Profile created successfully",
            data:updatedProfile});

    } catch (error) {
        
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const profileData = await profile.findOne({ _id:req.body.id });
        if (!profileData) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        // const existingUser = await User.findOne({ email: req.body.email });
        // if (existingUser) {
        //     return res.status(400).json({ success: false, error: 'User with this Email already exists' });
        // }



        // Check which fields are present in the request body and update accordingly
        if (req.body.email) {
            profileData.email = req.body.email;
            
            const msg = '<p>Hii '+fullName+', your account has been created successfully. Please <a href="http://localhost:5500/auth/verify?id='+savedUser._id+'">verify</a> your mail </p>';

            const userData =await User.findByIdAndUpdate({_id:req.body.id}, { 
                $set:{ newEmail: data.email, isVerified:false }
            },{new:true } );
            sendMail(data.email, 'Verify New Email', msg);
                 

        }

        if (req.body.fullName) {
            profileData.fullName = req.body.fullName;
            // Update the username based on the fullName
            profileData.username = mergeAndFormatName(req.body.fullName);
        }

        if (req.body.mobile) {
            profileData.mobile = req.body.mobile;
        }
        if (req.body.department) {
            profileData.department = req.body.department;
        }
        if (req.body.designation) {
            profileData.designation = req.body.designation;
        }
        if (req.body.position) {
            profileData.position = req.body.position;
        }
        if (req.body.role) {
            profileData.role = req.body.role;
        }
        if (req.body.password) {
            profileData.password = req.body.password;
        }

        

        await profileData.save();
        res.status(200).json({ success: true, message: 'Profile updated successfully', data: profileData });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}



module.exports = { createProfile, updateProfile };
