const mongoose = require('mongoose');

const placeOrderSchema = new mongoose.Schema({
    orderId : {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    orderedFrom: {
        type: String,
        required: true,
    },
    orderedBy: {
        type: String,
        required: true,
    },
    orderDate: {
        type: String,
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
},{
    timestamps: true
});

const placeOrderModel = mongoose.model('Order', placeOrderSchema);

module.exports = placeOrderModel;