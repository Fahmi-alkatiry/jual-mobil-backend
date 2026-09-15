import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import offerRoutes from "./routes/offerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Perbaiki CORS agar bisa diakses dari Frontend Produksi & Localhost
const allowedOrigins = [
  'http://localhost:3000',
  'https://jualmobilku.my.id',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Atau set callback(new Error('CORS Error')) untuk proteksi ketat
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Id']
}));

// 2. Parser Body JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Routing
app.use("/api", offerRoutes);
app.use("/api/auth", authRoutes); // Endpoint resmi: /api/auth/register

app.get("/", (req, res) => {
  res.send("Server JualMobilku Ready 🚀");
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});