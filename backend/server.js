import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";


import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Routes
// import authRoutes from "./routes/authRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import companyRoutes from "./routes/companyRoutes.js";
// import documentRoutes from "./routes/documentRoutes.js";
// import listingRoutes from "./routes/listingRoutes.js";
// import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Connect MongoDB
connectDB(process.env.MONGO_URI);

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
if (NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json()); // Parse JSON request body

// API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/companies", companyRoutes);
// app.use("/api/documents", documentRoutes);
// app.use("/api/listings", listingRoutes);
// app.use("/api/notifications", notificationRoutes);

// Static Uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Production Frontend Serve (optional if deploying full MERN)
if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"))
  );
}

app.get("/", (req, res) => {
  res.send("✅ Backend server running & connected to MongoDB!");
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`)
);
