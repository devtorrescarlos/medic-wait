"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const exists = await queryInterface.tableExists("appointments");
    if (exists) return;

    await queryInterface.createTable("appointments", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      doctor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      patient_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      slot_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "slots", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      cancellation_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "completed", "cancelled"),
        defaultValue: "pending",
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
    await queryInterface.sequelize.query(
      'DROP TABLE IF EXISTS "appointments" CASCADE'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_appointments_status" CASCADE'
    );
  },
};
