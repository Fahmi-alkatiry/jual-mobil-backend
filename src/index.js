import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import offerRoutes from "./routes/offerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Izinkan semua origin (Default)
app.use(cors());

// ATAU jika ingin eksplisit mengizinkan origin tertentu:
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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
