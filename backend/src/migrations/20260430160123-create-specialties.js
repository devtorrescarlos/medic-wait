"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const exists = await queryInterface.tableExists("specialties");
    if (exists) return;

    await queryInterface.createTable("specialties", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
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

    await queryInterface.addConstraint("users", {
      fields: ["specialty_id"],
      type: "foreign key",
      name: "fk_users_specialty_id",
      references: { table: "specialties", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_users_specialty_id"'
    );
    await queryInterface.sequelize.query(
      'DROP TABLE IF EXISTS "specialties" CASCADE'
    );
  },
};
