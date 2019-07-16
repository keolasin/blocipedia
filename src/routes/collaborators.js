// require express/Router
const express = require("express");
const router = express.Router();

// controller
const collaboratorController = require("../controllers/collaboratorController");

// require validators
const validation = require("./validation.js");


module.exports = router;
