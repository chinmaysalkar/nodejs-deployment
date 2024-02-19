// // https://fi.money/blog/posts/what-is-basic-salary-formula-and-calculation


// const mongoose = require('mongoose');

// const deductionSchema = new mongoose.Schema({
//   deductionId: {
//     type: Number,
//     required: true,
//   },
//   taxDeduction: {
//     type: Number,
//     required: true,
//   },
//   deductionForLeave: {
//     type: Number,
//     required: true,
//   },
//   providentFund: {
//     type: Number,
//     required: true,
//   },
//   totalDeduction: {
//     type: Number,
//     required: true,
//     default: function () {
//       return this.taxDeduction + this.deductionForLeave + this.providentFund;
//     },
//   },
// });

// const salarySchema = new mongoose.Schema({

//   grossSalary: {
//     type: Number,
//     required: true,
//   },
//   HRA: {
//     type: Number,
//     required: true,
//   },
//   DA: {
//     type: Number,
//     required: true,
//   },
//   medicalInsurance: {
//     type: Number,
//     required: true,
//   },
//   conveyanceAllowance: {
//     type: Number,
//     required: true,
//   },
//   otherAllowances: {
//     type: Number,
//     required: true,
//   },
//   basicPay: {
//     type: Number,
//     required: true,
//   },
//   deduction: [deductionSchema],
//   netPay: {
//     type: Number,
//     required: true,
//     default: function () {
//       return (
//         this.grossSalary -
//         this.deduction.reduce(
//           (acc, curr) =>
//             acc +
//             curr.taxDeduction +
//             curr.deductionForLeave +
//             curr.providentFund,
//           0
//         )
//       );
//     },
//   },
// });

// const Deduction = mongoose.model('Deduction', deductionSchema);
// const Salary = mongoose.model('Salary', salarySchema);

// module.exports = {Salary, Deduction};
