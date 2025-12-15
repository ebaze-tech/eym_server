import express from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { validationResult } from "express-validator";
import { AdminModel } from "./adminModel";
require("dotenv").config();

const { JWT_SECRET } = process.env;
interface RequestPayload {
  username: string;
  password: string;
}

export const AdminAuthController = {
  adminRegistration: async (req: express.Request, res: express.Response) => {
    console.log("Registration attempt:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
    }

    const { username, password }: RequestPayload = req.body;
    console.log(username, password);

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const existingUsername = await AdminModel.findOne({ username });
      console.log("Existing user check " + existingUsername);

      if (existingUsername) {
        return res.status(400).json({ message: "Username already used" });
      }

      const hashedPassword = await bcrypt.hash(password, 20);

      const newUser = new AdminModel({
        username,
        password: hashedPassword,
      });

      await newUser.save();
      console.log("Admin saved:", newUser._id);

      return res.status(201).json({
        message: "Admin registered successfully",
        adminId: newUser._id,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error encountered during registration. Please, try again.",
      });
    }
  },
  adminLogin: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
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

      if (!JWT_SECRET) {
        return res.status(500).json({ message: "JWT secret not configured" });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN ?? "1h",
      } as SignOptions);

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
