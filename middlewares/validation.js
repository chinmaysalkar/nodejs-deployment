const { check } = require("express-validator");



const mailVerificationValidation = [
    check("email","Please enter valid email").isEmpty(),
];

const loginValidation =[
    check("email","Please enter valid email").not().isEmpty().isEmail(),
    check("password","Password is required").not().isEmpty(),
]

const otpValidation =[
    check("user_id","User id is required").not().isEmpty(),
    check("otp","Please enter valid otp").not().isEmpty()
]
const profileValidation =[
    check("email","Please enter valid email").not().isEmpty(),
    check("fullName","Name is required").not().isEmpty(),
    check("mobile","Please enter valid mobile number").not().isEmpty(),
    check("department","Department is required").not().isEmpty(),
    check("designation","Role is required").not().isEmpty(),
    check("role","Role is required").not().isEmpty(),
    check("password","Password must be at least 6 characters consists of at least 1 lowercase, 1 uppercase, 1 number and 1 symbol ").isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        maxLength: 14
    })
]

const updateProfileValidation =[
    check("email","Please enter valid email").optional().not().isEmpty().isEmail(),
    check("mobile","Please enter valid mobile number").optional().not().isEmpty().isLength(10) ,
    check("password","Password must be at least 6 characters consists of at least 1 lowercase, 1 uppercase, 1 number and 1 symbol ").optional().isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        maxLength: 14
    })
]
const placeOrderValidation =[
    check("items","Please enter items name").not().isEmpty(),
    check("orderedFrom","Enter the provider name").not().isEmpty(),
    check("orderedBy","Name is required").not().isEmpty(),
    check("orderDate","Date is required").not().isEmpty(),
    check("paidBy","Payment platform required").not().isEmpty(),
    check("status","Status is required").not().isEmpty(),
    check("amount","Please specify the amount").not().isEmpty().isNumeric()
]
const updateOrderValidation =[
    check("orderId","OrderId is required").not().isEmpty(),
]
const updateStatusValidation =[
    check("userid","userid is required").not().isEmpty(),
]

const payrollValidation =[
    check("userid","Please enter valid userid").not().isEmpty(),
    check("email","Enter the provider name").not().isEmpty(),
    check("salary","Payment platform required").not().isEmpty(),
]


module.exports = {
     
    mailVerificationValidation, 
    loginValidation, 
    otpValidation,
    profileValidation,
    updateProfileValidation,
    placeOrderValidation,
    updateOrderValidation,
    payrollValidation,
    updateStatusValidation
};