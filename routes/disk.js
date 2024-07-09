// routes/disk.js
const express = require("express");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// ディスク登録
router.post("/", async (req, res, next) => {
  const { name, storage_id, size, unit_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO disk (disk_name, storage_device_id, size, unit_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, storage_id, size, unit_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ディスク取得
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM disk");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// ディスク更新
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, size, unit_id, storage_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE disk SET disk_name = $1, size = $2, unit_id = $3, storage_device_id = $4 WHERE disk_id = $5 RETURNING *",
      [name, size, unit_id, storage_id, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ディスク削除
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM disk WHERE disk_id = $1 RETURNING *", [id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
