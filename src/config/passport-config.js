// handle auth using passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");

module.exports = {
  init(app){
    // init passport and use sessions to keep track of authentication
    app.use(passport.initialize());
    app.use(passport.session());

    // use the local strategy
    passport.use(new LocalStrategy({
      usernameField: "email"
    }, (email, password, done) => {
      User.findOne({
        where: { email }
      })
      .then((user) => {
        // use authHelper to compare password and hashedPassword
        if(!user || !authHelper.comparePass(password, user.password)) {
          return done(null, false, { message: "Invalid email or password" });
        }
        return done(null, user);
      })
    }));

    passport.serializeUser((user, callback) => {
      callback(null, user.id);
    });

    passport.deserializeUser((id, callback) => {
      User.findById(id)
      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err, user);
      });
    });
  }
}
