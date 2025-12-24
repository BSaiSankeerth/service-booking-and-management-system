import Service from "../models/service.js";

export const createService = async (req, res) => {
  try {
    const { title, description, price, duration } = req.body;

    if (!title || !description || !price || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const service = await Service.create({
      partner: req.user.id,
      title,
      description,
      price,
      duration
    });

    return res.status(201).json({
      message: "Service created successfully",
      service
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Partner views their services
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ partner: req.user.id });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Users view all active services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate("partner", "name");
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
