const express = require("express");
const path = require("path");

const AdminController = express.Router();

AdminController.get("/", (req, res) => {
  const htmlPath = path.join(__dirname, "../admin/admin.html");
  res.sendFile(htmlPath);
});

module.exports = { AdminController };
