import express, { urlencoded } from "express";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { requestLogger } from "./middleware/middleware";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3100;
const URL = process.env.URL || "http://localhost";

// Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Main route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Auth routes
app.use("/api/auth", requestLogger, authRoutes);

// Start server
(async function main() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${URL}:${PORT}`);
  });
})();

export default app;
