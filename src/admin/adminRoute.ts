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

router.delete("/delete-registration/:userId", AdminController.deleteMembership);

router.get(
  "/all-registrations/:userId",
  // authenticateToken,
  AdminController.getMemberRegistration
);

router.get("/all-mails", AdminController.getEmails);
router.get("/all-partners", AdminController.getPartners);
router.get("/all-donors", AdminController.getDonations);

router.get("/all-emails/:userId", AdminController.getAnEmail);

router.post(
  "/membership-application/:userId/reject",
  // authenticateToken,
  AdminController.rejectMembership
);

router.post("/register", AdminAuthController.adminRegistration);
router.post("/login", AdminAuthController.adminLogin);
