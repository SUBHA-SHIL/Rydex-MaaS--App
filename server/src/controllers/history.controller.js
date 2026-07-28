import pool from "../db/index.js";

export const getRideHistory =
    async (req, res) => {

        try {

            const riderId =
                req.params.riderId;

const rides =
    await pool.query(
        `
SELECT
  rides.*,

  users.name
  AS driver_name,

  users.email
  AS driver_email

FROM rides

LEFT JOIN users
ON CAST(rides.driver_id AS INTEGER) = users.id

ORDER BY rides.created_at DESC

LIMIT 20
`
    );

            res.json(rides.rows);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Failed to fetch rides",
            });
        }
    };