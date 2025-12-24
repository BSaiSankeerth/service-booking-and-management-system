import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import app from "./src/app.js";



const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


console.log("ENV CHECK:", {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS ? "LOADED" : "MISSING"
});
