// routes/os.js
const express = require("express");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// OS登録
router.post("/", async (req, res, next) => {
  const { name, version } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO operating_system (name, version) VALUES ($1, $2) RETURNING *",
      [name, version]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// OS取得
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM operating_system");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// OS更新
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, version } = req.body;
  try {
    const result = await pool.query(
      "UPDATE operating_system SET name=$1, version=$2 WHERE os_id=$3 RETURNING *",
      [name, version, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// OS削除
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM operating_system WHERE os_id = $1 RETURNING *",
      [id]
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
