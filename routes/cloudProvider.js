// routes/cloudProvider.js
const express = require("express");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// クラウドプロバイダ登録
router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO cloud_provider (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// クラウドプロバイダーの取得
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM cloud_provider");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// クラウドプロバイダー更新
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE cloud_provider SET name = $1, description = $2 WHERE provider_id = $3 RETURNING *",
      [name, description, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// クラウドプロバイダー削除
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM cloud_provider WHERE provider_id = $1", [id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
