const User = require('../models/user/usermodel.js'); 
const {validationResult} = require('express-validator');
const {generateAccessToken} = require('../middlewares/token.js');
const bcrypt = require('bcrypt');
const Blacklist = require('../models/user/blacklistSchema.js');
const AccessTokenModel = require('../models/user/accessTokenSchema.js');
const jwt = require('jsonwebtoken');

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
        if(userData.isMailVerified==0){
            return res.status(404).json({ 
                success: false, 
                error: 'Please Verify your Email, check your inbox' 
            });
        }
        if(userData.isVerified==0){
            return res.status(404).json({ 
                success: false, 
                error: 'Please Verify your Profile, contact HR.' 
            });
        }
        
        
            // Find the old access token in the AccessTokenModel using the user's id
            const oldAccessTokenData = await AccessTokenModel.findOne({ id: userData._id });

            // If the old access token exists and is not expired, add it to blacklist
            if (oldAccessTokenData && oldAccessTokenData.expiresAt > Date.now()) {
                const newBlacklist = new Blacklist({token: oldAccessTokenData.token});
                await newBlacklist.save();
            }
        
        const accessToken = generateAccessToken({ user: userData });

        const saltRounds = 10;
        const hashedToken = await bcrypt.hash(accessToken, saltRounds);

   

        const accessTokenData = await AccessTokenModel.findOne({ id: userData._id });

        if (accessTokenData) {
            // Update the existing access token data
            accessTokenData.token = accessToken;
            await accessTokenData.save();
        } else {
            // Create a new access token data
            const newAccessTokenData = new AccessTokenModel({
                id: userData._id,
                token: hashedToken
            });
            await newAccessTokenData.save();
        }


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