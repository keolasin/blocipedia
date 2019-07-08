const express = require("express");
const router = express.Router();

// controller
const wikiController = require("../controllers/wikiController");

// require helper, validator
const helper = require("../auth/helpers");
const validation = require("./validation");

router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.get("/wikis/:id", wikiController.show);
router.get("/wikis/:id/edit", wikiController.edit);

router.post("/wikis/create",
  helper.ensureAuthenticated,
  validation.validateWikis,
  wikiController.create);
router.post("/wikis/:id/update", validation.validateWikis, wikiController.update);
router.post("/wikis/:id/destroy", wikiController.destroy);

module.exports = router;
