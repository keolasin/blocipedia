// require express and validation
const express = require("express");
const router = express.Router();
const validation = require("./validation");

// require controller
const userController = require("../controllers/userController");

// define routes
  // GET
router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_out", userController.signOut);

  // POST
router.post("/users", validation.validateUsers, userController.create);
router.post("/users/sign_up", userController.signUp);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);

// export router
module.exports = router;
