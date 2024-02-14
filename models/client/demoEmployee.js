const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
 employeeName:{type:String,required:[true, "user name is required"]},
 work:{type:String, required:[true,"employee work is required"]}

})
const Employee= mongoose.model("Employee",employeeSchema)
module.exports = Employee