// require bcrypt to handle password hashing/salting
const bcrypt = require("bcryptjs");

module.exports = {

  // check auth, redirects to sign in page if not authorized
  ensureAuthenticated(req, res, next) {
    if (!req.user){
      req.flash("notice", "You must be signed in to do that.")
      return res.redirect("/users/sign_in");
    } else {
      next();
    }
  },

  // bcrypts compareSync() decrypts the hashed db password and compares to the provided plain-text password
  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  }
}
