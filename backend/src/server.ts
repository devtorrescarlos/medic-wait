import express from "express";
import cors from "cors";
import db from "./config/database";
import authRoutes from "./modules/auth/auth.routes";
import slotsRoutes from "./modules/slots/slots.routes";
import scheduleRoutes from "./modules/schedules/schedules.routes";
import appointmentsRoutes from "./modules/appointments/appointments.routes";
import medicalRecordsRoutes from "./modules/medical-records/medical-records-routes";
import doctorsRoutes from "./modules/doctors/doctors.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import { limiter } from "./config/limiter";

export const connectDB = async () => {
  try {
    await db.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

// ROUTES
app.use("/api", limiter);
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotsRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/medical-records", medicalRecordsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.get("/", (req, res) => {
  res.json("OK!");
});

export default app;
