const mongoose = require("mongoose");

mongoose
  .connect(
    //oldDatabase server
    "mongodb+srv://user9192:password9192@cluster93986.k9o9qaz.mongodb.net/?retryWrites=true&w=majority"
    // "mongodb+srv://user9192:password9192@cluster93986.k9o9qaz.mongodb.net/epicHR?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database connected!"))
  .catch((error) => console.log(error));

module.exports = mongoose;
