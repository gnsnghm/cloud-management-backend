// routes/unit.js
const express = require("express");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// ユニット登録
router.post("/", async (req, res, next) => {
  const { name, multiplier } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO unit (name, multiplier) VALUES ($1, $2) RETURNING *",
      [name, multiplier]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ユニット取得
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM unit");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// ユニット更新
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, multiplier } = req.body;
  try {
    const result = await pool.query(
      "UPDATE unit SET name = $1, multiplier = $2 WHERE unit_id = $3 RETURNING *",
      [name, multiplier, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ユニット削除
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM unit WHERE unit_id = $1 RETURNING *", [id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
