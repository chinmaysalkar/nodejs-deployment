require('dotenv').config();
const errorMiddleware=require('./middlewares/errormiddleware.js')
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const port = process.env.SERVER_PORT || 5500;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = require("../nodejs-deployment-1/routes/client/clientRoute.js");
const route = require('../nodejs-deployment-1/routes/user/userRoutes.js');
const authRoute = require('../nodejs-deployment-1/routes/user/authRoute.js');
const mongoose = require('./db.js');


app.use(errorMiddleware)
app.use('/api', route)
app.use('/client',router);
app.use('/auth',authRoute);

app.get('/', (req, res) => {
  res.send('index');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});