import express from "express";

import {
  getRideHistory,
} from "../controllers/history.controller.js";

const router = express.Router();

router.get(
  "/:riderId",
  getRideHistory
);

export default router;