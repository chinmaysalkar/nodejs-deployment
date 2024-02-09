const express = require('express');
const router = express.Router();
const {createUser,  deleteUser, viewUser, updateUser} = require('../../controllers/userController.js')
const {loginUser, logout} = require('../../controllers/loginOutController.js')
const {forgetPassword} = require('../../controllers/passwordController.js')
const { userValidation,mailVerificationValidation, loginValidation, updateProfileValidation, otpValidation, profileValidation, placeOrderValidation, updateOrderValidation, payrollValidation, updateStatusValidation} = require('../../middlewares/validation.js');
const {verifyToken} = require('../../middlewares/token.js');
const {sendOtp,verifyOtp} = require('../../controllers/otpController.js');
const {placeOrder, updateOrderStatus, viewOrders} = require('../../controllers/orderController.js');
const {createProfile} = require('../../controllers/profileController.js');
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
    
//otp routes
router.post('/send-otp',mailVerificationValidation , sendOtp);
router.post('/verify-otp',otpValidation , verifyOtp);

router.post('/createProfile', profileValidation, createProfile);
router.post('/placeOrder',placeOrderValidation, placeOrder);
router.put('/updateOrderStatus',updateOrderValidation, updateOrderStatus);
router.get('/viewOrders',viewOrders);
router.post('/payroll',payrollValidation, payroll);
router.put('/updatePayrollStatus',updateStatusValidation, updatePayrollStatus);
router.put('/payrollReset',payRollreset);


module.exports = router;