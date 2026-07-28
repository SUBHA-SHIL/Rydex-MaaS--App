import pool from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check existing user
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password,
        role,
        phone
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [name, email, hashedPassword, role, phone]
    );

    // Generate token
    const token = jwt.sign(
      {
        id: newUser.rows[0].id,
        role: newUser.rows[0].role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const user = newUser.rows[0];

    delete user.password;

    res.status(201).json({
      message: "User created successfully",
      token,
      user,
    });


  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    delete user.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateProfile =
  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        name,
        email,
        phone,
      } = req.body;

      const result =
        await db.query(
          `
          UPDATE users
          SET
            name = $1,
            email = $2,
            phone = $3
          WHERE id = $4
          RETURNING *
          `,
          [
            name,
            email,
            phone,
            id,
          ]
        );

      res.status(200).json({
        user:
          result.rows[0],
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to update profile",
      });
    }
  };