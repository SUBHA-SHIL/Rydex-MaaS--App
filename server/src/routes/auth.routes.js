import express from "express";

import {
  signUp,
  signIn,
  updateProfile
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.put("/profile/:id", updateProfile);

export default router;