import express from "express";
import {
  setUnavailableDates,
  getMyAvailability
} from "../controllers/partnerAvailabilityController.js";

import authMiddleware from "../middleware/authmiddleware.js";
import allowRoles from "../middleware/rolemiddleware.js";

const router = express.Router();

router.post(
  "/unavailable",
  authMiddleware,
  allowRoles("partner"),
  setUnavailableDates
);

router.get(
  "/me",
  authMiddleware,
  allowRoles("partner"),
  getMyAvailability
);

export default router;
