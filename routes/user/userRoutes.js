const express = require('express');
const router = express.Router();
const {createUser,  deleteUser, viewUser, updateUser} = require('../../controllers/userController.js')
const {loginUser, logout} = require('../../controllers/loginOutController.js')
const {forgetPassword} = require('../../controllers/passwordController.js')
const { userValidation,mailVerificationValidation, loginValidation, updateProfileValidation, otpValidation} = require('../../middlewares/validation.js');
const {verifyToken} = require('../../middlewares/token.js');
const {sendOtp,verifyOtp} = require('../../controllers/otpController.js');
const {placeOrder} = require('../../controllers/orderController.js');



//Creating new user
router.post('/createUser',userValidation , createUser);

//Forget password
router.post('/forget-password',mailVerificationValidation , forgetPassword);

//Login user
router.post('/login',loginValidation, loginUser)

//Authenticated routes
router.get('/userProfile',verifyToken, viewUser)
router.post('/updateProfile',verifyToken, updateProfileValidation, updateUser)
router.get('/logout',verifyToken, logout)
router.delete('/deleteUser',verifyToken, deleteUser)
    
//otp routes
router.post('/send-otp',mailVerificationValidation , sendOtp);
router.post('/verify-otp',otpValidation , verifyOtp);

router.post('/placeOrder', placeOrder)
module.exports = router;