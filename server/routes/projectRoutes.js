const express = require("express");
const Project = require("../models/Project.js");

const router = express.Router();

// Get all projects
router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// Get single project by ID
router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json(project);
});

// Create new project
router.post("/", async (req, res) => {
  const { title, description, teamMembers } = req.body;
  const project = new Project({ title, description, teamMembers });
  await project.save();
  res.status(201).json(project);
});

// Update project
router.put("/:id", async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete project
router.delete("/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
});

module.exports = router;
