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
router.get("/users/upgrade", userController.upgrade);

  // POST
router.post("/users/:id/upgrade", userController.payment);
router.post("/users/:id/downgrade", userController.downgrade);
router.post("/users/sign_up", validation.validateUsers, userController.create);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);

// export router
module.exports = router;
