const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

const Profile = require('../models/user/profileModel.js'); 
const Blacklist = require('../models/user/blacklistSchema.js');
const AccessTokenModel = require('../models/user/accessTokenSchema.js');
const LoginLogoutLog = require('../models/user/loginLogoutLogModel.js');
const { deleteOldAccessToken } = require('../middlewares/blacklist.js');
const {generateAccessToken} = require('../middlewares/token.js');

const loginUser = async (req, res) => {
    try {

        const errors= validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const { email, password } = req.body;

        const userData = await Profile.findOne({ email: email });

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
            
        deleteOldAccessToken(userData._id);
        
        const accessToken = generateAccessToken({ user: userData });

        const accessTokenData = await AccessTokenModel.findOne({ id: userData._id });

        if (accessTokenData) {
            // Update the existing access token data
            accessTokenData.token = accessToken;
            await accessTokenData.save();
        } else {
            // Create a new access token data
            const newAccessTokenData = new AccessTokenModel({
                id: userData._id,
                token: accessToken
            });
            await newAccessTokenData.save();
        }
        const existingLoginLog = await LoginLogoutLog.findOne({ userId: userData._id, logoutTime: null });
        if (existingLoginLog) {
            existingLoginLog.logoutTime = new Date();
            await existingLoginLog.save();
        }
        const loginLog = new LoginLogoutLog({ userId: userData._id, loginTime: new Date() });
        await loginLog.save();


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

        console.log(req.user)
        
         
        const newBlacklist = new Blacklist({token: bearerToken});
        await newBlacklist.save();

        const logoutLog = await LoginLogoutLog.findOne({ userId: req.user.userId, logoutTime: null });
        if (logoutLog) {
            logoutLog.logoutTime = new Date();
            await logoutLog.save();
        }

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

const getLoginLogoutStatsByDate = async (req, res) => {
    try {
        const userId = req.body.userId;
        const logs = await LoginLogoutLog.find({ userId });

        const loginLogoutStatsByDate = {};
        
        logs.forEach(log => {
            const date = log.loginTime.toISOString().split('T')[0];
            
            if (!loginLogoutStatsByDate[date]) {
                loginLogoutStatsByDate[date] = {
                    logins: 0,
                    logouts: 0,
                    loginLogoutTimings: []
                };
            }

            loginLogoutStatsByDate[date].loginLogoutTimings.push({
                loginTime: log.loginTime,
                logoutTime: log.logoutTime
            });

            loginLogoutStatsByDate[date].logins++;
            if (log.logoutTime !== null) {
                loginLogoutStatsByDate[date].logouts++;
            }
        });

        return res.status(200).json({ 
            success: true, 
            loginLogoutStatsByDate
        });

    } catch (error) {
        return res.status(400)
        .json({ success: false, 
            error: error.message });
    }
}

module.exports = {
    loginUser,
    logout,
    getLoginLogoutStatsByDate
}