import express from "express";
import { contactMail } from "./contactMailer";

export const router = express.Router();

router.post("/contact", contactMail);
