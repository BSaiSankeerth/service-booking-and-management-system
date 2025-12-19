import express from "express";
import {createService,getMyServices,getAllServices} from "../controllers/serviceController.js";
import authMiddleware from "../middleware/authmiddleware.js";
import allowRoles from "../middleware/rolemiddleware.js";

const router = express.Router();

// Partner-only
router.post(
  "/",
  authMiddleware,
  allowRoles("partner"),
  createService
);

router.get(
  "/my",
  authMiddleware,
  allowRoles("partner"),
  getMyServices
);

// User & Partner (public)
router.get("/", getAllServices);

export default router;
