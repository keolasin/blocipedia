module.exports = {

  // user validation
  validateUsers(req, res, next){

    // check for form POST, email is valid and passwords are 10 characters and the same
    if(req.method === "POST"){
      req.checkBody("email", "must be valid").isEmail();
      req.checkBody("password", "must be valid").isLength( {min: 10} );
      req.checkBody("passowrdConfirmation", "must match password provided").optional().matches(req.body.password);
    }

    // check for errors, flash errors, and redirect or continue
    const errors = req.validationErrors();
    if(errors){
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  }
}
