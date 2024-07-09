// routes/user.js
const express = require("express");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// ユーザー登録
router.post("/", async (req, res, next) => {
  const { username, email } = req.body;
  try {
    if (!username || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const result = await pool.query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
      [username, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ユーザー取得
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// ユーザー更新
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *",
      [username, email, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ユーザー削除
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
