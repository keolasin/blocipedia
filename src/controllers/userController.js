// require helper queries for db
const userQueries = require("../db/queries.users.js");

// require passport for authentication
const passport = require("passport");

module.exports = {
  create(req, res, next){
    // pull values from our request body and add them to a newUser object
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      password_conf: req.body.password_conf
    };

    // use helper query createUser() from userQueries, pass in newUser and callback
    userQueries.createUser(newUser, (err, user) => {
      if(err){ // check for and flash error if there is one
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else { // user created successfully
        // authorize user via passport local strategy
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        })
      }
    });
  },

  signUp(req, res, next){
    res.render("users/sign_up");
  },

  signIn(req, res, next){
    // auth via passport local strategy
    passport.authenticate("local")(req, res, () => {
      if(!req.user){
        req.flash("notice", "Sign in failed, please try again");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in")
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  }
}
