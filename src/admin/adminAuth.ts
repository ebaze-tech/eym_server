import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { AdminModel } from "./adminModel";
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
interface RequestPayload {
  username: string;
  password: string;
}

export const AdminAuthController = {
  adminRegistration: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid request" });
    }

    try {
      const { username, password }: RequestPayload = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const existingUsername = await AdminModel.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already used" });
      }

      await AdminModel.create({
        username,
        password: await bcrypt.hash(password, 20),
      });

      return res.status(201).json({
        message: "Admin registered successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error encountered during registration. Please, try again.",
      });
    }
  },
  adminLogin: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const { username, password }: RequestPayload = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required for login" });
    }

    try {
      const user = await AdminModel.findOne({ username }).select("+password");
      if (!user) {
        return res.status(400).json({ message: "Username is invalid" });
      }

      if (!user.password) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET!, {
        expiresIn: process.env.EXPIRES_IN ?? "1h",
      });

      return res.status(200).json({
        message: "Login successful",
        token,
        admin: { id: user._id, username: user.username },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error encountered during login. Please, try again.",
      });
    }
  },
};
