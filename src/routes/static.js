// require express, set up router
const express = require("express");
const router = express.Router();

// require controller
const staticController = require("../controllers/staticController");

// define routes
router.get("/", staticController.index);

// export router
module.exports = router;
