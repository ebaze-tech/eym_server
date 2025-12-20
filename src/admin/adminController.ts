import express from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { UserModel } from "../membershipRegistration/membershipFormModel";
import contactMessageModel from "../donationModel.ts/contactMessageModel";

export const AdminController = {
  // GET ALL REGISTRATIONS (ADMIN ONLY)
  getAllRegistrations: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request.",
        success: false,
      });
    }

    try {
      const users = await UserModel.find()
        .select("-__v") // hide internal fields
        .lean(); // prevents mongoose document mutation

      if (!users || users.length === 0) {
        return res.status(404).json({
          message: "No registrations found",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Retrieved all registrations",
        data: users,
        success: true,
      });
    } catch (error) {
      console.error("Get all registrations error:", error);

      return res.status(500).json({
        message: "Something went wrong. Please try again later.",
        success: false,
      });
    }
  },

  // GET SINGLE MEMBER REGISTRATION
  getMemberRegistration: async (
    req: express.Request,
    res: express.Response
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        success: false,
      });
    }

    const { userId } = req.params;

    // Prevent NoSQL / Cast errors
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        success: false,
      });
    }

    try {
      const user = await UserModel.findById(userId).select("-__v").lean();

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Retrieved member data",
        data: user,
        success: true,
      });
    } catch (error) {
      console.error("Get member error:", error);

      return res.status(500).json({
        message: "Unable to retrieve member data.",
        success: false,
      });
    }
  },

  // REJECT MEMBERSHIP (PATCH)
  rejectMembership: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        success: false,
      });
    }

    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        success: false,
      });
    }

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { status: "unapproved" },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Membership rejected successfully",
        data: updatedUser,
        success: true,
      });
    } catch (error) {
      console.error("Reject membership error:", error);

      return res.status(500).json({
        message: "Unable to update membership status",
        success: false,
      });
    }
  },

  getEmails: async (req: express.Request, res: express.Response) => {
    try {
      const messages = await contactMessageModel.find().sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Emails fetched successfully",
        emails: messages,
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch messages", success: false });
    }
  },

  getAnEmail: async (req: express.Request, res: express.Response) => {
    try {
      const { userId } = req.params;
      const message = await contactMessageModel.findById(userId);

      return res
        .status(200)
        .json({ message: "Email found", email: message, success: true });
    } catch (error) {
      console.error("Failed to fetch email:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch email", success: false });
    }
  },
};
