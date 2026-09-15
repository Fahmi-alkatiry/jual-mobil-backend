import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import offerRoutes from "./routes/offerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Perbaiki CORS agar bisa diakses dari Frontend Produksi & Localhost
// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://jualmobilku.my.id',
//   'https://fe.jualmobilku.my.id',
//   process.env.FRONTEND_URL
// ].filter(Boolean);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Id']
}));

// 2. Parser Body JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Routing
app.use("/api/auth", authRoutes); // Endpoint resmi: /api/auth/register
app.use("/api", offerRoutes);

app.get("/", (req, res) => {
  res.send("Server JualMobilku Ready 🚀");
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});