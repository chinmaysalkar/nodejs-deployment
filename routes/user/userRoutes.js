const express = require('express');
const router = express.Router();
const {createUser,  deleteUser, viewUser, updateUser, updateVerificationStatus} = require('../../controllers/profileController.js')
const {loginUser, logout} = require('../../controllers/loginOutController.js')
const {forgetPassword} = require('../../controllers/passwordController.js')
const { mailVerificationValidation, loginValidation, updateProfileValidation, otpValidation, profileValidation, placeOrderValidation, updateOrderValidation, payrollValidation, updateStatusValidation} = require('../../middlewares/validation.js');
const {verifyToken} = require('../../middlewares/token.js');
const {sendOtp,verifyOtp} = require('../../controllers/otpController.js');
const {placeOrder, updateOrderStatus, viewOrders, CancelOrder} = require('../../controllers/orderController.js');
const { payroll, updatePayrollStatus, payRollreset } = require('../../controllers/payrollController.js');
const { getHolidays } = require('../../controllers/holidaysController.js');



//Routes
router.post('/createProfile', profileValidation, createUser);
router.post('/forget-password',mailVerificationValidation , forgetPassword);
router.post('/login',loginValidation, loginUser)

//Authenticated routes

router.get('/logout',verifyToken, logout)  
router.post('/updateUser',verifyToken, updateProfileValidation, updateUser); 
router.get('/viewUser',verifyToken, viewUser); 
router.delete('/deleteUser',verifyToken, deleteUser)
router.post('/updateVerificationStatus',verifyToken, updateVerificationStatus); 


router.post('/placeOrder',verifyToken,placeOrderValidation, placeOrder);
router.put('/updateOrderStatus',verifyToken, updateOrderValidation, updateOrderStatus);
router.get('/viewOrders',verifyToken, viewOrders);
router.get('/cancelOrder',verifyToken, CancelOrder);
router.post('/payroll',verifyToken,payrollValidation, payroll);
router.put('/updatePayrollStatus',verifyToken, updateStatusValidation, updatePayrollStatus);
router.put('/payrollReset',verifyToken, payRollreset);
router.get('/getHolidays', getHolidays);



//otp routes
router.post('/send-otp',mailVerificationValidation , sendOtp);
router.post('/verify-otp',otpValidation , verifyOtp);







module.exports = router;