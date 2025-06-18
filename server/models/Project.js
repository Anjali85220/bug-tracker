const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    teamMembers: [
      {
        name: String,
        email: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
