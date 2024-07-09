// routes/storage.js
const express = require("express");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// ストレージ登録
router.post("/", async (req, res, next) => {
  const { name, total_capacity, total_capacity_unit_id, cloud_pool_id } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO storage_device (name, total_capacity, total_capacity_unit_id, cloud_pool_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, total_capacity, total_capacity_unit_id, cloud_pool_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ストレージ取得
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM storage_device");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// ストレージ更新
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, total_capacity, total_capacity_unit_id, cloud_pool_id } =
    req.body;
  try {
    const result = await pool.query(
      "UPDATE storage_device SET name=$1, total_capacity=$2, total_capacity_unit_id=$3, cloud_pool_id=$4 WHERE storage_device_id=$5 RETURNING *",
      [name, total_capacity, total_capacity_unit_id, cloud_pool_id, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ストレージ削除
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM storage_device WHERE storage_device_id = $1 RETURNING *",
      [id]
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
