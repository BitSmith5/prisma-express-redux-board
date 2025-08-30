import express from "express";
import cors from "cors";
import boardsRouter from "./routes/boards.js";
import listsRouter from "./routes/list.js";
import tasksRouter from "./routes/task.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", boardsRouter);
app.use("/api", listsRouter);
app.use("/api", tasksRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

export default app;