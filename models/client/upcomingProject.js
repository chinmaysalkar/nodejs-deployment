const mongoose = require("mongoose")

const upcomingSchema =new mongoose.Schema({
owner:{type:mongoose.Schema.Types.ObjectId , ref:"Client"},
milestone:{},
workHour:{},
duration:{},
priority:{type:String,required:[true, "proprity is required"], enum:["high","medium", "low","none"]}
})

const upComing = mongoose.model("upComing", upcomingSchema)
module.exports=upComing