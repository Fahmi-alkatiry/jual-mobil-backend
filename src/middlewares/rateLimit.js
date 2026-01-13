// backend/src/middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';

export const offerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 3, // max 20 request
  message: {
    success: false,
    message: "Terlalu banyak request, coba lagi nanti"
  }
});
