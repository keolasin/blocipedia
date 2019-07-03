// require modules (express);
const express = require("express");

// require config files
const appConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config.js");

// create express app
const app = express();

// use routeConfig
routeConfig.init(app);
appConfig.init();

module.exports = app;
