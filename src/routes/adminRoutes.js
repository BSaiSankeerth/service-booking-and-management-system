import express from "express";
import {getAllPartners,verifyPartner} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authmiddleware.js";
import allowRoles from "../middleware/rolemiddleware.js";

const router = express.Router();

// Admin only
router.get(
  "/partners",
  authMiddleware,
  allowRoles("admin"),
  getAllPartners
);

router.patch(
  "/partners/:id/verify",
  authMiddleware,
  allowRoles("admin"),
  verifyPartner
);

export default router;
