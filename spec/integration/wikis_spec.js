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
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch(err => {
      console.log(err);
      done();
    });
  });
})
