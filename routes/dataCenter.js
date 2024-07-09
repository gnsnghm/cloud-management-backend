// routes/dataCenter.js
const express = require("express");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// データセンター登録
router.post("/", async (req, res, next) => {
  const { name, location, provider_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO data_center (name, location, provider_id) VALUES ($1, $2, $3) RETURNING *",
      [name, location, provider_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// データセンター取得
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM data_center");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// データセンター更新
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, location, provider_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE data_center SET name = $1, location = $2, provider_id = $3 WHERE data_center_id = $4 RETURNING *",
      [name, location, provider_id, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// データセンター削除
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM data_center WHERE data_center_id = $1", [id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
