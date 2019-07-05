// require modules, set base, include database models
const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

// users route
describe("routes : users", () => {

  // start with empty table for testing
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

// GET
  // sign_up page
  describe("GET /users/sign_up", () => {
    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign Up");
        done();
      });
    });
  });

  // sign_in page
  describe("GET /users/sign_in", () => {
    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign In");
        done();
      });
    });
  });

// POST
  // users
  describe("POST /users/sign_up", () => {
    // creates new user and redirects
    it("should create a new user with valid input, and redirect", (done) => {
      const options = {
        url: `${base}sign_up`,
        form: {
          name: "Timmy Test",
          email: "tester@gmail.com",
          password: "No Smoking123"
        }
      }

      // when our response returns, check that user has been created in the users model/database and confirm it was assigned an ID
      request.post(options, (err, res, body) => {
        User.findOne({where: {email: "tester@gmail.com"} })
        .then( user => {
          expect(user).not.toBeNull();
          expect(user.email).toBe("tester@gmail.com");
          expect(user.id).toBe(1);
          done();
        })
        .catch( err => {
          console.log(err);
          done();
        });
      });
    });

    // submit a request with invalid values and expect NOT to create user
    it("should NOT create a new user with invalid input, and redirect", (done) => {
      request.post(
        // incorrect values object for form/post request
        {
          url: base,
          form: {
            name: "Tiffany Tester",
            email: "wrong",
            password: "badpass"
          }
        },
        // second arg in above post() call, check User model
        (err, res, body) => {
          User.findOne({ where: { email: "wrong" }})
          .then((user) => {
            expect(user).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });
  });


});
