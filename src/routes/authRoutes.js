import express from "express";
import login from "../controllers/login.js";
import register from "../controllers/register.js";
import logout from "../controllers/logout.js";
import authMiddleware from "../middleware/authmiddleware.js";
import allowRoles from "../middleware/rolemiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// only logged-in users can logout
router.post("/logout", authMiddleware, logout);

// example test routes
router.get(
  "/user-dashboard",
  authMiddleware,
  allowRoles("user"),
  (req, res) => {
    res.json({ message: "Welcome User Dashboard" });
  }
);

router.get(
  "/partner-dashboard",
  authMiddleware,
  allowRoles("partner"),
  (req, res) => {
    res.json({ message: "Welcome Partner Dashboard" });
  }
);

export default router;
