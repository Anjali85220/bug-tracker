const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  teamMembers: [String],
}, { timestamps: true });

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
