const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "holiday name is required"]
    },
    date: {
        type: Date,
        required: [true, "holiday date is required"]
    },
    description: {
        type: String,
        required: [true, "holiday description is required"]
    }
});

const Holiday = mongoose.model("Holiday", holidaySchema);
module.exports = Holiday;