import express from "express";
import { AdminModel } from "./adminModel";
import { validationResult } from "express-validator";
import { UserModel } from "../membershipRegistration/membershipFormModel";

export const AdminController = {
  getAllRegistrations: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors.array());

      return res.status(400).json({
        message: "Invalid request.",
        error: errors.array(),
        success: false,
      });
    }

    try {
      const getAllRegistrations = await UserModel.find();

      return res.status(200).json({
        message: "Retrieved all registrations",
        getAllRegistrations,
        success: true,
      });
    } catch (error: any) {
      console.error("Error in retrieving all registrations", error);

      return res.status(500).json({
        message: "Could not retrieve registrations. Please refresh",
        error: error,
        success: false,
      });
    }
  },

  getMemberRegistration: async (
    req: express.Request,
    res: express.Response
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors.array());

      return res.status(400).json({
        message: "Invalid request",
        error: errors.array(),
        success: false,
      });
    }

    const id = req.params.userId;

    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }
      return res
        .status(200)
        .json({ message: "Retrieved member data", user: user, success: true });
    } catch (error: any) {
      console.error("Error in fetching member registration", error);

      return res.status(500).json({
        message: "Could not retrieve member data. Please, refresh",
        error: error,
        success: false,
      });
    }
  },

  rejectMembership: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors.array());

      return res
        .status(400)
        .json({ message: "Invalid request", success: false });
    }

    const id = req.params.userId;

    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      const disapproveMembership = await UserModel.findByIdAndUpdate(
        id,
        { status: "unapproved" },
        { new: true }
      );

      return res.status(200).json({
        message: "Membership status changed to unapproved",
        disapproveMembership,
        success: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error, success: false });
    }
  },
};
