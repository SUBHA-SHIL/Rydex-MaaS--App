import express from "express";
import cors from "cors";
import pool from "./db/index.js";

import authRoutes from "./routes/auth.routes.js";
import rideRoutes from "./routes/ride.routes.js";
import driverRoutes from "./routes/driver.routes.js"
import paymentRoutes from "./routes/payment.routes.js";
import historyRoutes from "./routes/history.routes.js";
import chatRoutes from "./routes/chat.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected",
      time: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/chat", chatRoutes);

export default app;