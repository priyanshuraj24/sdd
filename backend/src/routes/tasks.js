const express = require("express");
const router = express.Router();
const TaskModel = require("../TaskModel");
const { isValidObjectId } = require("mongoose");

// Get tasks for a specific project
router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    const tasks = await TaskModel.find({ projectId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch tasks" });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, projectId } = req.body;
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "Title and Project ID are required" });
    }
    const task = await TaskModel.create({
      title,
      projectId,
    });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create task" });
  }
});

// Update a task
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const updates = {};
    if (title) updates.title = title;
    if (status) updates.status = status;

    const task = await TaskModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update task" });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    await TaskModel.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to delete task" });
  }
});

module.exports = router;
