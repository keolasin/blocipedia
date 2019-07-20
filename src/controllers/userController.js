// require helper queries for db
const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");

// sendGrid for email conf via twilio
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// stripe payment
const stripe = require('stripe')(process.env.stripeKey);
const stripeAPIKey = process.env.stripePublic;

// require passport for authentication
const passport = require("passport");

module.exports = {
  // create
  create(req, res, next){
    // pull values from our request body and add them to a newUser object
    let newUser = {
      name: req.body.name,
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
        });

        // sendgrid email confirmation
        const msg = {
          to: newUser.email,
          from: 'test@example.com',
          subject: 'Welcome to blocipedia',
          text: 'Welcome to blocipedia! As a new user, you can now create markdowns and share information with others!',
          html: '<strong>Upgrade to a premium plan now!</strong>',
        };
        sgMail.send(msg);
      }
    });
  },

  // payment management
  upgrade(req, res, next) {
    res.render("users/upgrade", {stripeAPIKey});
  },

  payment(req, res, next){
    let payment = 1500;
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then((customer) => {
      stripe.charges.create({
        amount: payment,
        description: "Blocipedia Premium Membership",
        currency: "usd",
        customer: customer.id
      });
    })
    .then(charge => {
      userQueries.upgrade(req.user.dataValues.id);
      console.log("Payment successful trying to flash/redirect");
      req.flash("notice", "Payment successful!");
      console.log("flash successful");
      res.render("users/upgrade", {stripeAPIKey});
    });
  },

  downgrade(req, res, next){
    userQueries.downgrade(req.user.dataValues.id);
    wikiQueries.makeWikisPublic(req.user.id);
    req.flash("notice", "You are no longer a premium user");
    res.redirect("/");
  },

  //signing in/out and sign in form
  signUp(req, res, next){
    res.render("users/sign_up");
  },

  signIn(req, res, next){
    // auth via passport local strategy
    passport.authenticate("local")(req, res, function () {
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
