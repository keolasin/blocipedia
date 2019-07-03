// require modules (express);
const express = require("express");

// require config files
const appConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config.js");

// create express app
const app = express();

// use routeConfig
appConfig.init(app, express);
routeConfig.init(app);


module.exports = app;
