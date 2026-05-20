"use strict";

const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");

const DAYS_TO_GENERATE = 14;
const SLOT_DURATION = 60;

const SCHEDULES_TEMPLATE = [
  { day_of_week: "monday", start_time: "08:00", end_time: "12:00" },
  { day_of_week: "tuesday", start_time: "08:00", end_time: "12:00" },
  { day_of_week: "wednesday", start_time: "08:00", end_time: "12:00" },
  { day_of_week: "thursday", start_time: "14:00", end_time: "18:00" },
  { day_of_week: "friday", start_time: "14:00", end_time: "18:00" },
];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMinutes(date, minutes) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

function getDayName(date) {
  return date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ── 1. Check if schedules already exist ──
    const existingSchedules = await queryInterface.sequelize.query(
      "SELECT id FROM doctor_schedules LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingSchedules.length > 0) {
      console.log("Schedules already exist — skipping seeder");
      return;
    }

    // ── 2. Get doctors ──
    const doctors = await queryInterface.sequelize.query(
      `SELECT u.id FROM users u
       INNER JOIN user_roles ur ON ur.user_id = u.id
       INNER JOIN roles r ON r.id = ur.role_id
       WHERE r.name = 'doctor'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (doctors.length === 0) {
      console.log("No doctors found — skipping seeder");
      return;
    }

    // ── 3. Get or create patients ──
    let patients = await queryInterface.sequelize.query(
      `SELECT u.id FROM users u
       INNER JOIN user_roles ur ON ur.user_id = u.id
       INNER JOIN roles r ON r.id = ur.role_id
       WHERE r.name = 'patient'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (patients.length === 0) {
      const patientRole = await queryInterface.sequelize.query(
        "SELECT id FROM roles WHERE name = 'patient'",
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (patientRole.length === 0) {
        console.log("Patient role not found — skipping seeder");
        return;
      }

      const hashedPassword = await bcrypt.hash("password", 10);

      const newPatients = [
        { id: uuid(), full_name: "Juan Pérez", email: "juan@correo.com" },
        { id: uuid(), full_name: "Ana García", email: "ana@correo.com" },
        { id: uuid(), full_name: "Luis Martínez", email: "luis@correo.com" },
      ];

      const patientEmails = newPatients.map((p) => p.email);
      const emailPlaceholders = patientEmails
        .map((_, i) => `$${i + 1}`)
        .join(", ");
      const existingEmails = await queryInterface.sequelize.query(
        `SELECT email FROM users WHERE email IN (${emailPlaceholders})`,
        {
          bind: patientEmails,
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      const existingEmailSet = new Set(existingEmails.map((e) => e.email));
      const patientsToInsert = newPatients.filter(
        (p) => !existingEmailSet.has(p.email)
      );

      if (patientsToInsert.length > 0) {
        await queryInterface.bulkInsert(
          "users",
          patientsToInsert.map((p) => ({
            id: p.id,
            full_name: p.full_name,
            email: p.email,
            password: hashedPassword,
            is_active: true,
            is_email_verified: true,
            is_approved_by_admin: true,
            specialty_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          }))
        );

        await queryInterface.bulkInsert(
          "user_roles",
          patientsToInsert.map((p) => ({
            user_id: p.id,
            role_id: patientRole[0].id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        );

        patients = patientsToInsert.map((p) => ({ id: p.id }));
      }
    }

    // ── 4. Build schedules, slots, appointments in memory ──
    const scheduleRecords = [];
    const slotRecords = [];
    const today = startOfDay(new Date());

    for (const doctor of doctors) {
      for (const tmpl of SCHEDULES_TEMPLATE) {
        const scheduleId = uuid();

        scheduleRecords.push({
          id: scheduleId,
          doctor_id: doctor.id,
          day_of_week: tmpl.day_of_week,
          start_time: tmpl.start_time,
          end_time: tmpl.end_time,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        });

        const [startH, startM] = tmpl.start_time.split(":").map(Number);
        const [endH, endM] = tmpl.end_time.split(":").map(Number);

        for (let i = 1; i <= DAYS_TO_GENERATE; i++) {
          const currentDay = addDays(today, i);
          const currentDayName = getDayName(currentDay);

          if (currentDayName === tmpl.day_of_week) {
            let slotStart = addMinutes(
              startOfDay(currentDay),
              startH * 60 + startM
            );
            const dayEnd = addMinutes(
              startOfDay(currentDay),
              endH * 60 + endM
            );

            while (slotStart < dayEnd) {
              const slotEnd = addMinutes(slotStart, SLOT_DURATION);

              if (slotEnd <= dayEnd) {
                slotRecords.push({
                  id: uuid(),
                  schedule_id: scheduleId,
                  start_time: slotStart,
                  end_time: slotEnd,
                  date: formatDate(currentDay),
                  is_available: true,
                  is_active: true,
                  created_at: new Date(),
                  updated_at: new Date(),
                });
              }

              slotStart = slotEnd;
            }
          }
        }
      }
    }

    // ── 5. Bulk insert schedules ──
    await queryInterface.bulkInsert("doctor_schedules", scheduleRecords);
    console.log(`Inserted ${scheduleRecords.length} schedules`);

    // ── 6. Select ~30 % of slots to book ──
    const shuffled = [...slotRecords].sort(() => Math.random() - 0.5);
    const numToBook = Math.floor(shuffled.length * 0.3);
    const slotsToBook = shuffled.slice(0, numToBook);
    const bookedIds = new Set(slotsToBook.map((s) => s.id));

    const availableSlots = slotRecords.filter((s) => !bookedIds.has(s.id));
    const bookedSlots = slotRecords
      .filter((s) => bookedIds.has(s.id))
      .map((s) => ({ ...s, is_available: false }));

    // ── 7. Bulk insert slots (available + booked) ──
    if (availableSlots.length > 0) {
      await queryInterface.bulkInsert("slots", availableSlots);
    }
    if (bookedSlots.length > 0) {
      await queryInterface.bulkInsert("slots", bookedSlots);
    }
    console.log(
      `Inserted ${slotRecords.length} slots (${availableSlots.length} available, ${bookedSlots.length} booked)`
    );

    // ── 8. Create appointments for booked slots ──
    if (bookedSlots.length > 0 && patients.length > 0) {
      const appointmentRecords = slotsToBook.map((slot) => {
        const schedule = scheduleRecords.find(
          (s) => s.id === slot.schedule_id
        );
        const patient = patients[Math.floor(Math.random() * patients.length)];

        return {
          id: uuid(),
          doctor_id: schedule.doctor_id,
          patient_id: patient.id,
          slot_id: slot.id,
          reason: "Consulta de rutina",
          cancellation_reason: null,
          status: "confirmed",
          created_at: new Date(),
          updated_at: new Date(),
        };
      });

      await queryInterface.bulkInsert("appointments", appointmentRecords);
      console.log(`Inserted ${appointmentRecords.length} appointments`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("appointments", null, {});
    await queryInterface.bulkDelete("slots", null, {});
    await queryInterface.bulkDelete("doctor_schedules", null, {});
    console.log("Reverted schedules, slots, and appointments seeder");
  },
};
