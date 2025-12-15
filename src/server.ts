import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import { router as registrationRoute } from "./membershipRegistration/membershipFormRoute";
import { router as adminRoute } from "./admin/adminRoute";

dotenv.config();

const app = express();
const { PORT } = process.env;

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(registrationRoute);
app.use(adminRoute);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server running" });
});

const server = http.createServer(app);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to DB:", error);
    process.exit(1);
  });
