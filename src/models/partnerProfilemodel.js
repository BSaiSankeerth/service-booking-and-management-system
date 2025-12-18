import mongoose from "mongoose";

const partnerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,//user id when he register for first time from user schema
      ref: "User",
      required: true,
      unique: true
    },

    skills: {
      type: [String],
      required: true
    },

    experience: {
      type: Number,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    availability: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("PartnerProfile", partnerProfileSchema);
