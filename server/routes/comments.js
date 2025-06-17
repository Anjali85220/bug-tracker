const express = require("express");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware"); // Assumes you have JWT middleware
const router = express.Router();

// Create a comment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { ticketId, text } = req.body;

    const comment = new Comment({
      ticketId,
      userId: req.user.id, // Comes from authMiddleware
      text,
    });

    await comment.save();
    const populated = await comment.populate("userId", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Get all comments for a ticket
router.get("/:ticketId", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.ticketId })
      .populate("userId", "name email")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
