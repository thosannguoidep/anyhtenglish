require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vocabRoutes = require("./routes/vocabRoutes");
const unitRoutes = require("./routes/unitRoutes");
const examRoutes = require("./routes/examRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vocab", vocabRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/exams", examRoutes);

// Xử lý lỗi tập trung ngay trong server.js
app.use((err, req, res, next) => {
  console.error("[Server Error]:", err.stack);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 LingoPro Full-Stack Server đang chạy tại http://localhost:${PORT}`);
});