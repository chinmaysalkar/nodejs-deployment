const express = require('express');
const router = express.Router();
const {createUser,  deleteUser, viewUser, updateUser} = require('../../controllers/userController.js')
const {loginUser, logout} = require('../../controllers/loginOutController.js')
const {forgetPassword} = require('../../controllers/passwordController.js')
const { userValidation,mailVerificationValidation, loginValidation, updateProfileValidation, otpValidation, profileValidation, placeOrderValidation, updateOrderValidation, payrollValidation, updateStatusValidation} = require('../../middlewares/validation.js');
const {verifyToken} = require('../../middlewares/token.js');
const {sendOtp,verifyOtp} = require('../../controllers/otpController.js');
const {placeOrder, updateOrderStatus, viewOrders} = require('../../controllers/orderController.js');
const {createProfile, updateProfile} = require('../../controllers/profileController.js');
const { payroll, updatePayrollStatus, payRollreset } = require('../../controllers/payrollController.js');



//Routes
router.post('/createUser',userValidation , createUser);
router.post('/login',loginValidation, loginUser)
//Forget password
router.post('/forget-password',mailVerificationValidation , forgetPassword);

//Authenticated routes
router.get('/viewUser',verifyToken, viewUser)
router.post('/updateUser',verifyToken, updateProfileValidation, updateUser)
router.get('/logout',verifyToken, logout)
router.delete('/deleteUser',verifyToken, deleteUser)
router.post('/createProfile',verifyToken, profileValidation, createProfile);    
router.post('/updateProfile',verifyToken, updateProfileValidation, updateProfile); 
router.post('/placeOrder',verifyToken,placeOrderValidation, placeOrder);
router.put('/updateOrderStatus',verifyToken, updateOrderValidation, updateOrderStatus);
router.get('/viewOrders',verifyToken, viewOrders);
router.post('/payroll',verifyToken,payrollValidation, payroll);
router.put('/updatePayrollStatus',verifyToken, updateStatusValidation, updatePayrollStatus);
router.put('/payrollReset',verifyToken, payRollreset);


//otp routes
router.post('/send-otp',mailVerificationValidation , sendOtp);
router.post('/verify-otp',otpValidation , verifyOtp);







module.exports = router;