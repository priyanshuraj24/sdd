const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    department: String,
    owner: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("project", projectSchema);
