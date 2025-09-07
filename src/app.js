import express from "express";
import cors from "cors";
import boardsRouter from "./routes/boards.js";
import listsRouter from "./routes/list.js";
import tasksRouter from "./routes/task.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", boardsRouter);
app.use("/api", listsRouter);
app.use("/api", tasksRouter);

app.use(express.static(path.join(__dirname, '../dist')));
// app.use("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

export default app;