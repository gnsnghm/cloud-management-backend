// routes/cloudPool.js
const express = require("express");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// クラウドプール登録
router.post("/", async (req, res, next) => {
  const {
    name,
    total_memory,
    total_memory_unit_id,
    total_cpu,
    total_disk_capacity,
    total_disk_unit_id,
    data_center_id,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO cloud_pool (name, total_memory, total_memory_unit_id, total_cpu, total_disk_capacity, total_disk_unit_id, data_center_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        name,
        total_memory,
        total_memory_unit_id,
        total_cpu,
        total_disk_capacity,
        total_disk_unit_id,
        data_center_id,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// クラウドプール取得
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM cloud_pool");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// クラウドプール更新
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    total_memory,
    total_memory_unit_id,
    total_cpu,
    total_disk_capacity,
    total_disk_unit_id,
    data_center_id,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE cloud_pool SET name = $1, total_memory = $2, total_memory_unit_id = $3, total_cpu = $4, total_disk_capacity = $5, total_disk_unit_id = $6, data_center_id = $7 WHERE cloud_pool_id = $8 RETURNING *",
      [
        name,
        total_memory,
        total_memory_unit_id,
        total_cpu,
        total_disk_capacity,
        total_disk_unit_id,
        data_center_id,
        id,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// クラウドプール削除
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM cloud_pool WHERE cloud_pool_id = $1 RETURNING *",
      [id]
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
