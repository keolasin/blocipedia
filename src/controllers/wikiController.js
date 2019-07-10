const wikiQueries = require("../db/queries.wikis.js");

const Authorizer = require("../policies/wiki");

module.exports = {

  // index page of all wikis to view
  index(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
      if(err){
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", {wikis});
      }
    })
  },

  // creating new wiki route
  new(req, res, next){
    // access the request object and passport can use req.user
    // create new instance of policy class
    const authorized = new Authorizer(req.user).new();

    //render the wiki form or flash a notice and redirect
    if(authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next){

      // pass the user to the policy constructor and call create on the policy instance
     const authorized = new Authorizer(req.user).create();

     //if true, continue with Wiki obj creation
     if(authorized) {
       let newWiki = {
         title: req.body.title,
         body: req.body.body,
         private: false,
         userId: req.user.id
       };
       wikiQueries.addWiki(newWiki, (err, wiki) => {
         if(err){
           res.redirect(500, "wikis/new");
         } else {
           res.redirect(303, `/wikis`);
         }
       });
     } else {

       // if not authorized, flash error and redirect
       req.flash("notice", "You are not authorized to do that.");
       res.redirect("/wikis");
     }
   },

  show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
        res.render("wikis/show", {wiki});
      }
    });
  },

  destroy(req, res, next){

    // pass the request object to the deleteWiki method
     wikiQueries.deleteWiki(req, (err, wiki) => {
       if(err){
         res.redirect(err, `/wikis/${req.params.id}`)
       } else {
         res.redirect(303, "/wikis")
       }
     });
   },

  edit(req, res, next){
    // query for the wiki with the matching id from the url params
     wikiQueries.getWiki(req.params.id, (err, wiki) => {
       if(err || wiki == null){
         res.redirect(404, "/");
       } else {
         //if we find the wiki, pass it to the policy constructor along with signed in user - call edit from policy class
         const authorized = new Authorizer(req.user, wiki).edit();

         // render edit view if authorized or flash error and redirect
         if(authorized){
           res.render("wikis/edit", {wiki});
         } else {
           req.flash("You are not authorized to do that.")
           res.redirect(`/wikis/${req.params.id}`)
         }
       }
     });
   },

   update(req, res, next){
     console.log(`wikiController.update called successfully, calling wikiQueries.updateWiki() next`);
      wikiQueries.updateWiki(req, req.body, (err, wiki) => {
        if(err || wiki == null){
          res.redirect(401, `/wikis/${req.params.id}/edit`);
        } else {
          res.redirect(`/wikis/${req.params.id}`);
        }
      });
    }
}
