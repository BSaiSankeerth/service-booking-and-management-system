import PartnerAvailability from "../models/partnerAvailability.js";

/**
 * Partner sets unavailable dates
 */
export const setUnavailableDates = async (req, res) => {
  try {
    const { unavailableDates } = req.body;

    if (!Array.isArray(unavailableDates) || unavailableDates.length === 0) {
      return res.status(400).json({
        message: "unavailableDates must be a non-empty array"
      });
    }

    const availability = await PartnerAvailability.findOneAndUpdate(
      { partner: req.user.id },
      { unavailableDates },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Availability updated",
      availability
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get partner availability
 */
export const getMyAvailability = async (req, res) => {
  try {
    const availability = await PartnerAvailability.findOne({
      partner: req.user.id
    });

    res.status(200).json(availability || { unavailableDates: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
