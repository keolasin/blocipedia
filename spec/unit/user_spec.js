// require sequelize and User model
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
  beforeEach((done) => {
    // start with empty table
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  // methods
  // create
  describe("#create()", ()=> {

    // test successful creation of a user with correct/valid values
    it("should create a User object with a valid email and password", (done) => {
      User.create({
        email: "tester@example.com",
        password: "Indie Coffee"
      })
      .then((user) => {
        expect(user).not.toBeNull();
        expect(user.email).toBe("tester@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    // test creation of a user with incorrect email/password format
    it("should NOT create a User object with an invalid email or password", (done) => {
      User.create({
        email: "notAnEmail string",
        password: "Indie Coffee"
      })
      .then((user) => {
        // we expect this to fail since there is an error, see catch()
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: must be a valid email");
        console.log(err);
        done();
      });
    });
  });

});
