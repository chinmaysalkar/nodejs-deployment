const User = require('../models/user/usermodel');

const generateRandom4digit = function () {
    return Math.floor( 1000+ Math.random() *9000);
}

// Function to generate the next ID
const getNextUserId = async function() {
    const lastStudent = await User.findOne({}, {}, { sort: { 'id': -1 } });
    if (lastStudent) {
      const lastId = parseInt(lastStudent.id.substring(3), 10);
      return `RAK${String(lastId + 1).padStart(4, '0')}`;
    } else {
      return 'RAK0001';
    }
}


const generateOrderId = function() {
    const timestamp = new Date().getTime(); // Get current timestamp
    const randomNumber = generateRandom4digit(); // Generate random number between 0 and 9999
    const orderId = `ORDER-${timestamp}-${randomNumber}`; // Combine timestamp and random number
    return orderId;
}






module.exports = {
    generateRandom4digit, generateOrderId
};