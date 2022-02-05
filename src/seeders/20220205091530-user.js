'use strict';

module.exports = {
  async up(queryInterface, _Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'USERS',
      [
        {
          firstName: 'Filipe',
          lastName: 'Pires',
          email: 'filipe@pires.com',
          password: 'FilipePires2106',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        validate: true,
        individualHooks: true,
      }
    );
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
