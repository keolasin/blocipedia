'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: "Must be a valid email"}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    }
  }, {});
  User.associate = function(models) {
    // has many wikis
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    })
    // associations can be defined here
  };

  User.prototype.isAdmin = function() {
     return this.role === "admin";
  };

  return User;
};
