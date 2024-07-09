const express = require("express");
const pool = require("../db");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

// 仮想マシン登録
router.post("/", async (req, res, next) => {
  const {
    name,
    memory_size,
    memory_unit_id,
    cloud_pool_id,
    os_id,
    user_id,
    ipv4,
    ipv6,
    vlan,
    disk_id,
    disk_size,
    disk_unit_id,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO virtual_machine (name, memory_size, memory_unit_id, cloud_pool_id, os_id, user_id, ipv4, ipv6, vlan, disk_id, disk_size, disk_unit_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [
        name,
        memory_size,
        memory_unit_id,
        cloud_pool_id,
        os_id,
        user_id,
        ipv4,
        ipv6,
        vlan === "" ? null : vlan, // vlanが空の場合nullを代入
        disk_id,
        disk_size,
        disk_unit_id,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 仮想マシン取得
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM virtual_machine");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// 仮想マシン更新
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    memory_size,
    memory_unit_id,
    disk_id,
    disk_size,
    disk_unit_id,
    cloud_pool_id,
    os_id,
    user_id,
    ipv4,
    ipv6,
    vlan,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE virtual_machine SET 
        name = $1, 
        memory_size = $2, 
        memory_unit_id = $3, 
        disk_id = $4, 
        disk_size = $5, 
        disk_unit_id = $6, 
        cloud_pool_id = $7, 
        os_id = $8, 
        user_id = $9, 
        ipv4 = $10, 
        ipv6 = $11, 
        vlan = $12 
      WHERE vm_id = $13 RETURNING *`,
      [
        name,
        memory_size,
        memory_unit_id,
        disk_id,
        disk_size,
        disk_unit_id,
        cloud_pool_id,
        os_id,
        user_id,
        ipv4,
        ipv6,
        vlan === "" ? null : vlan, // vlanが空の場合nullを代入
        id,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 仮想マシン削除
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM virtual_machine WHERE vm_id = $1", [id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
