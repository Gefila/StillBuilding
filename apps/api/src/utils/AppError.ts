export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Menandai error yang kita buat sendiri (bukan bug sistem)

    Error.captureStackTrace(this, this.constructor);
  }
}
