import Booking from "../models/booking.js";
import Service from "../models/service.js";
import PartnerAvailability from "../models/partnerAvailability.js";
import PartnerProfile from "../models/partnerProfile.js";
import { sendEmail } from "../services/emailService.js";

//USER  Create booking

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
  };

export const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, startTime } = req.body;

    if (!serviceId || !bookingDate || !startTime) {
      return res.status(400).json({ message: "All fields required" });
    }

    const service = await Service.findById(serviceId).populate("partner");
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    // CHECK PARTNER VERIFICATION (THIS PART)

    const partnerProfile = await PartnerProfile.findOne({
      user: service.partner._id
    });

    if (!partnerProfile || !partnerProfile.isVerified) {
      return res.status(403).json({
        message: "Partner is not verified yet"
      });
    }


    // calculate end time using service duration

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + service.duration;

    const endTime = `${Math.floor(endMinutes / 60)
      .toString()
      .padStart(2, "0")}:${(endMinutes % 60)
      .toString()
      .padStart(2, "0")}`;

    //  PARTNER AVAILABILITY CHECK

    const availability = await PartnerAvailability.findOne({
      partner: service.partner._id,
      unavailableDates: new Date(bookingDate)
    });

    if (availability) {
      return res.status(409).json({
        message: "Partner is not available on this date"
      });
    }

    //  SLOT OVERLAP CHECK

    const existingBookings = await Booking.find({
      service: serviceId,
      bookingDate: new Date(bookingDate),
      status: { $in: ["pending", "approved", "completed"] }
    });

    const hasOverlap = existingBookings.some((b) => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return startMinutes < bEnd && endMinutes > bStart;
    });

    if (hasOverlap) {
      return res.status(409).json({
        message: "Time slot already booked"
      });
    }
    try{
      await sendEmail({
      to: service.partner.email,
      subject: "New Booking Request",
      text: `You have received a new booking request.
      Service: ${service.title}
      Date: ${bookingDate}
      Time: ${startTime} - ${endTime}
      Please log in to approve or reject this booking.`
      });
    }
    catch(error)
    {
      console.error("email failed",error.message);
    }
     

    const booking = await Booking.create({
      user: req.user.id,
      partner: service.partner._id,
      service: service._id,
      bookingDate,
      startTime,
      endTime
    });


    res.status(201).json({
      message: "Booking created (pending approval)",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PARTNER  View bookings

export const getPartnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ partner: req.user.id })
      .populate("user", "name email")
      .populate("service", "title price");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//PARTNER Approve or Reject booking

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      partner: req.user.id
    })
    .populate("user","email name")
    .populate("service","title");


    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();
    console.log(" Sending approval email to:", booking.user.email);
    try{
        await sendEmail({
      to: booking.user.email,
      subject: "Booking Status Update",
      text: `Your booking for ${booking.service.title}has been ${status}.`
    });
    }
    catch(error){
      console.log("email failed",emailError.message)
    }
    
    res.status(200).json({
      message: `Booking ${status}`,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//user can view booking

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("service", "title price")
      .populate("partner", "name");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//to show work is done

export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      partner: req.user.id
    })
     .populate("user", "email name")
      .populate("partner", "email name")
      .populate("service", "title");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "approved") {
      return res.status(400).json({
        message: "Only approved bookings can be completed"
      });
    }

    booking.status = "completed";
    await booking.save();
    try{
      await sendEmail({
      to: booking.user.email,
      subject: "Service Completed",
      text: `Your service "${booking.service.title}"has been completed successfully.`
    });
    }
    catch(error)
    {
      console.log("email failed",emailError.message)
    }

    res.status(200).json({
      message: "Booking marked as completed",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//to cancle booking 

export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id)
    .populate("user", "email name")
      .populate("partner", "email name")
      .populate("service", "title");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only owner user or assigned partner can cancel
    
    const isUser = booking.user.toString() === req.user.id;
    const isPartner = booking.partner.toString() === req.user.id;

    if (!isUser && !isPartner) {
      return res.status(403).json({ message: "Not authorized to cancel" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Completed bookings cannot be cancelled"
      });
    }

    booking.status = "cancelled";
    booking.cancelReason = reason || "Cancelled by user";
    await booking.save();
    try{
        await sendEmail({
      to: booking.user.email,
      subject: "Booking Cancelled",
      text: `Your booking for ${booking.service.title}has been cancelled.`
    });

    await sendEmail({
      to: booking.partner.email,
      subject: "Booking Cancelled",
      text: `A booking assigned to you for${booking.service.title}has been cancelled.`
    });
    }
     catch(error)
     {
      console.log("email failed",emailError.message)
     }

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
