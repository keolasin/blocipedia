// include request module and server.js
const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000";

// static route
describe("routes : static", () => {

  // GET root path "/" spec
  describe("GET /", () => {
    // server should return okay status code if it's running
    it("should return status code 200 and have the 'Welcome to Blocipedia' title", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain('Welcome to Blocipedia');
        done();
      });
    });
  });
});
