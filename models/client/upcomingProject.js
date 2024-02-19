const mongoose = require("mongoose")

const upcomingSchema =new mongoose.Schema({
owner:{type:mongoose.Schema.Types.ObjectId , ref:"Client"},
    milestone: {
        type: String,
        required: [true, " milestone is required is required "],
        enum: ["project approval", "requirement review", "design approval",""]
    },
workHour:{type:String},
duration:{type:Date, required:[true," time dureation is required"]},
priority:{type:String,required:[true, "proprity is required"], enum:["high","medium", "low","none"]}
})

const upComing = mongoose.model("upComing", upcomingSchema)
module.exports=upComing