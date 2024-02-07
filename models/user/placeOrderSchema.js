const mongoose = require('mongoose');

const placeOrderSchema = new mongoose.Schema({
    items: {
        type: Array,
        required: true,
    },
    orderFor: {
        type: String,
        required: true,
    },
    orderBy: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Date,
        required: true,
    },
    paidBy: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
});

const placeOrderModel = mongoose.model('Orders', placeOrderSchema);

module.exports = placeOrderModel;