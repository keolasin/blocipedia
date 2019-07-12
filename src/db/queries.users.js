// require User model
const User = require("./models").User;

// use bcrypt for password hashing management
const bcrypt = require("bcryptjs");

module.exports = {
  // handle user creation
  createUser(newUser, callback){

    // salt using bcrypt to pass to hashSync
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    // store hashed password in the database when we create and return the user object
    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  // upgrade user role in database
  upgrade(id){
    return User.findById(id)
    .then((user) => {
      if(!user) {
        // console.log to find hang-up
        return callback("User not found!");
      } else {
        // console.log to find hang-up
        return user.update({ role: "premium" });
      }
    })
    .catch(err => {
      console.log(err);
    });
  },

  // downgrade user role in database
  downgrade(id){
    return User.findById(id)
    .then((user) => {
      if(!user) {
        return callback("User not found!");
      } else {
        return user.update({ role: "standard" });
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
}
