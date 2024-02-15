const bcrypt = require('bcrypt');
const User = require("../models/user/usermodel");
const { validationResult } = require("express-validator");
const { getNextUserId, mergeAndFormatName } = require("../middlewares/helpers");
const {sendMail} = require("../middlewares/mailer");
const AccessTokenModel = require("../models/user/accessTokenSchema");
const Blacklist = require("../models/user/blacklistSchema");
const { deleteOldAccessToken } = require('../middlewares/blacklist');
const {uploadProfilePhotoToDrive} = require('../middlewares/upload')

const createUser = async (req, res) => {
    
    try {
      const nextId = await getNextUserId();

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
      }
      
      

      const {
        email,
        fullName,
        mobile,
        department,
        designation,
        role,
        password,
        profilePhoto
      } = req.body;


      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "User with this Email already exist in the profile",
        });
      }
      //create username using fullName
      const mergedName = mergeAndFormatName(fullName);

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      // Update profile's role
      const updatedProfile = new User({
        userId: nextId,
        email,
        fullName,
        mobile,
        department,
        designation,
        role,
        username: mergedName,
        password: hashedPassword,
        profilePhoto,
      });


      const savedUser = await updatedProfile.save();

      // Upload profile photo to Google Drive after saving user data to MongoDB
      try {
        const userId = savedUser.userId;
        const photoPath = savedUser.profilePhoto;
        // Assuming savedUser is the user object returned after saving to MongoDB
        const fileId = await uploadProfilePhotoToDrive(userId, photoPath);

        // Update the user's profilePhoto field with the Google Drive file ID
        savedUser.profilePhoto = fileId;
      } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({
          success: false,
          message: "Error occurred while uploading photo and updating user's profile",
        });
      }
    
      const msg =
        "<p>Hii " +
        fullName +
        ', your account has been created successfully. Please <a href="http://localhost:5500/auth/verify?id=' +
        savedUser._id +
        '">verify</a> your mail </p>';
      sendMail(email, " Verify Account", msg);

      res.status(200).json({
        success: true,
        message: "Profile created successfully",
        data: updatedProfile,
      });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const profileData = await User.findOne({ _id:req.body.id });
        if (!profileData) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        // Check which fields are present in the request body and update accordingly
        if (req.body.email) {
            profileData.email = req.body.email;
            
            const msg = '<p>Hii '+fullName+', your account has been created successfully. Please <a href="http://localhost:5500/auth/verify?id='+savedUser._id+'">verify</a> your mail </p>';

            const userData =await profile.findByIdAndUpdate({_id:req.body.id}, { 
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
const viewUser = async (req, res) => {
    try {
        const userData = await User.find({});

        return res.status(200)
        .json({ success:true,
             message: "User Profile Data!",
             data:userData});

    } catch (error) {
        return res.status(400)
        .json({ success: false,
             error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
      }
      
      const deletedUser = await User.findByIdAndDelete({ _id: req.body.id });

      //const deletedUser = await User.findById({ _id: req.body.id });

      if (!deletedUser) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      if (!deletedUser) {
        return res
          .status(404)
          .json({ success: false, error: "User already deleted" });
      }
      deleteOldAccessToken(deletedUser._id);

      res
        .status(200)
        .json({
          success: true,
          message: "User and his/her profile deleted successfully",
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateVerificationStatus = async (req, res) => {
    try {
        const {id} = req.body;
        const user = await User.findOne({_id: id});
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        if(user.isVerified == false){
            user.isVerified = true;
        }
        else{
            user.isVerified = false;
        }
        
        await user.save();

        return res.status(200).json({ success: true, message: 'User verification status updated' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};




module.exports = { createUser, updateUser ,viewUser, deleteUser,updateVerificationStatus };
