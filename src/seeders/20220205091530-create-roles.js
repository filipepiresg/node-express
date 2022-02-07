'use strict';

const ROLES = require('../config/roles.json');

module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.bulkInsert(
      'roles',
      ROLES.map((item) => ({
        name: item.name.toLowerCase(),
      })),
      {
        validate: true,
        individualHooks: true,
      }
    );
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
