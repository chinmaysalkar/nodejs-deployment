const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    }
});

const payrollModel = mongoose.model('Payroll', payrollSchema);
module.exports = payrollModel;