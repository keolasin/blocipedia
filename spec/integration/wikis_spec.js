const sequelize = require("../../source/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

const request = require("request");
const server = require("../../src/server.js");
const base = "http://localhost:3000/wikis/";
