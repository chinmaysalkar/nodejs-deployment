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

const router = require('./routes/client/clientRoute.js');

const mongoose = require('./db.js');


app.use(errorMiddleware)

app.use('/client',router);


app.get('/', (req, res) => {
  res.send('index');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});