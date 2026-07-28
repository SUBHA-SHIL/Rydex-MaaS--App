import pool from "../db/index.js";

export const goOnline = async (
  req,
  res
) => {
  try {

    const { driver_id } =
      req.body;

    const result =
      await pool.query(
        `
        UPDATE users
        SET is_online = true
        WHERE id = $1
        RETURNING *
      `,
        [driver_id]
      );

    res.json({
      message:
        "Driver online",
      driver:
        result.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to go online",
    });
  }
};

export const goOffline = async (
  req,
  res
) => {
  try {

    const { driver_id } =
      req.body;

    const result =
      await pool.query(
        `
        UPDATE users
        SET is_online = false
        WHERE id = $1
        RETURNING *
      `,
        [driver_id]
      );

    res.json({
      message:
        "Driver offline",
      driver:
        result.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to go offline",
    });
  }
};

export const updateDriverLocation = async (req, res) => {

  try {

    const {
      driver_id,
      latitude,
      longitude,
    } = req.body;

    await pool.query(
      `
      UPDATE users
      SET
        latitude = $1,
        longitude = $2
      WHERE id = $3
      `,
      [
        latitude,
        longitude,
        driver_id,
      ]
    );

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to update driver location",
    });
  }
};

export const getNearbyDrivers =
  async (req, res) => {

    try {

      const {
        latitude,
        longitude,
      } = req.query;

      // VALIDATE

      if (
        !latitude ||
        !longitude
      ) {

        return res.status(400).json({
          message:
            "Latitude and longitude required",
        });
      }

      // FETCH ONLINE DRIVERS

      const drivers =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE
            role = 'DRIVER'
            AND is_online = true
            AND latitude IS NOT NULL
            AND longitude IS NOT NULL
          `
        );

      // FILTER NEARBY DRIVERS

      const nearbyDrivers =
        drivers.rows.filter(
          (driver) => {

            const distance =
              Math.sqrt(
                Math.pow(
                  driver.latitude -
                  latitude,
                  2
                ) +
                Math.pow(
                  driver.longitude -
                  longitude,
                  2
                )
              );

            // APPROX 10KM RANGE

            return distance < 0.1;
          }
        );

      return res.json(
        nearbyDrivers
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        message:
          "Failed to fetch drivers",
      });
    }
  };

export const updateDriverStatus = async (req, res) => {

  try {

    const {
      driver_id,
      is_online,
    } = req.body;

    await pool.query(
      `
      UPDATE users
      SET is_online = $1
      WHERE id = $2
      `,
      [
        is_online,
        driver_id,
      ]
    );

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to update status",
    });
  }
};

export const getDriverEarnings =
  async (req, res) => {

    try {

      const { id } = req.params;

      const result =
        await pool.query(

          `
          SELECT
          COALESCE(
            SUM(fare),
            0
          ) AS earnings

          FROM rides

          WHERE
          driver_id = $1

          AND status = 'COMPLETED'
          `,

          [id]
        );

      res.json({
        earnings:
          Number(
            result.rows[0]
              .earnings
          ),
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch earnings",
      });
    }
  };