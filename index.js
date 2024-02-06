const express =require ('express');
const mongoose =require ('mongoose');
const body_parser= require ('body-parser');
const router=require("./routes/userRoute")
 require("dotenv").config()
const errorMiddleware=require('./middleware/errormiddleware')

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))

mongoose.connect("mongodb://localhost:27017/project")
.then(()=>console.log("database is connected succesfully "))
.catch((error)=>console.error ("didnot connet to the database",error))

app.use (body_parser.urlencoded({extended: false}))
app.use (body_parser.json());
app.use("/",router)
app.use(errorMiddleware)

const PORT = process.env.PORT||5500 ;
app.listen(PORT, ()=>console.log ("server connected succesfully "))