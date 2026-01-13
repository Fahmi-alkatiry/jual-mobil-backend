import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import offerRoutes from "./routes/offerRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // Import rute autentikasi

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors()); // Izinkan akses dari Frontend

app.use(
  cors({
    origin: "https://jualmobilku.my.id",
    credentials: true,
  })
);

app.use(express.json()); // Supaya bisa baca JSON body

// Routes Grouping
/**
 * Route untuk penawaran (offers)
 * Contoh: POST /api/offers, GET /api/offers
 */
app.use("/api", offerRoutes);

/**
 * Route untuk autentikasi (auth)
 * Contoh: POST /api/auth/login, POST /api/auth/register
 */
app.use("/api/auth", authRoutes);

// Root check
app.get("/", (req, res) => {
  res.send("Server JualMobilku Ready 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
