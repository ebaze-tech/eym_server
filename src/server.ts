import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import { router as registrationRoute } from "./membershipRegistration/membershipFormRoute";
import { router as adminRoute } from "./admin/adminRoute";
import { router as emailRoute } from "./donationModel.ts/mailerRoute";
import { router as donationRoute } from "./donationModel.ts/donationRoute";

const { PORT, ALLOWED_ORIGIN } = process.env;

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: ALLOWED_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(registrationRoute);
app.use(adminRoute);
app.use(emailRoute);
app.use(donationRoute);

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
