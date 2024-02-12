const User = require('../models/user/usermodel');
const Profile = require('../models/user/profileSchema');

const generateRandom4digit = function () {
    return Math.floor( 1000+ Math.random() *9000);
}

// Function to generate the next ID
const getNextUserId = async function() {
    const lastStudent = await Profile.findOne({}, {}, { sort: { 'userId': -1 } });
    if (lastStudent) {
      const lastId = parseInt(lastStudent.userId.substring(3), 10);
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

// Function to merge and format the name
function mergeAndFormatName(fullName) {
  // Split the full name into an array of words
  const nameParts = fullName.split(' ');

  // Check if there are at least two words in the full name
  if (nameParts.length >= 2) {
      // Concatenate the first word in lowercase with the second word in lowercase
      const username = nameParts[0].toLowerCase() + nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1).toLowerCase();
      return username;
  } else {
      // If only one word is available, return it in lowercase
      return nameParts[0].toLowerCase();
  }
}









module.exports = {
    getNextUserId, generateRandom4digit, generateOrderId,mergeAndFormatName
};