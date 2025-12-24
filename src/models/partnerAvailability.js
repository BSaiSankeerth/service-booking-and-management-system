import mongoose from "mongoose";

const partnerAvailabilitySchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    unavailableDates: [
      {
        type: Date
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model(
  "PartnerAvailability",
  partnerAvailabilitySchema
);
