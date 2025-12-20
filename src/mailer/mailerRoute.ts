import express from "express";
import { contactMail } from "./mailer";

export const router = express.Router();

router.post("/contact", contactMail);
