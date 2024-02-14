const payrollModel = require('../models/user/payrollSchema');
const profileModel = require('../models/user/usermodel');
const { validationResult } = require('express-validator');

  
const payroll = async(req, res) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const { userid, name, email, role, salary, status } = req.body;

        const existingPayroll = await payrollModel.findOne({ userid: userid });
        if (existingPayroll) {
            return res.status(400).json({ success: false, error: 'Userid already added to payroll' });
        }

        const profile = await profileModel.findOne({ userid:userid});
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        const newPayroll = new payrollModel({
            userid: profile.userid,
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

const updatePayrollStatus = async(req, res, next) => {
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { userid } = req.body;

                // Find the order by orderId and update its status from 'pending' to 'approved'
        const updatedStatus = await payrollModel.findOneAndUpdate(
            { userid:userid, status: 'pending' }, 
            { $set: { status: 'done' } },    
            { new: true }                         
        );
        // Check if the order exists and was successfully updated
        if (!updatedStatus) {
            return res.status(404).json({ message: 'User not found or status already done' });
        }
        const updated = updatedStatus.userid + updatedStatus.name + updatedStatus.status ;
        res.status(200).json({ message: 'Payment status updated to done', data:updated });

    } catch (error) {
        return res.status(400).json({ 
            success: false ,error: error.message 
        });
    }
}

const payRollreset = async(req, res) => {
    
        try {
            
            // Get the current date
            const currentDate = new Date();
    
            // Check if it's the end of the month
            if (currentDate.getDate() === new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) {
                // Fetch the payroll records
                const payrollRecords = await payrollModel.find({}).toArray();
    
                // Update the status of the payroll records to "pending"
                payrollRecords.map(record => ({
                    ...record,
                    status: 'pending'
                }));
    
                // Save the updated records back to the database
                await payrollModel.updateMany({}, { $set: { status: 'pending' } });
    
                res.json('Payroll status updated successfully.');
            } else {
                res.json('It is not the end of the month. No action required.');
            }
        
    } catch (error) {
        return res.status(400)
        .json({ success: false,
             error: error.message });
        
    }
}




module.exports = {
    payroll,
    updatePayrollStatus,
    payRollreset

}