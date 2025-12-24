import express from "express";
import authRoutes from "./routes/authRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import partnerAvailabilityRoutes from "./routes/partnerAvailabilityRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";




const app = express();

// middleware to read JSON body
app.use(express.json());

// auth routes
app.use("/api/auth", authRoutes);

// test route (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/partner", partnerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/partner/availability", partnerAvailabilityRoutes);
app.use("/api/admin", adminRoutes);


export default app;
