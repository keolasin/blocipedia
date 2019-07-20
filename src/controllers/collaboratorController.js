// query the model
const collabQueries = require("../db/queries.collaborators.js");
const wikiQueries = require("../db/queries.wikis.js");

// policies/auth
const Authorizer = require("../policies/collaborator");

module.exports = {
  // add collaborators
  add(req, res, next){
    if(req.user){
      collabQueries.addCollaborator(req, (err, collaborator) => {
        if(err){
          req.flash("error", err);
        }
      });
    } else {
      req.flash("notice", "You must be signed in to do that".);
    }
    res.redirect(req.headers.referer);
  },

  // update collaborators
  update(req, res, next){
    wikiQueries.getWiki(req.params.wikiId, (err, wiki) => {
      let associatedWiki = wiki["wiki"];
      let associatedCollaborators = result["collaborators"];
      if(err || wiki === null){
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, associatedWiki, associatedCollaborators).update();
        if(authorized){
          res.render("collaborating")
        }
      }
    })
  },

  // remove collaborators
  destroy(req, res, next){
    if(req.user){
      collabQueries.remove(req, (err, collaborator) => {
        if(err){
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.");
      res.redirect(req.headers.referer);
    }
  }
}
