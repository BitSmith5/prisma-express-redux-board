import express from "express";
import cors from "cors";
import boardsRouter from "./routes/boards";
import listsRouter from "./routes/list";
import tasksRouter from "./routes/task";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", boardsRouter);
app.use("/api", listsRouter);
app.use("/api", tasksRouter);

export default app;