const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs"); // bcryptjsのインポートを追加
const jwt = require("jsonwebtoken");
const { provide } = require("vue");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cloud",
  password: "postgres00",
  port: 5433,
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
app.post("/api/virtual-machine", async (req, res) => {
  const {
    name,
    memory,
    memory_unit_id,
    cpu,
    disk_capacity,
    disk_unit_id,
    cloud_pool_id,
    os_id,
    user_id,
    partitions,
    ip_addresses,
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const virtualMachineResult = await client.query(
      "INSERT INTO virtual_machine (name, memory, memory_unit_id, cpu, disk_capacity, disk_unit_id, cloud_pool_id, os_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        name,
        memory,
        memory_unit_id,
        cpu,
        disk_capacity,
        disk_unit_id,
        cloud_pool_id,
        os_id,
        user_id,
      ]
    );
    const virtualMachineId = virtualMachineResult.rows[0].vm_id;

    for (const partition of partitions) {
      await client.query(
        "INSERT INTO partition (disk_id, size, unit_id, filesystem) VALUES ($1, $2, $3, $4)",
        [
          virtualMachineId,
          partition.size,
          partition.unit_id,
          partition.filesystem,
        ]
      );
    }

    for (const ip of ip_addresses) {
      await client.query(
        "INSERT INTO ip_address (vm_id, vlan, ipv4, ipv6) VALUES ($1, $2, $3, $4)",
        [virtualMachineId, ip.vlan, ip.ipv4, ip.ipv6]
      );
    }

    await client.query("COMMIT");
    res.json(virtualMachineResult.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating virtual machine:", error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// 仮想マシン取得
app.get("/api/virtual-machine", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM virtual_machine");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching virtual machines:", error);
    res.status(500).json({ error: error.message });
  }
});

// 利用ユーザ登録
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// 単位登録
app.post("/api/unit", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO unit (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ユニットの取得
app.get("/api/unit", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM unit");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ストレージ登録
app.post("/api/storage", async (req, res) => {
  const {
    storage_name,
    total_capacity,
    total_capacity_unit_id,
    cloud_pool_id,
  } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      "INSERT INTO storage_device (name, total_capacity, total_capacity_unit_id, cloud_pool_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [storage_name, total_capacity, total_capacity_unit_id, cloud_pool_id]
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

// ディスクの登録
app.post("/api/disk", async (req, res) => {
  const { disk_name, storage_device_id, size, unit_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO disk (disk_name, storage_device_id, size, unit_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [disk_name, storage_device_id, size, unit_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating disk:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
