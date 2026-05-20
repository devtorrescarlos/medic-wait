"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const exists = await queryInterface.tableExists("slots");
    if (exists) return;

    await queryInterface.createTable("slots", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      schedule_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "doctor_schedules", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      date: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "slots" CASCADE');
  },
};
