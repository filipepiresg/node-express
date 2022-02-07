'use strict';

const { genSaltSync, hashSync } = require('bcryptjs');
const faker = require('faker');

module.exports = {
  async up(queryInterface, _Sequelize) {
    try {
      const LENGTH = 10;

      const hashPassword = (password) => {
        const salt = genSaltSync(8);
        const password_hash = hashSync(password, salt);
        return password_hash;
      };

      const users = Array.from({ length: LENGTH }, () => {
        const gender = Math.random() < 0.5 ? 0 : 1;
        const day = faker.date.recent(Math.random() * 3);
        const [firstName, lastName] = [faker.name.firstName(gender), faker.name.lastName(gender)];
        const isDeleted = Math.random() > 0.8;

        return {
          firstName,
          lastName,
          email: faker.internet.email(firstName, lastName).toLowerCase(),
          password: hashPassword(faker.internet.password(10)),
          createdAt: day,
          updatedAt: day,
          deletedAt: isDeleted ? faker.date.recent(1) : null,
        };
      });

      await queryInterface.bulkInsert(
        'users',
        [
          {
            firstName: 'Filipe',
            email: 'filipepiresg@gmail.com',
            password: hashPassword('FilipePires2106'),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          ...users,
        ],
        {
          validate: true,
          individualHooks: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
