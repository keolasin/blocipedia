'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        "Users",
        "role",
        {
          type: Sequelize.STRING,
          allowNull: false,

          // default for the role property if not provided at creation
          defaultValue: "standard"
        }
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "role");
  }
};
