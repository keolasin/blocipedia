const sequelize = require("../../source/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

const request = require("request");
const server = require("../../src/server.js");
const base = "http://localhost:3000/wikis/";

// helper function create and authorize new user
function authorizeUser(role, done) { // helper function to create and authorize new user
  User.create({
    name: "Anthony Auth",
    email: `#{role}@example.com`,
    password: "123456",
    role: role
  })
  .then((user) => {
    request.get({         // mock authentication
      url: "http://localhost:3000/auth/fake",
      form: {
        role: user.role,     // mock authenticate as `role` user
        userId: user.id,
        email: user.email
      }
    },
      (err, res, body) => {
        done();
      }
    );
  });
}

// wikis route
describe("routes : wikis", () => {
  this.user;
  this.wiki;

  beforeEach((done) => {
    sequelize.sync({force: true})
    .then((res) => {
      User.create({
        name: "Chris Creator",
        email: "Chris@email.com",
        password: "wiki CRUD is great",
        role: role
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "How to create wikis",
          body: "This wiki will tell you all about CRUD for wikis",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        });
      });
    })
    .catch(err => {
      console.log(err);
      done();
    });
  });

  // guest visitor
  describe("visitor (not signed in) attempting to perform CRUD actions for Wiki", () => {
    beforeEach((done) => {    // before each suite in this context
      request.get(
        {           // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            userId: 0 // flag to indicate mock auth to destroy any session
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("POST /wikis/create", () => {
      it("should not create a new wiki", (done) => {

      });
    });

    describe("POST /wikis/:wikiId/destroy", () => {
      it("should not delete the wiki with the associated id", (done) => {

      });
    });
  });

  // free user context
  describe("free user perform CRUD actions for public wikis", () => {
    beforeEach((done) => {    // before each suite in this context
       request.get({          // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           role: "free",     // mock authenticate as free user
           userId: this.user.id
         }
       },
         (err, res, body) => {
           done();
         }
       );
    });

    // free user creating public wikis
    describe("POST /wikis/create", () => {
      it("should create a new wiki and redirect", (done) => {
        
      })
    })
  });

  // premium user context

  // admin user context
});
