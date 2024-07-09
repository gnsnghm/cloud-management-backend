// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// ログインユーザー登録
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO login_users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ログイン
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM login_users WHERE username = $1",
      [username]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (isValid) {
        const token = jwt.sign(
          { userId: user.login_user_id },
          "your_jwt_secret"
        );
        res.json({ token });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
