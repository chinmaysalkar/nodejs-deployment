const jwt = require('jsonwebtoken');
const Blacklist = require('../models/user/blacklistSchema.js');

// const generateAccessToken = (user) => {
//     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{ expiresIn:'9h'} )
//     return token;
// }

const generateAccessToken = (user) => {
    const payload = { userId: user._id }; // Only include the user's id in the token
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'9h' });
    return token;
}


const verifyToken= async (req, res, next)=>{

    const token = req.body.token || req.query.token || req.headers['authorization'];

    if(!token){
        return res.status(403).json({
            success: false, 
            msg: 'A token is required for authentication'});
    }
    try {

        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        const blacklist = await Blacklist.findOne({token: bearerToken});
        
        if(blacklist){
            return res.status(403).json({
                success: false, 
                msg: 'Your session has expired. Please try again'})
        }

        const decoded = jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        
    } catch (error) {
        res.status(401).json({
            success: false, 
            msg: 'Invalid Token'})
    }
    return next();
}



module.exports = {
    verifyToken, generateAccessToken
}