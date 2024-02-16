const mongoose = require('mongoose');

const LoginLogoutLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  loginTime: {
    type: Date,
    default: null
  },
  logoutTime: {
    type: Date,
    default: null
  }
});


const LoginLogoutLog = mongoose.model('LoginLogoutLog', LoginLogoutLogSchema);

module.exports = LoginLogoutLog;