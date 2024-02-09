const placeOrderModel = require("../models/user/placeOrderSchema");
const Profile = require("../models/user/profileSchema");

const { validationResult } = require("express-validator");
const {generateOrderId} = require('../middlewares/helpers.js');

const placeOrder = async (req, res) => {
  try {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const generatedId = generateOrderId();

    const { items, orderedFrom, orderedBy, orderDate, paidBy, status, amount } =
      req.body;

    // Check if the orderedBy is a Super Admin
    const profile = await Profile.findOne({ name: orderedBy });
    if (!profile || (profile.position !== "Admin" && profile.position !== "Super Admin")){
      return res
        .status(400)
        .json({ message: "Ordered by user must be a Super Admin or Admin" });
    }

    // Create a new order
    const newOrder = new placeOrderModel({
      orderId: generatedId,
      items,
      orderedFrom,
      orderedBy,
      orderDate,
      paidBy,
      status,
      amount,
    });

    // Save the order to the database
    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", data: newOrder });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const updateOrderStatus = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }
        
        const {orderId} = req.body;
                // Find the order by orderId and update its status from 'pending' to 'approved'
        const updatedOrder = await placeOrderModel.findOneAndUpdate(
            { orderId:orderId, status: 'pending' }, // Find the order by its ID and status
            { $set: { status: 'approved' } },    // Set the status to 'approved'
            { new: true }                         // Return the updated document
        );
        
        // Check if the order exists and was successfully updated
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found or status already approved' });
        }
        res.status(200).json({ message: 'Order status updated to approved', updatedOrder });
updateStatusValidation
    } catch (error) {
        return res.status(400).json({ 
            success: false ,error: error.message 
        });
    }
}

const viewOrders = async(req, res, next) => {
    try {
        const orders = await placeOrderModel.find();
        return res.status(200).json({ success: true, data: orders });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}





module.exports = {
  placeOrder,
  updateOrderStatus,
  viewOrders
};
