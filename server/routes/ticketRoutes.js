const express = require("express");
const Ticket = require("../models/Ticket");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create ticket
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, assignee, projectId } = req.body;

    const newTicket = new Ticket({
      title,
      description,
      priority,
      assignee,
      projectId,
      createdBy: req.user.id,
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Get all tickets for a project (only for current user)
router.get("/project/:projectId", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({
      projectId: req.params.projectId,
      createdBy: req.user.id,
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update a ticket
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, status, assignee } = req.body;

    const updated = await Ticket.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { title, status, assignee },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Delete a ticket
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Ticket.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Assign a ticket (optional, kept separate)
router.put("/:id/assign", authMiddleware, async (req, res) => {
  try {
    const { assignee } = req.body;

    const updated = await Ticket.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { assignee },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
