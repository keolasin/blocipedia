// query the model
const collabQueries = require("../db/queries.collabs.js");
const wikiQueries = require("../db/queries.wikis.js");

// policies/auth
const Authorizer = require("../policies/collaborator");

module.exports = {
  // add collaborators
  add(req, res, next){
    collabQueries.add(req, (err, collaborator) => {
      if(err){
        req.flash("error", err);
      } else {
        res.redirect(req.headers.referer);
      }
    });
  },

  // remove collaborators
  remove(req, res, next){
    if(!req.user){
      collabQueries.remove(req, (err, collaborator) => {
        if(err){
          req.flash("error", err);
        } else {
          res.redirect(req.headers.referer);
        }
      });
    } else {
      req.flash("notice", "You must be signed in to do that.");
      res.redirect(req.headers.referer);
    }
  }
}
