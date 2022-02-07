'use strict';

const faker = require('faker');

module.exports = {
  async up(queryInterface, _Sequelize) {
    const LENGTH = 10;

    const users = Array.from({ length: LENGTH }, () => {
      const gender = Math.random() < 0.5 ? 0 : 1;
      const day = faker.date.recent(Math.random() * 3);
      const [firstName, lastName] = [faker.name.firstName(gender), faker.name.lastName(gender)];

      return {
        firstName,
        lastName,
        email: faker.internet.email(firstName, lastName),
        password: faker.internet.password(10),
        createdAt: day,
        updatedAt: day,
      };
    });

    await queryInterface.bulkInsert('USERS', users, {
      validate: true,
      individualHooks: true,
    });
  },

  async down(queryInterface, _Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('USERS', null);
  },
};
