"use strict";

const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all specialty IDs
    const specialties = await queryInterface.sequelize.query(
      "SELECT id, name FROM specialties",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get role IDs
    const adminRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = $1",
      { bind: ["admin"], type: Sequelize.QueryTypes.SELECT }
    );
    const doctorRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = $1",
      { bind: ["doctor"], type: Sequelize.QueryTypes.SELECT }
    );
    const patientRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = $1",
      { bind: ["patient"], type: Sequelize.QueryTypes.SELECT }
    );

    if (adminRole.length === 0 || doctorRole.length === 0 || patientRole.length === 0 || specialties.length === 0) {
      console.log("Required roles or specialties not found, skipping user seed");
      return;
    }

    const password = bcrypt.hashSync("password", 10);
    const now = new Date();

    const doctors = [
      { full_name: "Carlos Rodriguez", email: "carlos.rodriguez@medic.com", age: 45 },
      { full_name: "Ana Martinez", email: "ana.martinez@medic.com", age: 38 },
      { full_name: "Miguel Fernandez", email: "miguel.fernandez@medic.com", age: 52 },
      { full_name: "Laura Sanchez", email: "laura.sanchez@medic.com", age: 41 },
      { full_name: "Roberto Garcia", email: "roberto.garcia@medic.com", age: 48 },
      { full_name: "Elena Torres", email: "elena.torres@medic.com", age: 35 },
      { full_name: "Fernando Lopez", email: "fernando.lopez@medic.com", age: 55 },
      { full_name: "Carmen Diaz", email: "carmen.diaz@medic.com", age: 43 },
      { full_name: "Juan Perez", email: "juan.perez@medic.com", age: 50 },
      { full_name: "Isabel Morales", email: "isabel.morales@medic.com", age: 37 },
      { full_name: "Diego Ramirez", email: "diego.ramirez@medic.com", age: 46 },
      { full_name: "Patricia Herrera", email: "patricia.herrera@medic.com", age: 40 },
      { full_name: "Ricardo Castro", email: "ricardo.castro@medic.com", age: 53 },
      { full_name: "Monica Vargas", email: "monica.vargas@medic.com", age: 39 },
      { full_name: "Javier Mendoza", email: "javier.mendoza@medic.com", age: 47 },
      { full_name: "Sofia Reyes", email: "sofia.reyes@medic.com", age: 36 },
      { full_name: "Andres Gutierrez", email: "andres.gutierrez@medic.com", age: 51 },
      { full_name: "Valeria Cruz", email: "valeria.cruz@medic.com", age: 42 },
      { full_name: "Manuel Ortiz", email: "manuel.ortiz@medic.com", age: 49 },
      { full_name: "Lucia Flores", email: "lucia.flores@medic.com", age: 44 },
    ];

    const patients = [
      { full_name: "Pedro Alvarez", email: "pedro.alvarez@paciente.com", age: 28 },
      { full_name: "Maria Gonzalez", email: "maria.gonzalez@paciente.com", age: 34 },
      { full_name: "Luis Herrera", email: "luis.herrera@paciente.com", age: 42 },
      { full_name: "Ana Jimenez", email: "ana.jimenez@paciente.com", age: 25 },
      { full_name: "Carlos Ruiz", email: "carlos.ruiz@paciente.com", age: 55 },
      { full_name: "Laura Medina", email: "laura.medina@paciente.com", age: 31 },
      { full_name: "Roberto Silva", email: "roberto.silva@paciente.com", age: 48 },
      { full_name: "Elena Rojas", email: "elena.rojas@paciente.com", age: 29 },
      { full_name: "Fernando Castro", email: "fernando.castro@paciente.com", age: 37 },
      { full_name: "Carmen Vega", email: "carmen.vega@paciente.com", age: 44 },
      { full_name: "Juan Morales", email: "juan.morales@paciente.com", age: 52 },
      { full_name: "Isabel Reyes", email: "isabel.reyes@paciente.com", age: 26 },
      { full_name: "Diego Torres", email: "diego.torres@paciente.com", age: 39 },
      { full_name: "Patricia Luna", email: "patricia.luna@paciente.com", age: 47 },
      { full_name: "Ricardo Ortiz", email: "ricardo.ortiz@paciente.com", age: 33 },
      { full_name: "Monica Castillo", email: "monica.castillo@paciente.com", age: 41 },
      { full_name: "Javier Ramos", email: "javier.ramos@paciente.com", age: 50 },
      { full_name: "Sofia Delgado", email: "sofia.delgado@paciente.com", age: 27 },
      { full_name: "Andres Aguilar", email: "andres.aguilar@paciente.com", age: 45 },
      { full_name: "Valeria Soto", email: "valeria.soto@paciente.com", age: 36 },
    ];

    const allEmails = [...doctors, ...patients].map((u) => u.email);
    const emailPlaceholders = allEmails.map((_, i) => `$${i + 1}`).join(", ");
    const existingUsers = await queryInterface.sequelize.query(
      `SELECT email FROM users WHERE email IN (${emailPlaceholders})`,
      { bind: allEmails, type: Sequelize.QueryTypes.SELECT },
    );
    const existingEmailSet = new Set(existingUsers.map((u) => u.email));

    const newDoctors = doctors.filter((d) => !existingEmailSet.has(d.email));
    const newPatients = patients.filter((p) => !existingEmailSet.has(p.email));

    if (newDoctors.length === 0 && newPatients.length === 0) {
      console.log("All demo users already exist — skipping user seed");
      return;
    }

    const doctorUsers = newDoctors.map((doc, index) => ({
      id: uuid(),
      full_name: doc.full_name,
      email: doc.email,
      age: doc.age,
      password,
      is_active: true,
      is_email_verified: true,
      is_approved_by_admin: true,
      specialty_id: specialties[index % specialties.length].id,
      created_at: now,
      updated_at: now,
    }));

    const patientUsers = newPatients.map((pat) => ({
      id: uuid(),
      full_name: pat.full_name,
      email: pat.email,
      age: pat.age,
      password,
      is_active: true,
      is_email_verified: true,
      is_approved_by_admin: true,
      specialty_id: null,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert("users", [...doctorUsers, ...patientUsers]);

    const userRoles = [
      ...doctorUsers.map((user) => ({
        user_id: user.id,
        role_id: doctorRole[0].id,
        createdAt: now,
        updatedAt: now,
      })),
      ...patientUsers.map((user) => ({
        user_id: user.id,
        role_id: patientRole[0].id,
        createdAt: now,
        updatedAt: now,
      })),
    ];

    if (userRoles.length > 0) {
      await queryInterface.bulkInsert("user_roles", userRoles);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_roles", {}, {});
    await queryInterface.bulkDelete("users", {
      email: [
        "carlos.rodriguez@medic.com", "ana.martinez@medic.com", "miguel.fernandez@medic.com",
        "laura.sanchez@medic.com", "roberto.garcia@medic.com", "elena.torres@medic.com",
        "fernando.lopez@medic.com", "carmen.diaz@medic.com", "juan.perez@medic.com",
        "isabel.morales@medic.com", "diego.ramirez@medic.com", "patricia.herrera@medic.com",
        "ricardo.castro@medic.com", "monica.vargas@medic.com", "javier.mendoza@medic.com",
        "sofia.reyes@medic.com", "andres.gutierrez@medic.com", "valeria.cruz@medic.com",
        "manuel.ortiz@medic.com", "lucia.flores@medic.com",
        "pedro.alvarez@paciente.com", "maria.gonzalez@paciente.com", "luis.herrera@paciente.com",
        "ana.jimenez@paciente.com", "carlos.ruiz@paciente.com", "laura.medina@paciente.com",
        "roberto.silva@paciente.com", "elena.rojas@paciente.com", "fernando.castro@paciente.com",
        "carmen.vega@paciente.com", "juan.morales@paciente.com", "isabel.reyes@paciente.com",
        "diego.torres@paciente.com", "patricia.luna@paciente.com", "ricardo.ortiz@paciente.com",
        "monica.castillo@paciente.com", "javier.ramos@paciente.com", "sofia.delgado@paciente.com",
        "andres.aguilar@paciente.com", "valeria.soto@paciente.com",
      ],
    });
  },
};
