const User = require('../models/user/usermodel.js'); 
const {validationResult} = require('express-validator');
const {generateAccessToken} = require('../middlewares/token.js');
const bcrypt = require('bcrypt');


const loginUser = async (req, res) => {
    try {

        const errors= validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const { email, password } = req.body;

        const userData = await User.findOne({ email: email });

        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                error: 'Email and Password is Incorrect' 
            });
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.status(404).json({ 
                success: false, 
                error: 'Email and Password is Incorrect' 
            });
        }
        if(userData.isVerified==0){
            return res.status(404).json({ 
                success: false, 
                error: 'Please Verify your Email' 
            });
        }

        const accessToken = generateAccessToken({user:userData});

        return res.status(200).json({ 
            success: true, 
            message: 'Login Successful',
            accessToken: accessToken,
            tokenType: 'Bearer'
        });
    }
    catch (error) {
        return res.status(400)
        .json({ success: false,
             error: error.message });
    }
}

const logout = async(req, res) => {
    try {
        const token = req.body.token || req.query.token || req.headers['authorization'];
        const bearer = token.split(' ');
        const bearerToken = bearer[1];

        const newBlacklist = new Blacklist({token: bearerToken});
        await newBlacklist.save();

        // res.setHeader('Clear-Site-Data', '"cookies","storage"');

        return res.status(200).json({ 
            success: true,message: "Logout Successful"
        });
        
    } catch (error) {
        return res.status(400)
        .json({ success: false, 
            error: error.message });
        
    }
}

module.exports = {
    loginUser,
    logout
}