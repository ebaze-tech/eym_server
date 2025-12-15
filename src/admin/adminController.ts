import express from "express";
import { AdminModel } from "./adminModel";
import { validationResult } from "express-validator";
import { UserModel } from "../membershipRegistration/membershipFormModel";

export const AdminController = {
  getAllRegistrations: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid request." });
    }

    try {
      const getAllRegistrations = await UserModel.find();
      return res
        .status(200)
        .json({ message: "Retrieved all registrations", getAllRegistrations });
    } catch (error: any) {
      return res.status(500).json({
        message: "Could not retrieve registrations. Please refresh",
        error,
      });
    }
  },
  getMemberRegistration: async (
    req: express.Request,
    res: express.Response
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const id = req.params.userId;

    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "Retrieved member data", user });
    } catch (error: any) {
      return res.status(500).json({
        message: "Could not retrieve member data. Please, refresh",
        error,
      });
    }
  },
  rejectMembership: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const id = req.params.userId;
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const disapproveMembership = await UserModel.findByIdAndUpdate(
        id,
        { status: "unapproved" },
        { new: true }
      );

      return res.status(200).json({
        message: "Membership status changed to unapproved",
        disapproveMembership,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  },
};
