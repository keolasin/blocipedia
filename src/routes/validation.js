module.exports = {
  // user validation
  validateUsers(req, res, next){

    // check for form POST, email is valid and passwords are 10 characters and the same
    if(req.method === "POST"){
      req.checkBody("email", "must be valid.").isEmail();
      req.checkBody("password", "must be valid.").isLength( {min: 10} );
      req.checkBody("password_conf", "must match password provided.").optional().matches(req.body.password);
    }

    // check for errors, flash errors, and redirect or continue
    const errors = req.validationErrors();
    if(errors){
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  },

  // wiki validation
  validateWikis(req, res, next){

    // check for form POST, then ensure wiki has a title, body, owner, and private boolean assigned
    if(req.method === "POST"){
      req.checkBody("title", "must be valid.").isLength( {min: 4} );
      req.checkBody("body", "must be valid.").isLength( {min: 6} );
      req.checkBody("private", "must be true or false").isBoolean();
      req.checkBody("userId", "must have an assigned owner").notEmpty().isInt();
    }


    const errors = req.validationErrors();

    if(errors){
      req.flash("error", error);
      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  }
}
