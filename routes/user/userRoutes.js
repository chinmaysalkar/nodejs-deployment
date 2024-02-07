const express = require('express');
const router = express.Router();
const {createUser, forgetPassword, loginUser, userProfile, updateProfile, logout, sendOtp, verifyOtp} = require('../../controllers/userController.js')
const { userValidation,mailVerificationValidation, loginValidation, updateProfileValidation, otpValidation} = require('../../helpers/validation.js');
const {verifyToken} = require('../../middlewares/auth.js');

//Creating new user
router.post('/addUser',userValidation , createUser);

//Forget password
router.post('/forget-password',mailVerificationValidation , forgetPassword);


//Login user
router.post('/login',loginValidation, loginUser)

//Authenticated routes
router.post('/profile',verifyToken, userProfile)
router.post('/update-profile',verifyToken,updateProfileValidation, updateProfile)
router.get('/logout',verifyToken, logout)

//otp related routes
router.post('/send-otp',mailVerificationValidation , sendOtp);

router.post('/verify-otp',otpValidation , verifyOtp);

module.exports = router;