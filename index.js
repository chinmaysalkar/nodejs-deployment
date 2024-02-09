const express =require ('express');
const mongoose =require ('mongoose');
const body_parser= require ('body-parser');
const router=require("./routes/client/userRoute")
 require("dotenv").config()
const errorMiddleware=require('./middlewares/errormiddleware')

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))

mongoose.connect("mongodb+srv://sandeep:Sandeep1234@cluster93986.k9o9qaz.mongodb.net/")
.then(()=>console.log("database is connected succesfully "))
.catch((error)=>console.error ("didnot connet to the database",error))

app.use (body_parser.urlencoded({extended: false}))
app.use (body_parser.json());
app.use("/client",router)
app.use(errorMiddleware)

const PORT = process.env.PORT||5500 ;
app.listen(PORT, ()=>console.log ("server connected succesfully "))