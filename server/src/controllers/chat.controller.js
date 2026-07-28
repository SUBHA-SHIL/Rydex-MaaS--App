import pool from "../db/index.js";

export const sendMessage =
  async (req, res) => {

  try {

    const {
      ride_id,
      sender_id,
      receiver_id,
      message,
    } = req.body;

    const result =
      await pool.query(
        `
        INSERT INTO messages (
          ride_id,
          sender_id,
          receiver_id,
          message
        )

        VALUES ($1,$2,$3,$4)

        RETURNING *
        `,
        [
          ride_id,
          sender_id,
          receiver_id,
          message,
        ]
      );

    res.status(201).json({
      message:
        "Message sent",

      data:
        result.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to send message",
    });
  }
};

export const getMessages =
  async (req, res) => {

  try {

    const rideId =
      req.params.rideId;

    const result =
      await pool.query(
        `
        SELECT
          messages.*,

          users.name
          AS sender_name

        FROM messages

        LEFT JOIN users
        ON messages.sender_id = users.id

        WHERE ride_id = $1

        ORDER BY created_at ASC
        `,
        [rideId]
      );

    res.json(
      result.rows
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch messages",
    });
  }
};