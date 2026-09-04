import rateLimit from "express-rate-limit";

// Rate limiter umum untuk seluruh API (maks 300 request / 15 menit per IP)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Terlalu banyak permintaan dari IP ini. Silakan coba lagi nanti.",
  },
});

// Rate limiter ketat untuk endpoint autentikasi (login, register, refresh token, change password)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15, // maks 15 request per 15 menit per IP
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Terlalu banyak percobaan autentikasi dari IP ini. Silakan coba lagi dalam 15 menit.",
  },
});
