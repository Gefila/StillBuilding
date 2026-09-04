// src/middlewares/error.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

interface SystemError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

// Dictionary pemetaan pesan error untuk Database Constraints (Foreign Key & Unique Constraints)
const DB_CONSTRAINT_MESSAGES: Record<string, string> = {
  pomodoro_sessions_task_id_fkey:
    "Tugas tidak dapat dihapus karena masih memiliki riwayat sesi Pomodoro terkait.",
  tasks_project_id_fkey:
    "Proyek tidak dapat dihapus karena masih memiliki tugas aktif terkait.",
  blocker_logs_project_id_fkey:
    "Proyek tidak dapat dihapus karena masih memiliki catatan kendala terkait.",
  profiles_id_fkey: "Data profil tidak valid atau pengguna tidak ditemukan.",
  users_email_key: "Email tersebut sudah terdaftar di sistem.",
};

export const errorHandler = (
  err: SystemError | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Terjadi kesalahan pada server.";

  // 1. Custom Application Error dari domain / business logic
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    const errorCode = "code" in err ? err.code : undefined;
    const rawMessage = err.message || "";
    const rawDetails =
      "details" in err && typeof err.details === "string" ? err.details : "";
    const fullErrorStr = `${rawMessage} ${rawDetails}`;

    // 2. PostgreSQL / Supabase Error Normalizer
    if (
      errorCode === "23503" ||
      fullErrorStr.includes("violates foreign key constraint")
    ) {
      statusCode = 400;
      const matchedConstraint = Object.keys(DB_CONSTRAINT_MESSAGES).find(
        (constraintKey) => fullErrorStr.includes(constraintKey),
      );

      message = matchedConstraint
        ? DB_CONSTRAINT_MESSAGES[matchedConstraint]
        : "Data tidak dapat dihapus atau diubah karena masih terhubung dengan data lainnya.";
    } else if (
      errorCode === "23505" ||
      fullErrorStr.includes("duplicate key value")
    ) {
      statusCode = 400;
      const matchedConstraint = Object.keys(DB_CONSTRAINT_MESSAGES).find(
        (constraintKey) => fullErrorStr.includes(constraintKey),
      );

      message = matchedConstraint
        ? DB_CONSTRAINT_MESSAGES[matchedConstraint]
        : "Data dengan nilai tersebut sudah terdaftar di sistem.";
    } else if (errorCode === "23502") {
      statusCode = 400;
      message = "Kolom data wajib tidak boleh kosong.";
    } else if (
      errorCode === "22P02" ||
      fullErrorStr.includes("invalid input syntax for type uuid")
    ) {
      statusCode = 400;
      message = "Format ID data tidak valid.";
    } else if (errorCode === "PGRST116") {
      statusCode = 404;
      message = "Data tidak ditemukan.";
    } else if (process.env.NODE_ENV === "development") {
      message = rawMessage || "Internal Server Error";
    }
  }

  // Log error di server console untuk keperluan debugging/observability
  console.error(
    `[API Error] [${req.method} ${req.originalUrl || req.url}] (${statusCode}): ${err.message}`,
  );

  const response = {
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
