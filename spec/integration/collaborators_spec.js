const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;

// helper function to create and authorize new user
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

describe("routes : collaborators,", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({forece: true}).then((res) => {
      // create a user
      User.create({
        name: "Miles",
        email: "Spiderman@email.com",
        password: "Fighting crime is fun",
        role: "standard"
      })
      .then((res) => {
        this.user = res;

        // create a wiki
        Wiki.create({
          title: "Battling bugs in the hospital",
          body: "In hospitals, it can be easy to spread certain bugs if care is not taken",
          private: true,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  // guest user context
  describe("guest attempting to add a collaborator,", () => {
    // before the test suite, ensure no user is signed in
    beforeEach((done) => {
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

    describe("POST /wikis/:wikiId/collaborators/create", () => {
      it("should not create a new collaborator", (done) => {
        const options = {
          url: `${base}wikis/${this.wiki.id}/collaborators/create`
        };

        let collabCountBeforeCreate;

        this.wiki.getCollaborators()
        .then((collaborators) => {
          collabCountBeforeCreate = collaborators.length;

          request.post(options, (err, res, body) => {
            Collaborator.findAll()
            .then((collaborator) => {
              expect(collaborator.length).toBe(collabCountBeforeCreate);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    });
  });

  // standard user context
  describe("standard user attempting to add a  collaborator,", () => {
    // before the tests in this suite, ensure a standard user is signed in
    beforeEach((done) => {
      request.get(
        {           // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            userId: this.user.id, // current user
            role: "standard" // set standard role
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("POST /wikis/:wikiId/collaborators/create", () => {
      it("should not create a new collaborator", (done) => {
        const options = {
          url: `${base}wikis/${this.wiki.id}/collaborators/create`
        };

        let collabCountBeforeCreate;

        this.wiki.getCollaborators()
        .then((collaborators) => {
          collabCountBeforeCreate = collaborators.length;

          request.post(options, (err, res, body) => {
            Collaborator.findAll()
            .then((collaborator) => {
              expect(collaborator.length).toBe(collabCountBeforeCreate);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    });
  });

  // premium user context
  describe("premium user attempting to add a collaborator,", () => {

    // before each test suite, sign in a premium user
    beforeEach((done) => {
      request.get(
        {           // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            role: "premium", // premium user signing in
            userId: this.user.id
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });

    // creating a collaborator
    describe("POST /wikis/:wikiId/collaborators/create", () => {
      it("should create/add a new collaborator", (done) => {
        const options = {
          url: `${base}wikis/${this.wiki.id}/collaborators/create`
        };

        request.post(options, (err, res, body) => {
          Collaborator.findOne({
            where: {
              userId: this.user.id,
              wikiId: this.wiki.id
            }
          })
          .then(collaborator => {
            expect(collaborator).not.toBeNull();
            expect(collaborator.userId).toBe(this.user.id);
            expect(collaborator.wikiId).toBe(this.wiki.id);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    // destroying a collaborator
    describe("POST /wikis/:wikiId/collaborators/destroy", () => {
      it("should destroy a collaborator", (done) => {
        const options = {
          url: `${base}wikis/${this.wiki.id}/collaborators/create`
        };

        // compare before and after destroy()
        let collabCountBeforeDelete;

        // first create a collaborator
        request.post(options, (err, res, body) => {
          // store our new collaborator for comparison
          this.wiki.getCollaborators()
          .then((collaborators) => {
            // set first collaborator from collaborators array
            const collaborator = collaborators[0];
            collabCountBeforeDelete = collaborators.length;

            request.post(`${base}wikis/${this.wiki.id}/collaborators/${collaborator.id}/destroy`, (err, res, body) => {
              // after calling POST destroy, now check if the collaborator is destroyed
              this.wiki.getCollaborators()
              .then(collaborators => {
                expect(collaborators.length).toBe(collabCountBeforeDelete - 1); // -1 since we deleted it
                done();
              });
            });
          });
        });
      });
    });
  });

  // admin user context
  describe("admin user attempting to add a collaborator", () => {
    // before each test suite, sign in a premium user
    beforeEach((done) => {
      request.get(
        {           // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            role: "admin", // premium user signing in
            userId: this.user.id
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });

    // creating a collaborator
    describe("POST /wikis/:wikiId/collaborators/create", () => {
      it("should create/add a new collaborator", (done) => {
        const options = {
          url: `${base}wikis/${this.wiki.id}/collaborators/create`
        };

        request.post(options, (err, res, body) => {
          Collaborator.findOne({
            where: {
              userId: this.user.id,
              wikiId: this.wiki.id
            }
          })
          .then(collaborator => {
            expect(collaborator).not.toBeNull();
            expect(collaborator.userId).toBe(this.user.id);
            expect(collaborator.wikiId).toBe(this.wiki.id);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    // destroying a collaborator
    describe("POST /wikis/:wikiId/collaborators/destroy", () => {
      it("should destroy a collaborator", (done) => {
        const options = {
          url: `${base}wikis/${this.wiki.id}/collaborators/create`
        };

        // compare before and after destroy()
        let collabCountBeforeDelete;

        // first create a collaborator
        request.post(options, (err, res, body) => {
          // store our new collaborator for comparison
          this.wiki.getCollaborators()
          .then((collaborators) => {
            // set first collaborator from collaborators array
            const collaborator = collaborators[0];
            collabCountBeforeDelete = collaborators.length;

            request.post(`${base}wikis/${this.wiki.id}/collaborators/${collaborator.id}/destroy`, (err, res, body) => {
              // after calling POST destroy, now check if the collaborator is destroyed
              this.wiki.getCollaborators()
              .then(collaborators => {
                expect(collaborators.length).toBe(collabCountBeforeDelete - 1); // -1 since we deleted it
                done();
              });
            });
          });
        });
      });
    });
  });
});
