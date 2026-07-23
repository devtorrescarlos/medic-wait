'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [results] = await queryInterface.sequelize.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'users' AND column_name = 'refresh_token'`
    );
    if (results.length > 0) return;

    await queryInterface.addColumn('users', 'refresh_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'refresh_token');
  }
};
