const {validationResult} = require('express-validator');
const randomstring = require('randomstring');
const passwordReset = require('../models/user/passwordReset.js');





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
        const msg = '<p>Hii '+userdata.name+', please click <a href="http://localhost:3000/auth/reset-password?token='+randomString+'">here</a> to reset your password</p>';
        
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

module.exports = {
    forgetPassword,
    resetPassword,
    updatePassword,
    resetSuccess
}