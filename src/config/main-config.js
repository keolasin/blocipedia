// require .env
require("dotenv").config();

// require modules/middleware
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");
//const passportConfig = require("./passport-config");
const logger = require("morgan");

module.exports = {
  init(app, express){
    // logger
    app.use(logger('dev'));

    // views
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");

    // bodyparser
    app.use(bodyParser.urlencoded({ extended: true }));

    // assets
    app.use(express.static(path.join(__dirname, "..", "assets")));

    // expressValidator
    app.use(expressValidator());

    // express session
    /*app.use(session({
      secret: process.env.cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 } // 14 day expiration
    }));
    */
    // express flash
    app.use(flash());

    /* passport
    passportConfig.init(app);
    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    });
    */
  }
};
