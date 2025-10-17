const express = require("express");
const router = express.Router();
const { listEmployees } = require("../controllers/employeeController");

// Pública
router.get("/", listEmployees);

module.exports = router;