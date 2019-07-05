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

  // GET /users/sign_up page
  describe("GET /users/sign_up", () => {
    it("should render a view with a sign up form" ,(done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign Up");
        done();
      });
    });
  });

  // POST /users
  describe("POST /users", () => {
    it("should create a new user with valid input and redirect", (done) => {
      const options = {
        url: base,
        form: {
          email: "tester@email.com",
          password: "No Smoking"
        }
      }

      // when our response returns, check that user has been created in the users model/database and confirm it was assigned an ID
      request.post(options, (err, res, body) => {
        User.findOne({where: {email: "tester@email.com"} })
        .then( user => {
          expect(user).not.toBeNull();
          expect(user.email).toBe("tester@email.com");
          expect(user.id).toBe(1);
          done();
        })
        .catch( err => {
          console.log(err);
          done();
        });
      });
    });
  });


});
