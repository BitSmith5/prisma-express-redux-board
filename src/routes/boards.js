import express from "express";
import prisma from '../prisma.js'

const router = express.Router();

router.get("/boards", async (req, res, next) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        tasks: true
      }
    });
    res.json(boards);
  } catch (error) {
    next(error);
  }
});

router.get("/boards/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const board = await prisma.board.findUnique({
      where: { id },
      include: { tasks: true }
    });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json(board);
  } catch (error) {
    next(error);
  }
});

router.put("/boards/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const board = req.body;
    if (!board) {
      return res.status(400).json({ error: "Board is required" });
    }
    const updatedBoard = await prisma.board.update({
      where: { id },
      data: board,
    });
    res.json(updatedBoard);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Board not found" });
    }
    next(error);
  }
});

router.post("/boards", async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const board = await prisma.board.create({
      data: { title },
      include: { tasks: true }
    });
    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
});

router.patch("/boards/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const board = await prisma.board.update({
      where: { id },
      data: { title: title.trim() },
    });
    res.json(board);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Board not found" });
    }
    next(error);
  }
});

router.patch("/boards/:id/title", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const board = await prisma.board.update({
      where: { id },
      data: { title },
    });
    res.json(board);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Board not found" });
    }
    next(error);
  }
});

router.patch("/boards/:id/lists", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { lists } = req.body;
    if (!lists) {
      return res.status(400).json({ error: "Lists are required" });
    }
    const board = await prisma.board.update({
      where: { id },
      data: { lists },
    });
    res.json(board);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Board not found" });
    }
    next(error);
  }
});

router.delete("/boards/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.board.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Board not found" });
    }
    next(error);
  }
});

export default router;