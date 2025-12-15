import express from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { AdminModel, getAdminByUsername } from "./adminModel";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface RequestPayload {
  username: string;
  password: string;
}

export const AdminAuthController = {
  // ===============================
  // ADMIN REGISTRATION
  // ===============================
  adminRegistration: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        success: false,
      });
    }

    const { username, password }: RequestPayload = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
        success: false,
      });
    }

    try {
      const existingAdmin = await getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(409).json({
          message: "Username already exists",
          success: false,
        });
      }

      // Stronger hashing
      const hashedPassword = await bcrypt.hash(password, 12);

      const newAdmin = new AdminModel({
        username,
        password: hashedPassword,
      });

      await newAdmin.save();

      return res.status(201).json({
        message: "Admin registered successfully",
        admin: {
          id: newAdmin._id,
          username: newAdmin.username,
        },
        success: true,
      });
    } catch (error) {
      console.error("Admin registration error:", error);

      return res.status(500).json({
        message: "Registration failed. Please try again later.",
        success: false,
      });
    }
  },

  // ===============================
  // ADMIN LOGIN
  // ===============================
  adminLogin: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        success: false,
      });
    }

    const { username, password }: RequestPayload = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
        success: false,
      });
    }

    try {
      // Always use same error message to prevent username probing
      const admin = await AdminModel.findOne({ username }).select("+password");

      if (!admin || !admin.password) {
        return res.status(401).json({
          message: "Invalid username or password",
          success: false,
        });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid username or password",
          success: false,
        });
      }

      if (!JWT_SECRET) {
        console.error("JWT_SECRET missing in environment variables");
        return res.status(500).json({
          message: "Authentication service unavailable",
          success: false,
        });
      }

      const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN ?? "1h",
      } as SignOptions);

      return res.status(200).json({
        message: "Login successful",
        token,
        admin: {
          id: admin._id,
          username: admin.username,
        },
        success: true,
      });
    } catch (error) {
      console.error("Admin login error:", error);

      return res.status(500).json({
        message: "Login failed. Please try again later.",
        success: false,
      });
    }
  },
};
