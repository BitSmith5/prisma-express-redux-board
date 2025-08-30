import express from "express";
import prisma from '../prisma.js'

const router = express.Router();

router.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.post("/tasks", async (req, res, next) => {
  try {
    const { title, boardId, status, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!boardId) {
      return res.status(400).json({ error: "Board ID is required" });
    }
    if(!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const task = await prisma.task.create({
      data: { title, boardId, status, description },
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.patch("/tasks/:id/title", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const task = await prisma.task.update({
      where: { id },
      data: { title: title.trim() },
    });
    res.json(task);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    next(error);
  }
});

router.patch("/tasks/:id/status", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!status || !status.trim()) {
      return res.status(400).json({ error: "Status is required" });
    }
    const task = await prisma.task.update({
      where: { id },
      data: { status: status.trim() },
    });
    res.json(task);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    next(error);
  }
});

router.patch("/tasks/:id/description", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    const task = await prisma.task.update({
      where: { id },
      data: { description: description },
    });
    res.json(task);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    next(error);
  }
});

router.delete("/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.task.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    next(error);
  }
});

router.get("/tasks/:id/list", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const list = await prisma.list.findUnique({
      where: { tasks: { some: { id } } },
    });
    res.json(list);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "List not found" });
    }
    next(error);
  }
});

export default router;