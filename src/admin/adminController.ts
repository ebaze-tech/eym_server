import express from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { UserModel } from "../membershipRegistration/membershipFormModel";
import contactMessageModel from "../mailer/contactMessageModel";
import { donationModel } from "../mailer/donationModel";
import { partnershipModel } from "../mailer/partnershipModel";

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

      // Always return 200, even if empty
      return res.status(200).json({
        message: "Retrieved all registrations",
        data: users || [],
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
        { status: "rejected" },
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
  deleteMembership: async (req: express.Request, res: express.Response) => {
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
      const deletedUser = await UserModel.findByIdAndDelete(userId).select(
        "-__v"
      );

      if (!deletedUser) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Membership deleted successfully",
        data: deletedUser,
        success: true,
      });
    } catch (error) {
      console.error("Delete membership error:", error);

      return res.status(500).json({
        message: "Unable to delete membership",
        success: false,
      });
    }
  },

  getEmails: async (req: express.Request, res: express.Response) => {
    try {
      const messages = await contactMessageModel.find().sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Emails fetched successfully",
        data: messages,
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch messages", success: false });
    }
  },

    getDonations: async (req: express.Request, res: express.Response) => {
    try {
      const donations = await donationModel.find().sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Donations fetched successfully",
        data: donations,
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch messages", success: false });
    }
  },

      getPartners: async (req: express.Request, res: express.Response) => {
    try {
      const partners = await partnershipModel.find().sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Partnerships fetched successfully",
        data: partners,
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
        .json({ message: "Email found", data: message, success: true });
    } catch (error) {
      console.error("Failed to fetch email:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch email", success: false });
    }
  },

  updateMembership: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        success: false,
      });
    }

    const { userId } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No update data provided",
        success: false,
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        success: false,
      });
    }

    try {
      // Prevent updating immutable fields
      delete updates._id;
      delete updates.createdAt;
      delete updates.updatedAt;

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Membership updated successfully",
        data: updatedUser,
        success: true,
      });
    } catch (error: any) {
      console.error("Update membership error:", error);

      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(409).json({
          message: "Duplicate field value entered",
          error: error.keyValue,
          success: false,
        });
      }

      return res.status(500).json({
        message: "Unable to update membership",
        error: error.message,
        success: false,
      });
    }
  },
};
