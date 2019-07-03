// require express and validation
const express = require("express");
const router = express.Router();
const validation = require("./validation");

// require controller
const userController = require("../controllers/userController");

// define routes
  // GET
router.get("/users/sign_up", userController.signUp);

  // POST
router.post("/users/sign_up", userController.signUp);

// export router
module.exports = router;
