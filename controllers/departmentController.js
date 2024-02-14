const User = require('../models/user/usermodel');
const { validationResult } = require('express-validator');


const getDepartmentData = async (req, res) => {
    try{const departments = await User.aggregate([
        {
            $group: {
                _id: '$department',
                numberOfEmployees: { $sum: 1 },
                hod: { $addToSet: { $cond: [{ $in: ['HOD', '$designation'] }, '$fullName', null] } },
                employees: { $push: '$fullName' }
            },
        },
    ]);
    res.render('departmentData', { departments });
}
    catch(err){
        res.status(400).json({
            success: false,
            error: err.message
        })
    }
};

module.exports = { getDepartmentData };
