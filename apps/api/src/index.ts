import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { apiLimiter } from "./middlewares/rateLimiter.middleware";
import authRoutes from "./modules/Auth/auth.routes";
import blockerLogRoutes from "./modules/Blocker-logs/blockerLog.routes";
import pomodoroSessionRoutes from "./modules/Pomodoro-sessions/pomodoro_sessions.routes";
import projectRoutes from "./modules/Projects/project.routes";
import statsRoutes from "./modules/Stats/stats.routes";
import taskRoutes from "./modules/Tasks/task.routes";
import { AppError } from "./utils/AppError";

const app = express();
const port = process.env.PORT || 3000;

// Trust Nginx reverse proxy (correct client IP in X-Forwarded-For)
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:8081",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Health check endpoint
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// General API rate limiter
app.use(apiLimiter);

app.use("/auth", authRoutes);
app.use("/projects", authMiddleware, projectRoutes);
app.use("/tasks", authMiddleware, taskRoutes);
app.use("/pomodoro-sessions", authMiddleware, pomodoroSessionRoutes);
app.use("/blocker-logs", authMiddleware, blockerLogRoutes);
app.use("/stats", authMiddleware, statsRoutes);

// 404 catch-all handler
app.use((req, _res, next) => {
  next(
    new AppError(`Rute ${req.method} ${req.originalUrl} tidak ditemukan`, 404),
  );
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
