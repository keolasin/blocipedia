const sequelize = require("../../src/db/models/index").sequelize;
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
    password: "1234567890",
    role: role
  })
  .then((user) => {
    request.get({         // mock authentication
      url: "http://localhost:3000/auth/fake",
      form: {
        role: user.role,     // mock authenticate as `role` user
        userId: user.id,
        email: user.email,
        name: user.name
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
  this.secretWiki;

  // start with clear database, then create a new user, public wiki, and private wiki
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then((res) => {
      User.create({
        name: "Chris Creator",
        email: "Chris@email.com",
        password: "wiki CRUD is great",
        role: "standard"
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
          this.wiki = wiki; // public wiki

          Wiki.create({
            title: "Super secret club",
            body: "This is a private wiki for the secret club",
            private: true,
            userId: this.user.id
          })
          .then((newWiki) => {
            this.secretWiki = newWiki; // private wiki
            done();
          });
        });
      });
    })
    .catch(err => {
      console.log(err);
      done();
    });
  });

  // guest visitor context
  describe("visitor (not signed in) attempting to perform CRUD actions for Wiki", () => {
    beforeEach((done) => {    // before each suite in this context
      request.get(
        {           // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            userId: 0 // flag to indicate mock auth to destroy any session (user signed out)
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });

    // Create (visitor should NOT be able to create/POST wikis)
    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Crime fighting in Victorian England",
          body: "Back then, it was all up to Sherlock Holmes and Dr. Watson",
          private: false
        }
      };

      it("should not create a new wiki", (done) => {
        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Crime fighting in Victorian England"}})
          .then((wiki) => {
            expect(wiki).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          })
        });
      });
    });

    // Create: visitor cannot get/access new wiki form
    describe("GET /wikis/new", () => {
      it("should redirect to wikis view", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        });
      });
    });

    // Read (visitor can see all public wikis)
    describe("GET /wikis", () => {
      it("should return a status code of 200, and all public wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("How to create wikis");
          expect(body).not.toContain("Super secret club");
          done();
        });
      });
    });

    describe("GET /wikis/:wikiId", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("This wiki will tell you all about CRUD for wikis");
          done();
        });
      });
    });

    // Update (edit)
    describe("GET /wikis/:wikiId/edit", () => {
      it("should NOT render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Wiki");
          expect(body).toContain("How to create wikis");
          done();
        });
      });
    });

    // Destroy
    describe("POST /wikis/:wikiId/destroy", () => {
      it("should NOT delete the wiki with the associated id", (done) => {
        Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(2);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete);
              done();
            });
          });
        });
      });
    });
  });

  // standard user context
  describe("standard user perform CRUD actions for public wikis", () => {
    beforeEach((done) => {    // before each suite in this context
       request.get({          // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           name: this.user.name,
           role: "standard",     // mock authenticate as standard user
           userId: this.user.id
         }
       },
         (err, res, body) => {
           done();
         }
       );
    });

    // Create
    // standard user creating public wikis
    describe("POST /wikis/create", () => {
      it("should create a new public wiki, and redirect", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Riding public transit",
            body: "Public transit is easy if you know the system!",
            private: false,
            userId: this.user.id
          }
        };
        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Riding public transit"}})
          .then((wiki) => {
            expect(err).toBeNull();
            expect(wiki.title).toBe("Riding public transit");
            expect(wiki.body).toBe("Public transit is easy if you know the system!");
            done();
          })
        });
      });

      it("should NOT create a new private wiki, and redirect", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Surfing the net",
            body: "Only premium users can know how to surf the net",
            private: true,
            userId: this.user.id
          }
        };
        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Surfing the net"}})
          .then((wiki) => {
            expect(err).toBeNull();
            done();
          })
        });
      });
    });

    // Read (standard user can see all public wikis)
    describe("GET /wikis", () => {
      it("should return a status code of 200, and all public wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("How to create wikis");
          expect(body).not.toContain("Super secret club");
          done();
        });
      });
    });

    // Read (individual wiki)
    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("How to create wikis");
          expect(body).toContain("This wiki will tell you all about CRUD for wikis");
          done();
        });
      });
    });

    // Update
    // GET edit form
    describe("GET /wikis/:id/edit", () => {
      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();

          //expect(body).toContain("Edit Wiki");
          //expect(body).toContain("This wiki will tell you all about CRUD for wikis");
          done();
        });
      });
    });

    // POST update
    describe("POST /wikis/:id/update", () => {
      it("should return a status code 302", (done) => {
        request.post({
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "How to create wikis",
            body: "This includes all CRUD actions",
            private: false
          }
        }, (err, res, body) => {
          expect(res.statusCode).toBe(302);
          done();
        });
      });

      it("should update the wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "How to create wikis",
            body: "All you need to know about creating wikis!",
            private: false
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: {id: this.wiki.id}
          })
          .then((wiki) => {
            expect(wiki.title).toBe("How to create wikis");
            expect(wiki.body).toBe("All you need to know about creating wikis!");
            done();
          });
        });
      });
    });

    // Destroy
    // standard user destroying own wikis
    describe("POST /wikis/:id/destroy", () => {

      it("should delete the wiki with the associated id", (done) => {
        Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(2);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            expect(res.statusCode).toBe(302);
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });

    // other standard user tries to delete wiki they don't own
    describe("POST /wikis/:id/destroy", () => {
      beforeEach(done => {
         // create the alt user
         User.create({
           email: "tom@myspace.com",
           name: "tommy",
           password: "will always be your friend",
           role: "standard"
         }).then( user => {
           // sign in/auth the alt user
           request.get(
             {
               url: "http://localhost:3000/auth/fake",
               form: {
                 name: user.name,
                 role: user.role,
                 userId: user.id,
                 email: user.email
               }
             },
             (err, res, body) => {
               done();
             }
           );
         });
       });

      it("should NOT delete a wiki that doesn't belong to the user", (done) => {
        Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(2);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete);
              done();
            });
          });
        });
      });
    });
  });

  // premium user context

  // admin user context
});
