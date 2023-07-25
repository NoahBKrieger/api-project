'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 IDK st',
        city: 'portland',
        state: 'oregon',
        country: 'USA',
        lat: 69.123,
        lng: 100.456,
        name: 'super house',
        description: ' 5 bed studio with 1 bath',
        price: 12345678.99
      }

    ], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots'
    await queryInterface.bulkDelete(options, null, {});
  }
};
