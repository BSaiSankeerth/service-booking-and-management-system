import express from "express";
import authRoutes from "./routes/authRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";


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

export default app;
