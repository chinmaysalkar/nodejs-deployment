const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = require('./routes/userRoutes')
const cors = require('cors');
app.use(cors());

const PORT = 3000;


//connection to database
mongoose
    .connect("mongodb://localhost:27017/basic")
    .then(()=>{
        console.log("Connected to db")
    }
    )
    .catch((err)=>{
        console.log(err);
    })


app.set('view engine', 'ejs');
app.use(express.json());
app.use('/api', router);


app.listen(PORT,()=>{
    console.log(`Server has been started on http://localhost:${PORT}`)
});

