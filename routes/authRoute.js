const express = require('express');
const router = express.Router();
const {mailVerification, resetPassword, updatePassword, resetSuccess} = require('../controllers/userController.js')
const {mailVerificationValidation} = require('../helpers/validation.js');



router.get('/verify',mailVerificationValidation, mailVerification);

router.get('/reset-password',mailVerificationValidation , resetPassword);

router.post('/reset-password',mailVerificationValidation , updatePassword);

router.get('/reset-success',mailVerificationValidation , resetSuccess);
 
module.exports = router;
