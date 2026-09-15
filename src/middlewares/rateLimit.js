// backend/src/middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';

export const offerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10,
  message: {
    success: false,
    message: "Terlalu banyak permintaan penawaran, silakan coba lagi dalam 15 menit."
  }
});
