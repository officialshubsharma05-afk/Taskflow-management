const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

router.use(protect);

// GET ALL TASKS (User isolated)
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: error.message || "Failed to fetch tasks"
        });
    }
});

// CREATE TASK
router.post("/", async (req, res) => {
    try {
        const { title, description, category, priority, status, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description ? description.trim() : "",
            category: category || "Personal",
            priority: priority || "Medium",
            status: status || "Pending",
            dueDate: dueDate || null,
            user: req.user.id
        });

        res.status(201).json(task);

    } catch (error) {
        res.status(400).json({
            message: error.message || "Failed to create task"
        });
    }
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "description",
            "category",
            "priority",
            "status",
            "dueDate"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (updates.title !== undefined && (!updates.title || !updates.title.trim())) {
            return res.status(400).json({
                message: "Task title cannot be empty"
            });
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            { $set: updates },
            {
                returnDocument: "after",
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(400).json({
            message: error.message || "Failed to update task"
        });
    }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Failed to delete task"
        });
    }
});

module.exports = router;
