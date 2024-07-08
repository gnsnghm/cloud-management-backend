const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { provide } = require("vue");
require("dotenv").config();

const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/", (req, res) => res.send("Server is running."));

// ログインユーザー登録
app.post("/api/register", async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO login_users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ログイン
app.post("/api/login", async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// クラウドプロバイダ登録
app.post("/api/cloud-provider", async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO cloud_provider (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// クラウドプロバイダーの取得
app.get("/api/cloud-provider", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cloud_provider");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// クラウドプロバイダー削除エンドポイント
app.delete("/api/cloud-provider/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM cloud_provider WHERE provider_id = $1", [id]);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting cloud provider:", error);
    res.status(500).json({ error: error.message });
  }
});

// クラウドプロバイダー更新エンドポイント
app.put("/api/cloud-provider/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE cloud_provider SET name = $1, description = $2 WHERE provider_id = $3 RETURNING *",
      [name, description, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating cloud provider:", error);
    res.status(500).json({ error: error.message });
  }
});

// データセンターの作成
app.post("/api/data-center", async (req, res) => {
  const { name, location, provider_id } = req.body;
  const parsedProviderId = parseInt(provider_id, 10); // provider_idを整数に変換
  console.log(parsedProviderId);
  if (isNaN(parsedProviderId)) {
    return res.status(400).json({ error: "Invalid provider_id" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO data_center (name, location, provider_id) VALUES ($1, $2, $3) RETURNING *",
      [name, location, parsedProviderId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating data center:", error); // エラーメッセージをログに出力
    // res.status(500).json({ error: error.message });
  }
});

// データセンターの取得
app.get("/api/data-center", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM data_center");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// データセンターの更新エンドポイント
app.put("/api/data-center/:id", async (req, res) => {
  const { id } = req.params;
  const { name, location, provider_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE data_center SET name = $1, location = $2, provider_id = $3 WHERE data_center_id = $4 RETURNING *",
      [name, location, provider_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Data center not found");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    // console.error("Error updating data center:", err);
    res.status(500).send("Server error");
  }
});

// データセンターの削除エンドポイント
app.delete("/api/data-center/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM data_center WHERE data_center_id = $1", [id]);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting data center:", error);
    res.status(500).json({ error: error.message });
  }
});

// クラウドプール登録
app.post("/api/cloud-pool", async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// クラウドプールの取得
app.get("/api/cloud-pool", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cloud_pool");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cloud pools:", error);
    res.status(500).json({ error: error.message });
  }
});

// クラウドプールの更新
app.put("/api/cloud-pool/:id", async (req, res) => {
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
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cloud pool not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// クラウドプールの削除
app.delete("/api/cloud-pool/:id", async (req, res) => {
  console.log("aaa");
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM cloud_pool WHERE cloud_pool_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cloud pool not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 仮想マシン登録
app.post("/api/virtual-machines", async (req, res) => {
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
    const newVM = await pool.query(
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
        vlan,
        disk_id,
        disk_size,
        disk_unit_id,
      ]
    );
    res.json(newVM.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 仮想マシン取得
app.get("/api/virtual-machines", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM virtual_machine");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching virtual machines:", error);
    res.status(500).send("Server error");
  }
});

// 仮想マシンの更新
app.put("/api/virtual-machines/:id", async (req, res) => {
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

  console.log(req.body);

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
        vlan,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating virtual machine:", error);
    res.status(500).send("Server error");
  }
});

// 仮想マシンの削除
app.delete("/api/virtual-machines/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM virtual_machine WHERE vm_id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting virtual machine:", error);
    res.status(500).send("Server error");
  }
});

// 利用ユーザ登録
app.post("/api/users", async (req, res) => {
  const { username, email } = req.body;
  try {
    if (!username || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const result = await pool.query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
      [username, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ユーザーの取得
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

// ユーザの更新
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *",
      [username, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ユーザ削除
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 単位登録
app.post("/api/units", async (req, res) => {
  const { name, multiplier } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO unit (name, multiplier) VALUES ($1, $2) RETURNING *",
      [name, multiplier]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ユニットの取得
app.get("/api/units", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM unit");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ユニットの更新
app.put("/api/units/:id", async (req, res) => {
  const { id } = req.params;
  const { name, multiplier } = req.body;
  try {
    const result = await pool.query(
      "UPDATE unit SET name = $1, multiplier = $2 WHERE unit_id = $3 RETURNING *",
      [name, multiplier, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ユニットの削除
app.delete("/api/units/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM unit WHERE unit_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ストレージ登録
app.post("/api/storage", async (req, res) => {
  const { name, total_capacity, total_capacity_unit_id, cloud_pool_id } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO storage_device (name, total_capacity, total_capacity_unit_id, cloud_pool_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, total_capacity, total_capacity_unit_id, cloud_pool_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    // console.error("Error creating storage device:", error);
    res.status(500).json({ error: error.message });
  }
});

// ストレージの取得
app.get("/api/storage", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM storage_device");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ストレージの更新
app.put("/api/storage/:id", async (req, res) => {
  const { id } = req.params;
  const { name, version } = req.body;
  try {
    const result = await pool.query(
      "UPDATE storage SET name=$1, total_capacity=$2, total_capacity_unit_id=$3, cloud_pool_id=$4 WHERE storage_id=$5 RETURNING *",
      [name, total_capacity, total_capacity_unit_id, cloud_pool_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Storage not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ストレージの削除
app.delete("/api/storage/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM storage WHERE storage_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Storage not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// OSの作成
app.post("/api/os", async (req, res) => {
  const { name, version } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO operating_system (name, version) VALUES ($1, $2) RETURNING *",
      [name, version]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating OS:", error);
    res.status(500).json({ error: error.message });
  }
});

// OSの取得
app.get("/api/os", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM operating_system");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching OS:", error);
    res.status(500).json({ error: error.message });
  }
});

// OS の更新
app.put("/api/os/:id", async (req, res) => {
  const { id } = req.params;
  const { name, version } = req.body;
  try {
    const result = await pool.query(
      "UPDATE operating_system SET name=$1, version=$2 WHERE os_id=$3 RETURNING *",
      [name, version, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "OS not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// OS の削除
app.delete("/api/os/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM operating_system WHERE os_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "OS not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ディスクの登録
app.post("/api/disks", async (req, res) => {
  const { name, storage_device_id, size, unit_id } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      "INSERT INTO disk (disk_name, storage_device_id, size, unit_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, storage_device_id, size, unit_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating disk:", error);
    res.status(500).json({ error: error.message });
  }
});

// ディスクの照会
app.get("/api/disks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM disk");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ディスクの更新
app.put("/api/disks/:id", async (req, res) => {
  const { id } = req.params;
  const { name, size, unit_id, storage_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE disk SET disk_name = $1, size = $2, unit_id = $3, storage_device_id = $4 WHERE disk_id = $5 RETURNING *",
      [name, size, unit_id, storage_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ディスクの削除
app.delete("/api/disks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM disk WHERE disk_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Disk not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
