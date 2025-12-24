import partnerProfile from "../models/partnerProfile.js";

//Admin → view all partner profiles

export const getAllPartners = async (req, res) => {
  try {
    const partners = await partnerProfile.find()
      .populate("user", "name email role");

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//Admin → verify partner

export const verifyPartner = async (req, res) => {
  try {
    const partner = await partnerProfile.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    partner.isVerified = true;
    await partner.save();

    res.status(200).json({
      message: "Partner verified successfully",
      partner
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
