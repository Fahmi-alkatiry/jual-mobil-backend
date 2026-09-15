import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import offerRoutes from "./routes/offerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = parseInt(env.PORT, 10);
const HOST = env.HOST;

// 1. Trust proxy untuk rate limiting di belakang reverse proxy (Render, Heroku, NGINX, Cloudflare)
app.set("trust proxy", 1);

// 2. CORS configuration
const corsOrigins = env.CORS_ORIGINS.split(",").map((s) => s.trim());

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Parser Body JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Routing
app.use("/api/auth", authRoutes);
app.use("/api", offerRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server JualMobilku Ready 🚀" });
});

// 5. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rute '${req.originalUrl}' tidak ditemukan`,
  });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
});
