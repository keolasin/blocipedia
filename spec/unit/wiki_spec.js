const sequelize = require("../../source/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;


describe("Wiki", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;

    // start with empty database
    sequelize.sync({fore: true}).then((res) => {
      // create a user object to associate to the wiki page
      User.create({
        name: "Wendy Wiki",
        email: "Burgers@gmail.com",
        password: "Redhair and freckles"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "How to make the perfect burger",
          body: "First, forget everything you know about burgers.",
          private: false
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        });
      });
    });
  });

  // tests for CREATE
  it("#create()", () => {
    // successful creation with correct parameters
    it("should create the wiki object with a title and body", (done) => {
      Wiki.create({
        title: "Stand-up Paddle-boarding",
        body: "The trick to stand-up paddle-boarding is to stand up!",
        private: false
      })
      .then((wiki) => {
        expect(wiki.title).toBe("Stand-up Paddle-boarding");
        expect(wiki.body).toBe("The trick to stand-up paddle-boarding is to stand up!");
        expect(wiki.private).toBe(false);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    // bad parameters, unsucssesful creation
    it("should NOT create the wiki object if it's missing a title, body, or private boolean", (done) => {
      Wiki.create({
        title: "Cloud Sailing",
        private: true
      })
      .then((wiki) => {
        // this should not evaluate since there will be an error during creation, see catch() for expectation
      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.body cannot be null");
        done();
      });
    });
  });
});
