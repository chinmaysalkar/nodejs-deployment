const express = require('express');
const router = express.Router();
const { resetSuccess} = require('../../controllers/passwordController.js');
const {resetPassword, updatePassword} = require('../../controllers/passwordController.js')
const {mailVerification} = require('../../controllers/mailVerifyController.js')

const {mailVerificationValidation} = require('../../middlewares/validation.js');

router.get('/verify',mailVerificationValidation, mailVerification);

router.get('/reset-password',mailVerificationValidation , resetPassword);

router.post('/reset-password',mailVerificationValidation , updatePassword);

router.get('/reset-success',mailVerificationValidation , resetSuccess);
 
module.exports = router;
