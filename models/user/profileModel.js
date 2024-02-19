const mongoose = require('mongoose');

const deductionSchema = new mongoose.Schema({
  deductionId: {
    type: Number,
    required: true,
  },
  taxDeduction: {
    type: Number,
    required: true,
  },
  deductionForLeave: {
    type: Number,
    required: true,
  },
  providentFund: {
    type: Number,
    required: true,
  },
  totalDeduction: {
    type: Number,
    required: true,
    default: function () {
      return this.taxDeduction + this.deductionForLeave + this.providentFund;
    },
  },
});

const salarySchema = new mongoose.Schema({

//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Profile',
//     required: true
//   },
  grossSalary: {
      type: Number,
      default: function () {
          return this.HRA + this.DA + this.medicalInsurance + this.conveyanceAllowance + this.otherAllowances+ this.basicPay;
      }
  },
  HRA: {
    type: Number,
  },
  DA: {
    type: Number,
  },
  medicalInsurance: {
    type: Number,
  },
  conveyanceAllowance: {
    type: Number,
  },
  otherAllowances: {
    type: Number,
  },
  basicPay: {
      type: Number,

    },
  deduction: [deductionSchema],
  netPay: {
    type: Number,
    required: true,
    default: function () {
      return (
        this.grossSalary -
        this.deduction.reduce(
          (acc, curr) =>
            acc +
            curr.taxDeduction +
            curr.deductionForLeave +
            curr.providentFund,
          0
        )
      );
    },
  },
});


const profileSchema = new mongoose.Schema({

    userId: {
        type:String,
        default: 'RAK0001',
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
    },
    department: {
        type: String,
    },
    designation: {
        type: Array,
    },
    role: {
        type: Array,
    },
    username: {
        type: String,  
    },
    password: {
        type: String,
        required: true
    },
    isMailVerified: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        type:String
      },
    salary:[salarySchema],
    
    
});


const salaryModel = mongoose.model('Salary', salarySchema);
const deductionModel = mongoose.model('Deduction', deductionSchema);   
const profileModel = mongoose.model('Profile', profileSchema);
module.exports = profileModel, deductionModel, salaryModel;