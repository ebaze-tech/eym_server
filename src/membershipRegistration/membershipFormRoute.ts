import express from "express";
import { MembershipController } from "./membershipFormController";
import { authenticateToken } from "../middleware/auth";
export const router = express.Router();

router.post(
  "/member-registration",
  // authenticateToken,
  MembershipController.createMembership
);
