// src/middleware/errorMiddleware.ts
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Tampilkan stack trace hanya di environment development
  const response = {
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  console.error(`[Error] ${message}`);
  res.status(statusCode).json(response);
};
