const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../utils/db");

const router = express.Router();

// @route api/auth/register
// @desc  User register
// @Access Public
router.post("/register", async (req, res) => {
  try {
    const { username, password, employeeId, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, password, "employeeId", role) VALUES ($1, $2, $3, $4)',
      [username, hashedPassword, employeeId, role || "user"],
    );

    return res
      .status(201)
      .json({ status: "SUCCESS", message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "ERROR", message: "INTERNAL ERROR" });
  }
});

// @route api/auth/login
// @desc  User login
// @Access Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      (username == "" || password == "",
      username == undefined || password == undefined)
    ) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Invalid credentials" });
    }

    // const user = await db.get("SELECT * FROM users WHERE username = ?", [
    //   username,
    // ]);

    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Invalid Credentials" });
    }

    // Check hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
          employeeId: user.employeeId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: true,
      });
      res.json({
        status: "SUCCESS",
        message: "Login successful",
        role: user.role,
        username: user.username,
      });
    } else {
      res.status(401).json({ status: "ERROR", message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: "Internal Error" });
  }
});

router.get("/logout", (req, res) => {
  // res.clearCookie("token", {
  //   httpOnly: true,
  //   secure: false /* TODO make SECURE True in production */,
  //   sameSite: "lax",
  // });

  return res
    .status(200)
    .json({ status: "SUCCESS", message: "User Logged out successfully" });
});

module.exports = router;
