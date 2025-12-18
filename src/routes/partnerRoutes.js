import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile
} from "../controllers/partnerProfile.js";
import authMiddleware from "../middleware/authmiddleware.js";
import allowRoles from "../middleware/rolemiddleware.js";

const router = express.Router();

router.post(
  "/profile",
  authMiddleware,
  allowRoles("partner"),
  createOrUpdateProfile
);

router.get(
  "/profile/me",
  authMiddleware,
  allowRoles("partner"),
  getMyProfile
);

export default router;
