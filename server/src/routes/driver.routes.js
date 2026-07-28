import express from "express";

import {
  goOnline,
  goOffline,
  updateDriverLocation,
  getNearbyDrivers,
  updateDriverStatus,
  getDriverEarnings
} from "../controllers/driver.controller.js";

const router =
  express.Router();

router.post(
  "/online",
  goOnline
);

router.post(
  "/offline",
  goOffline
);

router.post(
  "/location",
  updateDriverLocation
);

router.post(
  "/status",
  updateDriverStatus
);

router.get(
  "/nearby",
  getNearbyDrivers
);

router.get(
  "/earnings/:id",
  getDriverEarnings
);

export default router;