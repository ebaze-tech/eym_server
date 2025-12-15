import express from "express";
import { AdminController } from "./adminController";
import { authenticateToken } from "../middleware/auth";
import { AdminAuthController } from "./adminAuth";
export const router = express.Router();

router.get(
  "/all-registrations",
  // authenticateToken,
  AdminController.getAllRegistrations
);

router.get(
  "/all-registrations/:userId",
  // authenticateToken,
  AdminController.getMemberRegistration
);

router.patch(
  "/membership-application/:userId/reject",
  // authenticateToken,
  AdminController.rejectMembership
);

router.post("/register", AdminAuthController.adminRegistration);
router.post("/login", AdminAuthController.adminLogin);
