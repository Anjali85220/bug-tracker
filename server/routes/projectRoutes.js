const express = require("express");
const Project = require("../models/Project.js");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all projects created by the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const projects = await Project.find({ createdBy: req.user.id });
  res.json(projects);
});

// Get single project by ID
router.get("/:id", authMiddleware, async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json(project);
});

// Create project
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, teamMembers } = req.body;

  try {
    const project = new Project({
      title,
      description,
      teamMembers,
      createdBy: req.user.id,
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: "Failed to create project", details: err.message });
  }
});

// Update project
router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await Project.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Delete project
router.delete("/:id", authMiddleware, async (req, res) => {
  await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
  res.json({ message: "Project deleted" });
});

module.exports = router;
