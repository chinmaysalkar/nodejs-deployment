require('dotenv').config();

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const port = process.env.SERVER_PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const route = require('./routes/router.js')
const authRoute = require('./routes/authRoute.js')
const mongoose = require('./db.js');



app.use('/api',route)
app.use('/',authRoute);





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



