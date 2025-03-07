const mongoose = require("mongoose");
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

function connectToDataBase() {
  mongoose
    .connect(process.env.CONNECTION)
    .then(() => {
      console.log("Connected To Database");
    })
    .catch((err) => console.error(err));
}

module.exports = connectToDataBase;
