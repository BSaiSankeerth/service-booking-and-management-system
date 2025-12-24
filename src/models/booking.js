import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    bookingDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed","cancelled"],
      default: "pending"
    },

    startTime: {
    type: String, 
    required: true
    },

    endTime: {
    type: String, // "11:00"
    required: true
    }

  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
