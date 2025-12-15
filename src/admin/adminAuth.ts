import express from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { validationResult } from "express-validator";
import { AdminModel, getAdminByUsername } from "./adminModel";
require("dotenv").config();

const { JWT_SECRET } = process.env;
interface RequestPayload {
  username: string;
  password: string;
}

export const AdminAuthController = {
  adminRegistration: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors.array());

      return res.status(400).json({
        message: "Invalid request",
        errors: errors.array(),
        success: false,
      });
    }

    const { username, password }: RequestPayload = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    try {
      const existingUsername = await getAdminByUsername(username);

      if (existingUsername) {
        return res
          .status(400)
          .json({ message: "Username already used", success: false });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new AdminModel({
        username,
        password: hashedPassword,
      });

      await newUser.save();

      return res.status(201).json({
        message: "Admin registered successfully",
        userId: newUser._id,
        username: newUser.username,
        success: true,
      });
    } catch (error: any) {
      console.error(
        "Error in admin registration controller. Debug soon",
        error
      );

      return res.status(500).json({
        message: "Error encountered during registration. Please, try again.",
        error: error,
        success: false,
      });
    }
  },

  adminLogin: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors.array());

      return res.status(400).json({
        message: "Invalid request",
        errors: errors.array(),
        success: false,
      });
    }

    const { username, password }: RequestPayload = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required for login",
        success: false,
      });
    }

    try {
      const user = await AdminModel.findOne({ username }).select("+password");
      if (!user) {
        return res
          .status(400)
          .json({ message: "Username is invalid", success: false });
      }

      if (!user.password) {
        return res
          .status(400)
          .json({ message: "Invalid password", success: false });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Invalid email or password", success: false });
      }

      if (!JWT_SECRET) {
        return res
          .status(500)
          .json({ message: "JWT secret not configured", success: false });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN ?? "1h",
      } as SignOptions);

      return res.status(200).json({
        message: "Login successful",
        token,
        admin: { id: user._id, username: user.username },
        success: true,
      });
    } catch (error) {
      console.error("Error in admin login. Debug soon", error);

      return res.status(500).json({
        message: "Error encountered during login. Please, try again.",
        success: false,
        error: error,
      });
    }
  },
};
