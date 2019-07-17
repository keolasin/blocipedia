// require express/Router
const express = require("express");
const router = express.Router();

// controller
const collaboratorController = require("../controllers/collaboratorController");

// require validators
const validation = require("./validation.js");

// post routes for adding/destroying collaborators
router.post("/wikis/:wikiId/collaborators/add", collaboratorController.add);
router.post("/wikis/:wikiId/collaborators/destroy", collaboratorController.destroy);

module.exports = router;
