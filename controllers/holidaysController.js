const holiday = require('../models/user/holidaySchema')
const { validationResult } = require('express-validator');


const addHoliday = async (req, res) => { // add holiday
    try{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    const existingHoliday = await holiday.findOne({ name: req.body.name });
    if (existingHoliday) {
        return res.status(400).json({ success: false, error: 'Holiday with this name already exists' });
    }
    const newHoliday = new holiday({
        name: req.body.name,
        date: req.body.date,
        description: req.body.description
    });

    await newHoliday.save();
    return res.status(200).json({ success: true, message: 'Holiday added successfully', data: newHoliday });
} catch (error) {
    return res.status(400).json({ success: false, error: error.message });
}
};




const getHolidays = async (req, res) => {
 
  try {

  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};


module.exports = {
    addHoliday, getHolidays
}









