const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect("mongodb://localhost:27017/project");
  console.log("Mongodb connect successfully");
}

module.exports = connectDb;
