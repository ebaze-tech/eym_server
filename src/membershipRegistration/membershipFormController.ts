import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { UserModel } from "./membershipFormModel";

dotenv.config();

interface RequestPayload {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  religion: string;
  phoneNumber: string;
  residentialAddress: string;
  town: string;
  city: string;
  country: string;
  compound: string;
  quarter: string;
  occupation: string;
}

export const MembershipController = {
  createMembership: async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        success: false,
      });
    }

    const {
      fullName,
      gender,
      dateOfBirth,
      religion,
      phoneNumber,
      residentialAddress,
      town,
      city,
      country,
      compound,
      quarter,
      occupation,
    }: RequestPayload = req.body ?? {};

    // Centralized required field check
    const requiredFields = {
      fullName,
      gender,
      dateOfBirth,
      religion,
      phoneNumber,
      residentialAddress,
      town,
      city,
      country,
      compound,
      quarter,
      occupation,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || typeof value !== "string") {
        return res.status(400).json({
          message: `Missing or invalid field: ${key}`,
          success: false,
        });
      }
    }

    try {
      // Prevent duplicate registration by unique identifier
      const existingUser = await UserModel.findOne({
        fullName,
        phoneNumber,
      });

      if (existingUser) {
        return res.status(409).json({
          message: "A membership registration already exists for this user",
          success: false,
        });
      }

      const newMembership = new UserModel({
        fullName,
        gender,
        dateOfBirth,
        religion,
        phoneNumber,
        residentialAddress,
        town,
        city,
        country,
        compound,
        quarter,
        occupation,
        status: "approved",
      });

      await newMembership.save();

      return res.status(201).json({
        message: "Membership registration submitted successfully",
        data: {
          id: newMembership._id,
          fullName: newMembership.fullName,
          status: newMembership.status,
        },
        success: true,
      });
    } catch (error) {
      console.error("Membership creation error:", error);

      return res.status(500).json({
        message: "Unable to submit membership registration",
        success: false,
      });
    }
  },
};
