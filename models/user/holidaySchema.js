const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    holidayName: {
        type: String,
        required: [true, "holiday name is required"]
    },
    date: {
        type: String,
        required: [true, "holiday date is required"]
    },
    description: {
        type: String,
        required: [true, "holiday description is required"]
    }
});

const Holiday = mongoose.model("Holiday", holidaySchema);
module.exports = Holiday;