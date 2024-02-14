const holiday = require('../models/user/holidaySchema');
const { validationResult } = require('express-validator');

const createHoliday = async (req, res) => { // add holiday
    try{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }



    const existingHoliday = await holiday.findOne({ name: req.body.holidayName });
    if (existingHoliday) {
        return res.status(400).json({ success: false, error: 'Holiday with this name already exists' });
    }
    const newHoliday = new holiday({
        holidayName: req.body.holidayName,
        date: req.body.date,
        description: req.body.description
    });

    await newHoliday.save();
    return res.status(200).json({ 
        success: true, 
        message: 'Holiday added successfully', 
        data: newHoliday });
} catch (error) {
    return res.status(400).json({ success: false, error: error.message });
}
};

const getHoliday = async(req, res) => {
    try {
        
        const allholidays = await holiday.find({});
        return res.status(200).json({ 
            success: true,
            data: allholidays });

    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}




module.exports = {
    createHoliday, getHoliday
}









