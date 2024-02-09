const payrollModel = require('../models/user/payrollSchema');
const profileModel = require('../models/user/profileSchema');
const {validationResult} = require('express-validator');


const payroll = async(req, res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const { name, email, role, salary, status } = req.body;

        const profile = await profileModel.findOne({ email: email });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        
        const newPayroll = new payrollModel({
            name: profile.name,
            email: profile.email,
            role: profile.role,
            salary,
            status
        });

        await newPayroll.save();
        return res.status(200).json({ success: true, message: 'Payroll added successfully',data:newPayroll });
        
    } catch (error) {
        return res.status(400)
        .json({ success: false,
             error: error.message });
    }
}

module.exports = {
    payroll
}