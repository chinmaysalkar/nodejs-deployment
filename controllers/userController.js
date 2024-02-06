const bcrypt = require('bcrypt');
const User = require('../models/usermodel'); // Assuming you have a User model
const Blacklist = require('../models/blacklist.js')
const {oneMinuteExpiry, threeMinuteExpiry} = require('../helpers/otpValidate.js');
const Otp = require('../models/otp.js')
const {validationResult} = require('express-validator');
const {sendMail} = require('../helpers/mailer.js');
const saltRounds = 10;
const randomstring = require('randomstring');
const passwordReset = require('../models/passwordReset');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Please include name, email and password' });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User with this Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await user.save();

        const msg = '<p>Hii '+name+', your account has been created successfully. Please <a href="http://localhost:3000/verify?id='+savedUser._id+'">verify</a> your mail </p>';

        sendMail(email, ' Verify Account', msg);

        return res.status(200).json({ 
            success: true ,message: "Registered successfully", data: savedUser
        });

    } catch (error) {
        return res.status(400).json({ 
            success: false ,error: error.message 
        });
    }
};

const mailVerification = async (req, res) => {
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }
        //const userId = req.params.id;
        const user = await User.findOne({_id :req.query.id});

        if (!user) {
            return res.status(404).render('verification',{message: "User not found" });
        } else if (user.isVerified) {
            return res.status(200).render('verification.ejs',{message: "Already Verified" });
        } else {
            user.isVerified = true;
            await user.save();
            return res.status(200).render('verification.ejs',{message: "Mail Verified successfully"});
        }


    } catch (error) {
        
        return res.status(400).json({ success: false, error: error.message });
        
    }
}

const forgetPassword = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const { email } = req.body;
        const userdata = await User.findOne({ email: email });
        if (!userdata) {
            return res.status(404).json({ success: false, error: 'Email does not exists' });
        }
        
        const randomString = randomstring.generate();
        const msg = '<p>Hii '+userdata.name+', please click <a href="http://localhost:3000/reset-password?token='+randomString+'">here</a> to reset your password</p>';
        
        await passwordReset.deleteMany({ user_id: userdata._id });

        const passwordResetdata = new passwordReset({
            user_id: userdata._id,
            token: randomString
        });
        await passwordResetdata.save();
        sendMail(email, 'Reset Password', msg);

        return res.status(200).json({ 
            success: true,message: "Reset Password link has been sent to your email"
        });
    
        
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        if(req.query.token == undefined){
            return res.render('404')
        }

        const resetData = await passwordReset.findOne({token: req.query.token});
        
        if(!resetData){
            return res.render('404')
        }

        return res.render('reset-password', {resetData: resetData});

    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}

const updatePassword = async (req, res) => {
    try {

        const {user_id, password, c_password} = req.body;

        const resetData = await passwordReset.findOne({ user_id: user_id });
        if (password != c_password) {
            return res.render('reset-password',{ resetData: resetData, error: 'Password does not match.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userdata = await User.findByIdAndUpdate({_id:user_id}, { 
            $set:{  
                 password: hashedPassword
                 }  });

        await passwordReset.deleteMany({ user_id: user_id });
        return res.redirect('/reset-success');
    }
    catch (error) {
        return res.status(400).json({ success: false ,error: error.message });
    }
}
const resetSuccess = async (req, res) => {
    try {
        return res.render('reset-success');
    }
    catch (error) {
        return res.status(400).json({ success: false ,error: error.message });
    }
}

const generateAccessToken = (user) => {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{ expiresIn:'2h'} )
        return token;
}

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

const userProfile = async (req, res) => {
    try {

        const userData = req.user;


        return res.status(400)
        .json({ success:true,
             message: "User Profile Data!",
             data:userData});

    } catch (error) {
        return res.status(400)
        .json({ success: false,
             error: error.message });
    }
}

const updateProfile = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const { name, email } = req.body;
        const data = {name, email};


        if(data.email) {

            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ success: false, error: 'User with this Email already exists' });
            }

            const verificationMsg = '<p>Hii '+data.name+', please click <a href="http://localhost:3000/verify?id='+req.user.user._id+'">here</a> to verify your new email address</p>';

            // Save verification token and new email to the user document for later comparison
            await User.findByIdAndUpdate({_id:req.user.user._id}, { 
                $set:{ newEmail: data.email, isVerified:false }
            });

            sendMail(data.email, 'Verify New Email', verificationMsg);
        }

        //const userData = await User.findById({_id:req.user.user._id});
        const userData =await User.findByIdAndUpdate({_id:req.user.user._id}, { 
            $set:{  
                 name: data.name,
                 email: data.email
                 }},{new:true } );

        
        

        return res.status(200).json({ 
            success: true,message: "Profile Updated successfully",data: userData
        });

    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
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

const generateRandom4digit = async (req, res) => {
    return Math.floor( 1000+ Math.random() *9000);
}


const sendOtp = async(req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const {email} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({success: false, message: "User not found" });
        } else if (user.isVerified) {
            return res.status(200).json({success: true, message: "Already Verified" });
        } else {
            await user.save();

            const g_otp = await generateRandom4digit(req, res);

            const oldOtpData = await Otp.findOne({user_id: user._id});
            if (oldOtpData) {
                const sendNextOtp = await oneMinuteExpiry(oldOtpData.timestamp)
                if (!sendNextOtp) {
                    return res.status(400)
                    .json({success: false, message: "Please try after some time. "});
                }
            }
            const cdate = new Date();

            await Otp.findOneAndUpdate(
                {user_id: user._id},
                {otp: g_otp, timestamp: new Date(cdate.getTime())},
                {upsert: true, new: true, setDefaultsOnInsert: true},
            )

            const msg = '<p>Hii <b>'+user.name+'</b>, your account has been created successfully.Please verify otp <h4>'+g_otp+' </h4>  </p>';
            sendMail(user.email, 'OTP Verification', msg);            
            return res.status(200).json({message: "Otp has been sent to your email. Please check. "});
        }
  

        
    } catch (error) {
        return res.status(400)
      .json({ success: false,
           error: error.message });
        
    }
}

const verifyOtp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                error: errors.array() });
        }

        const {user_id, otp} = req.body;
        const otpData = await Otp.findOne({
            user_id, 
            otp
        });
        if (!otpData) {
            return res.status(400).json({ 
                success: false, 
                error: 'Wrong otp' });
        }
        const isOtpExpired = await threeMinuteExpiry(otpData.timestamp);
        if (isOtpExpired) {
            return res.status(400).json({ 
                success: false, 
                error: 'OTP Expired' });
        }
        
        await User.findByIdAndUpdate({_id:user_id}, { 
            $set:{  
                 isVerified: true
                 }  });

        return res.status(200).json({ 
            success: true, 
            message: 'Otp verified successfully' });

    } catch (error) {
        return res.status(400)
    .json({ success: false, 
        error: error.message });
        
    }
}


module.exports = {
  createUser,
  mailVerification,
  forgetPassword,
  resetPassword,
  updatePassword,
  resetSuccess,
  loginUser,
  userProfile,
  updateProfile,
  logout,
  sendOtp,
  verifyOtp
}; 
