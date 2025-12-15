import express from "express";
import { AdminModel } from "./adminModel";
import { validationResult } from "express-validator";
import { UserModel } from "../membershipRegistration/membershipFormModel";

export const AdminController = {
    getAllRegistrations: async (
  req: express.Request,
  res: express.Response
) => {
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
    return res
      .status(500)
      .json({
        message: "Could not retrieve registrations. Please refresh",
        error,
      });
  }
}
}