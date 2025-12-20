import express from "express";
import { partnershipMail } from "./partnershipMailer";

export const router = express.Router();

router.post("/partnership", partnershipMail);
