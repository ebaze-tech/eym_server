require("dotenv").config();
import express from "express";
import { UserModel } from "./membershipFormModel";
import { validationResult } from "express-validator";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        errors: errors.array(),
        success: false,
      });
    }

    try {
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
      }: RequestPayload = req.body || {};

      console.log(
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
        occupation
      );

      if (
        !fullName ||
        !gender ||
        !dateOfBirth ||
        !religion ||
        !phoneNumber ||
        !residentialAddress ||
        !town ||
        !city ||
        !country ||
        !compound ||
        !quarter ||
        !occupation
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const existingEntry = await UserModel.findOne({
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
      });

      if (existingEntry) {
        return res
          .status(409)
          .json({ message: "Registration data already exists." });
      }

      const createForm = new UserModel({
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
      await createForm.save();

      return res
        .status(200)
        .json({ message: "Registration successful", createForm });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Form not saved. Please, try again.", error });
    }
  },
};
