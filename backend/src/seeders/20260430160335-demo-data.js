"use strict";
const { v4: uuid } = require("uuid");
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

    // Check existing roles to avoid duplicate key errors
    const existingRoles = await queryInterface.sequelize.query(
      'SELECT name FROM roles',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingRoleNames = existingRoles.map(role => role.name);
    
    const roles = [
      {
        id: uuid(),
        name: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "doctor",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "patient",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const rolesToInsert = roles.filter(role => !existingRoleNames.includes(role.name));
    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert("roles", rolesToInsert);
    }

    // Check existing specialties to avoid duplicate key errors
    const existingSpecialties = await queryInterface.sequelize.query(
      'SELECT name FROM specialties',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingSpecialtyNames = existingSpecialties.map(specialty => specialty.name);

    const specialties = [
      {
        id: uuid(),
        name: "general",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "cardiology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "dermatology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "pediatrics",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "gynecology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "orthopedics",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "neurology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "psychiatry",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: "other",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const specialtiesToInsert = specialties.filter(specialty => !existingSpecialtyNames.includes(specialty.name));
    if (specialtiesToInsert.length > 0) {
      await queryInterface.bulkInsert("specialties", specialtiesToInsert);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("roles", null, {});
    await queryInterface.bulkDelete("specialties", null, {});
  },
};
