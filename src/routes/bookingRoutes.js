import express from "express";
import {createBooking,getPartnerBookings,updateBookingStatus,getMyBookings,completeBooking,cancelBooking} from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authmiddleware.js";
import allowRoles from "../middleware/rolemiddleware.js";

const router = express.Router();

// USER → book service
router.post(
  "/",
  authMiddleware,
  allowRoles("user"),
  createBooking
);

// PARTNER → view bookings
router.get(
  "/partner",
  authMiddleware,
  allowRoles("partner"),
  getPartnerBookings
);

// PARTNER → approve/reject
router.patch(
  "/:id/status",
  authMiddleware,
  allowRoles("partner"),
  updateBookingStatus
);

router.get(
  "/my",
  authMiddleware,
  allowRoles("user"),
  getMyBookings
);
export default router;

// PARTNER → complete booking
router.patch(
  "/:id/complete",
  authMiddleware,
  allowRoles("partner"),
  completeBooking
);

// USER or PARTNER → cancel booking
router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelBooking
);
