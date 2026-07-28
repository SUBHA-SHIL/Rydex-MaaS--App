import { getIO } from "../socket/socket.js";
import pool from "../db/index.js";
import {
  getConnectedDrivers,
} from "../socket/socket.js";


const findNearestDriver = async (latitude, longitude) => {
  const result = await pool.query(
    `SELECT * FROM users
    WHERE
        role = 'DRIVER'
        AND is_online = true
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
        ` );

  return result.rows[0];
};

export const createRide =
  async (req, res) => {

    try {

      const {
        rider_id,
        pickup_address,
        drop_address,
        pickup_latitude,
        pickup_longitude,
        drop_latitude,
        drop_longitude,
        fare,
      } = req.body;

      // CREATE RIDE

      const rideResult =
        await pool.query(
          `
          INSERT INTO rides (
            rider_id,
            pickup_address,
            drop_address,
            pickup_latitude,
            pickup_longitude,
            drop_latitude,
            drop_longitude,
            fare,
            status
          )
          VALUES (
            $1,$2,$3,$4,$5,
            $6,$7,$8,$9
          )
          RETURNING *
          `,
          [
            rider_id,
            pickup_address,
            drop_address,
            pickup_latitude,
            pickup_longitude,
            drop_latitude,
            drop_longitude,
            fare,
            "SEARCHING",
          ]
        );

      const ride =
        rideResult.rows[0];

      // SEND TO ALL DRIVERS

      const io = getIO();

      io.emit(
        "newRideRequest",
        ride
      );

      return res.status(201).json({
        success: true,
        ride,
      });

    } catch (error) {

      console.log(
        "CREATE RIDE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create ride",
      });
    }
  };

export const getPendingRides =
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT *
          FROM rides
          WHERE status = 'SEARCHING'
          ORDER BY created_at DESC
          `
        );

      return res.json(
        result.rows
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        message:
          "Failed to fetch rides",
      });
    }
  };

export const acceptRide =
  async (req, res) => {

    try {

      const {
        ride_id,
        driver_id,
      } = req.body;

      // CHECK IF ALREADY ACCEPTED

      const existingRide =
        await pool.query(
          `
          SELECT *
          FROM rides
          WHERE id = $1
          `,
          [ride_id]
        );

      const ride =
        existingRide.rows[0];

      if (
        ride.status !==
        "SEARCHING"
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Ride already accepted",
        });
      }

      // ACCEPT RIDE

      const result =
        await pool.query(
          `
          UPDATE rides
          SET
            driver_id = $1,
            status = 'ACCEPTED'
          WHERE id = $2
          RETURNING *
          `,
          [driver_id, ride_id]
        );

      const updatedRide =
        result.rows[0];

      const io = getIO();

      io.emit(
        "rideAccepted",
        updatedRide
      );

      return res.status(200).json({
        success: true,
        ride: updatedRide,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to accept ride",
      });
    }
  };

export const updateRideStatus = async (req, res) => {

  try {

    const io = getIO();

    const {
      ride_id,
      status,
    } = req.body;

    // UPDATE RIDE STATUS

    const rideResult =
      await pool.query(
        `
        UPDATE rides
        SET status = $1
        WHERE id = $2
        RETURNING *
        `,
        [status, ride_id]
      );

    const ride =
      rideResult.rows[0];

    // GENERATE OTP WHEN DRIVER ARRIVES

    if (
      status === "ARRIVED"
    ) {

      const otp =
        Math.floor(
          1000 +
          Math.random() * 9000
        ).toString();

      await pool.query(
        `
    UPDATE rides
    SET otp = $1
    WHERE id = $2
    `,
        [otp, ride_id]
      );

      ride.otp = otp;


      io.emit(
        "rideOtpGenerated",
        ride
      );
    }


    io.emit(
      "rideStatusUpdated",
      ride
    );

    // ADD DRIVER EARNINGS

    if (status === "COMPLETED") {

      await pool.query(
        `
    UPDATE users
    SET earnings =
      COALESCE(earnings, 0) + $1
    WHERE id = $2
    `,
        [ride.fare, ride.driver_id]
      );

      // GET UPDATED EARNINGS

      const earningsResult =
        await pool.query(
          `
      SELECT
      COALESCE(SUM(fare),0)
      AS earnings

      FROM rides

      WHERE
      driver_id = $1

      AND status = 'COMPLETED'
      `,
          [ride.driver_id]
        );

      const io = getIO();

      io.emit(
        "earningsUpdated",
        {
          driver_id:
            ride.driver_id,

          earnings:
            Number(
              earningsResult.rows[0]
                .earnings
            ),
        }
      );
    }

    return res.status(200).json({
      success: true,
      ride,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update ride status",
    });
  }
};


export const verifyRideOtp = async (
  req,
  res
) => {

  try {

    const {
      ride_id,
      otp,
    } = req.body;

    // FIND RIDE

    const result =
      await pool.query(
        `
        SELECT *
        FROM rides
        WHERE id = $1
        `,
        [ride_id]
      );

    if (
      result.rows.length === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Ride not found",
      });
    }

    const ride =
      result.rows[0];

    console.log(
      "DB OTP:",
      ride.otp
    );

    console.log(
      "ENTERED OTP:",
      otp
    );

    // VERIFY OTP

    if (
      String(ride.otp) !==
      String(otp)
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP",
      });
    }

    // START RIDE

    const updatedRide =
      await pool.query(
        `
        UPDATE rides
        SET status = 'STARTED'
        WHERE id = $1
        RETURNING *
        `,
        [ride_id]
      );

    const io = getIO();

    io.emit(
      "rideStatusUpdated",
      updatedRide.rows[0]
    );

    return res.status(200).json({
      success: true,
      ride:
        updatedRide.rows[0],
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to verify OTP",
    });
  }
};

export const getDriverRideHistory = async (
  req,
  res
) => {
  try {

    const { driver_id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM rides
      WHERE driver_id = $1
      AND status = 'COMPLETED'
      ORDER BY created_at DESC
      `,
      [driver_id]
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch history",
    });
  }
};