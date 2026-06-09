"use strict";

const bcrypt = require("bcrypt");
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

    // Check existing users by email to avoid duplicate key errors
    const existingUsers = await queryInterface.sequelize.query(
      "SELECT email FROM users WHERE email IN ($1, $2)",
      {
        bind: ["correo@correo.com", "correo2@correo.com"],
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const existingEmails = existingUsers.map((user) => user.email);

    // Only insert if neither email exists
    if (existingEmails.length === 0) {
      // First, get necessary IDs from database
      const adminRole = await queryInterface.sequelize.query(
        "SELECT id FROM roles WHERE name = $1",
        {
          bind: ["admin"],
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const doctorRole = await queryInterface.sequelize.query(
        "SELECT id FROM roles WHERE name = $1",
        {
          bind: ["doctor"],
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const specialty = await queryInterface.sequelize.query(
        "SELECT id FROM specialties WHERE name = $1",
        {
          bind: ["general"],
          type: Sequelize.QueryTypes.SELECT,
        },
      );

      if (
        adminRole.length === 0 ||
        doctorRole.length === 0 ||
        specialty.length === 0
      ) {
        console.log(
          "Required roles or specialty not found, skipping user seed",
        );
        return;
      }

      const userId1 = uuid();
      const userId2 = uuid();

      // Insert users with correct specialty_id
      await queryInterface.bulkInsert("users", [
        {
          id: userId1,
          full_name: "Pedro Perez",
          email: "correo@correo.com",
          age: "32",
          password: bcrypt.hashSync("password", 10),
          is_active: true,
          is_email_verified: true,
          is_approved_by_admin: true,
          specialty_id: specialty[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: userId2,
          full_name: "Maria Lopez",
          email: "correo2@correo.com",
          age: "28",
          password: bcrypt.hashSync("password", 10),
          is_active: false,
          is_email_verified: false,
          is_approved_by_admin: false,
          specialty_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      // Then insert user_roles
      await queryInterface.bulkInsert("user_roles", [
        {
          user_id: userId1,
          role_id: adminRole[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: userId2,
          role_id: doctorRole[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", {
      email: ["correo@correo.com", "correo2@correo.com"],
    });
    await queryInterface.bulkDelete("user_roles", {}, {});
  },
};
