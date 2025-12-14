import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({ credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server running" });
});

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
