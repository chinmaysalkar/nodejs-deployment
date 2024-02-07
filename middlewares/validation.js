const { check } = require("express-validator");

const userValidation = [
    check("name","Name is required").not().isEmpty(),
    check("email","Please enter valid email").isEmail(),
    check("password","Password must be at least 6 characters consists of at least 1 lowercase, 1 uppercase, 1 number and 1 symbol ").isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        maxLength: 14
    }),
];

const mailVerificationValidation = [
    check("email","Please enter valid email").isEmpty(),
];

const loginValidation =[
    check("email","Please enter valid email").not().isEmpty().isEmail(),
    check("password","Password is required").not().isEmpty(),
]
const updateProfileValidation =[
    check("name","Name is required").not().isEmpty(),
    check("email","Please enter valid email").optional().isEmail()
]
const otpValidation =[
    check("user_id","User id is required").not().isEmpty(),
    check("otp","Please enter valid otp").not().isEmpty()
]

module.exports = {
    userValidation, 
    mailVerificationValidation, 
    loginValidation, 
    updateProfileValidation,
    otpValidation 
};