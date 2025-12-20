import express from "express";
import { donationEmail } from "./donationMailer";
export const router = express.Router();

router.post("/donation", donationEmail);
