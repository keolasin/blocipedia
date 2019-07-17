const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wiki");

module.exports = {
  getAllWikis(callback){
    return Wiki.all()
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getWiki(id, callback){
    return Wiki.findById(id, {
      include: [
        { model: Collaborator, as: "collaborators"}
      ]
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addWiki(newWiki, callback){
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteWiki(req, callback){
    // searches for wiki matching the id in the req.params
    return Wiki.findById(req.params.id)
    .then((wiki) => {

      // if we find the wiki, pass it along with signed in user to policy constructor and call destroy()
      const authorized = new Authorizer(req.user, wiki).destroy();

      if(authorized) {
        // if authorized user, call destroy method of Sequelize model to destroy
        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        });

      } else {
        // if not authorized, flash notice message and pass 401 for redirect
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    });
  },

  makeWikisPublic(id){
    return Wiki.findAll()
    .then((wikis) => {
      wikis.forEach((wiki) => {
        if(wiki.userId === id && wiki.private === true){
          wiki.update({
            private: false
          })
        }
      })
    })
    .catch((err) => {
      console.log(err);
    })
  },

  updateWiki(req, updatedWiki, callback){

    // search for a wiki matching the id passed in the req.params
    return Wiki.findById(req.params.id)
    .then((wiki) => {

      //if not found, return error notice
      if(!wiki){
        return callback("Wiki not found");
      }

      // auth the user and wiki by calling update method on policy instance
      const authorized = new Authorizer(req.user, wiki).update();

      if(authorized) {
        // if authorized, call update method of Sequelize model. pass in the object containing the updated attributes/values
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {

        // if not authorized, create notice and give control to controller
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  }
}
