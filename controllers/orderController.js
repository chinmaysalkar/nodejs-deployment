const  placeOrderModel = require('../models/user/placeOrderSchema');
const { validationResult } = require('express-validator');

const placeOrder = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }
        const { items, orderFor, orderBy, orderDate, paidBy, status, amount } = req.body;
 
        const reportData = new placeOrderModel({
            items, orderFor, orderBy, orderDate, paidBy, status, amount
        });

        await reportData.save();
        return res.status(200).json({ success: true, message: 'Order placed successfully' });

    } catch (error) {
        return res.status(400)
    .json({ success: false, 
        error: error.message });
        
    }
}




module.exports = {
    placeOrder
}