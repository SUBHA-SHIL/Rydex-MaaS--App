import express from "express";

import {
  createRide,
  getPendingRides,
  acceptRide,
  updateRideStatus,
  getDriverRideHistory,
  verifyRideOtp
} from "../controllers/ride.controller.js";

const router = express.Router();

router.post("/create", createRide);

router.get("/pending", getPendingRides);

router.post("/accept", acceptRide);

router.post("/status", updateRideStatus);

router.post("/verify-otp", verifyRideOtp);

router.get( "/history/:driver_id",getDriverRideHistory);

export default router;