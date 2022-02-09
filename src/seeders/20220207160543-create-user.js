/* eslint-disable eqeqeq */
/* eslint-disable no-constant-condition */
'use strict';

const { genSaltSync, hashSync } = require('bcryptjs');
const faker = require('faker');

module.exports = {
  async up(queryInterface, _Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const LENGTH = 40;

      const hashPassword = (password) => {
        const salt = genSaltSync(8);
        const password_hash = hashSync(password, salt);
        return password_hash;
      };

      const _users = Array.from({ length: LENGTH }, () => {
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
      const usersIds = await queryInterface.bulkInsert(
        'users',
        [
          {
            firstName: 'Filipe',
            email: 'filipepiresg@gmail.com',
            password: hashPassword('FilipePires2106'),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          ..._users,
        ],
        {
          returning: ['id'],
          validate: true,
          individualHooks: true,
          transaction: t,
        }
      );

      await queryInterface.bulkInsert(
        'users_roles',
        usersIds.map(({ id }, index) => {
          if (index === 0) {
            return { user_id: id, role_id: 3 };
          }
          const isModerator = Math.random() > 0.7;
          return { user_id: id, role_id: isModerator ? 2 : 1 };
        }),
        {
          validate: true,
          individualHooks: true,
          transaction: t,
        }
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
  async down(queryInterface, _Sequelize) {
    return Promise.all([
      await queryInterface.bulkDelete('users_roles', null, {}),
      await queryInterface.bulkDelete('users', null, {}),
    ]);
  },
};
