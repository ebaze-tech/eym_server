import express from "express";
import { AdminController } from "./adminController";
import { authenticateToken } from "../middleware/auth";
export const router = express.Router();

router.get(
  "/all-registrations",
  authenticateToken,
  AdminController.getAllRegistrations
);

router.post("/register", AdminAuthController.adminRegistration);
router.post("/login", AdminAuthController.adminLogin);
