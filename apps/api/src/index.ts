import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./modules/Auth/auth.routes";
import blockerLogRoutes from "./modules/Blocker-logs/blockerLog.routes";
import pomodoroSessionRoutes from "./modules/Pomodoro-sessions/pomodoro_sessions.routes";
import projectRoutes from "./modules/Projects/project.routes";
import taskRoutes from "./modules/Tasks/task.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/projects", authMiddleware, projectRoutes);
app.use("/tasks", authMiddleware, taskRoutes);
app.use("/pomodoro-sessions", authMiddleware, pomodoroSessionRoutes);
app.use("/blocker-logs", authMiddleware, blockerLogRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
