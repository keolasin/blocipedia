const sequelize = require("../../src/db/models/index").sequelize;
const Collaborator = require("../../src/db/models").Collaborator;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Collaborator", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;
    this.collaborator;

    // start with empty database
    sequelize.sync({force: true})
    .then((res) => {
      // create a user object to associate to the wiki page
      User.create({
        name: "Belinda Bikey",
        email: "bikes@gmail.com",
        password: "bicycle chains are off the hook",
        role: "standard"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "How to take care of a bicycle",
          body: "First you need to buy a bicycle",
          private: true, // only private wikis should have collaborators
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;

          Collaborator.create({
            userId: this.user.id,
            wikiId: this.wiki.id
          })
          .then((collaborator) => {
            this.collaborator = collaborator;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
      })
      .catch(err => {
        console.log(err);
        done();
      });
    });
  });

  describe("#create()", () => {
    it("should create a Collaborator object with a userId and wikiId", (done) => {
      // successful creation
      Collaborator.create({
        userId: this.user.id,
        wikiId: this.wiki.id
      })
      .then((collaborator) => {
        expect(collaborator).not.toBeNull();
        expect(collaborator.id).toBe(2); // we create a collaborator object in the beforeEach, so this new one should be the second one and have id of 2
        expect(collaborator.userId).toBe(this.user.id);
        expect(collaborator.wikiId).toBe(this.wiki.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should NOT create a collaborator with missing userId/wikiId", (done) => {
      Collaborator.create({
        userId: this.user.id
      })
      .then((collaborator) => {
        // this will not execute as we expect an error
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Collaborator.wikiId cannot be null");
        done();
      });
    });
  });

  describe("#setUser()", () => {
    it("should associate a collaborator and a user together", (done) => {
      User.create({ // create a new user
        name: "Suzie Saxophone",
        email: "Music@gmail.com",
        password: "I can play the alto sax",
        role: "standard"
      })
      .then((newUser) => {
        expect(this.collaborator.userId).toBe(this.user.id); // collaborator belongs to first user

        this.collaborator.setUser(newUser) // call the fxn and set the user to be newUser
        .then((collaborator) => {
          expect(collaborator.userId).toBe(newUser.id); // should be newUser id
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    });
  });

  describe("#getUser()", () => {
    it("should return the associated user", (done) => {
      this.collaborator.getUser()
      .then((associatedUser) => {
        expect(associatedUser.name).toBe("Belinda Bikey");
        done();
      });
    });
  });

  describe("#setWiki()", () => {
    it("should associate a wiki and a collaborator together", (done) => {
      Wiki.create({
        title: "Guide to shoes",
        body: "This is a wiki for all things feet",
        userId: this.user.id,
        private: true // only private wikis should have collaborators
      })
      .then((newWiki) => {
        expect(this.collaborator.wikiId).toBe(this.wiki.id); // original wiki is associated

        this.collaborator.setWiki(newWiki) // call fxn to test setting
        .then((collaborator) => {
          expect(collaborator.wikiId).toBe(newWiki.id); // check to see if association changed to be with newWiki
          done();
        })
      })
    });
  });

  describe("#getWiki()", () => {
    it("should return the associated wiki", (done) => {
      this.collaborator.getWiki()
      .then((associatedWiki) => {
        expect(associatedWiki.title).toBe("How to take care of a bicycle");
        done();
      });
    });
  });
});
