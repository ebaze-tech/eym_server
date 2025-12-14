require("dotenv").config();
import express from "express";
import { UserModel } from "./model";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export const createForm = async (
  req: express.Request,
  res: express.Response
) => {
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
    } = req.body;

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
    });
    await createForm.save();

    return res
      .status(200)
      .json({ message: "Registration successful", createForm });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Form not saved. Please, try again.", error });
  }
};
