// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiKeyAuth = require("./middleware/apiKeyAuth");

require("dotenv").config();

const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(cors());

// すべてのルートでAPIキーを確認
app.use(apiKeyAuth);

// ルートファイルをインポート
const authRoutes = require("./routes/auth");
const cloudProviderRoutes = require("./routes/cloudProvider");
const dataCenterRoutes = require("./routes/dataCenter");
const cloudPoolRoutes = require("./routes/cloudPool");
const virtualMachineRoutes = require("./routes/virtualMachine");
const userRoutes = require("./routes/user");
const unitRoutes = require("./routes/unit");
const storageRoutes = require("./routes/storage");
const diskRoutes = require("./routes/disk");
const osRoutes = require("./routes/os");

// ルートを使用
app.use("/api", authRoutes);
app.use("/api/cloud-provider", cloudProviderRoutes);
app.use("/api/data-center", dataCenterRoutes);
app.use("/api/cloud-pool", cloudPoolRoutes);
app.use("/api/virtual-machines", virtualMachineRoutes);
app.use("/api/users", userRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/disks", diskRoutes);
app.use("/api/os", osRoutes);

app.get("/", (req, res) => res.send("Server is running."));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
