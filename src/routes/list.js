import express from "express";

const router = express.Router();

router.get("/lists", async (req, res, next) => {
  try {
    const lists = await prisma.list.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.json(lists);
  } catch (error) {
    next(error);
  }
});

router.get("/lists/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const list = await prisma.list.findUnique({
      where: { id },
    });
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    res.json(list);
  } catch (error) {
    next(error);
  }
});

router.post("/lists", async (req, res, next) => {
  try {
    const { title, boardId } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!boardId) {
      return res.status(400).json({ error: "Board ID is required" });
    }
    const list = await prisma.list.create({
      data: { title: title.trim(), boardId },
    });
    res.status(201).json(list);
  } catch (error) {
    next(error);
  }
});

router.put("/lists/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const list = req.body;
    if (!list) {
      return res.status(400).json({ error: "List is required" });
    }
    const updatedList = await prisma.list.update({
      where: { id },
      data: list,
    });
    res.json(updatedList);
  } catch (error) {
    next(error);
  }
});

router.patch("/lists/:id/title", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const list = await prisma.list.update({
      where: { id },
      data: { title: title.trim() },
    });
    res.json(list);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "List not found" });
    }
    next(error);
  }
});

router.patch("/lists/:id/tasks", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { tasks } = req.body;
    if (!tasks) {
      return res.status(400).json({ error: "Tasks are required" });
    }
    const updatedList = await prisma.list.update({
      where: { id },
      data: { tasks },
    });
    res.json(updatedList);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "List not found" });
    }
    next(error);
  }
});

router.patch("/lists/:id/board", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { boardId } = req.body;
    if (!boardId) {
      return res.status(400).json({ error: "Board ID is required" });
    }
    const updatedList = await prisma.list.update({
      where: { id },
      data: { boardId },
    });
    res.json(updatedList);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "List not found" });
    }
    next(error);
  }
});


router.delete("/lists/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.list.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "List not found" });
    }
    next(error);
  }
});