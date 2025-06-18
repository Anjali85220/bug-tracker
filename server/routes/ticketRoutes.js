const express = require("express");
const Ticket = require("../models/Ticket");
const router = express.Router();

// ✅ Create ticket (assignee as string)
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, assignee, projectId } = req.body;

    const newTicket = new Ticket({
      title,
      description,
      priority,
      assignee, // Can be null, undefined, or email string
      projectId,
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// ✅ Get all tickets for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const tickets = await Ticket.find({ projectId: req.params.projectId });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Update a ticket
router.put("/:id", async (req, res) => {
  try {
    const { title, status, assignee } = req.body;

    const updated = await Ticket.findByIdAndUpdate(
      req.params.id,
      { title, status, assignee },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// ✅ Delete a ticket
router.delete("/:id", async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// ✅ Assign a ticket (not strictly needed anymore, but kept if used separately)
router.put("/:id/assign", async (req, res) => {
  try {
    const { assignee } = req.body;

    const updated = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignee },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
