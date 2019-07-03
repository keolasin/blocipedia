// require express and validation
const express = require("express");
const router = express.Router();
const validation = require("./validation");

// require controller
const userController = require("../controllers/userController");

// define routes
router.get("/users/signup", userController.signUp);
router.post("/users/signup", userController.signUp);

// export router
module.exports = router;
