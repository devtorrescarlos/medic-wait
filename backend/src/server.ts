import express from "express";
import cors from "cors";
import db from "./config/database";
import authRoutes from "./modules/auth/auth.routes";
import slotsRoutes from "./modules/slots/slots.routes";
import scheduleRoutes from "./modules/schedules/schedules.routes";
import appointmentsRoutes from "./modules/appointments/appointments.routes";
import medicalRecordsRoutes from "./modules/medical-records/medical-records-router";
import { limiter } from "./config/limiter";


const connectDB = async () => {
    try {
        await db.authenticate();
        await db.sync();
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}

connectDB();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());

// ROUTES
app.use("/api", limiter);
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotsRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/medical-records", medicalRecordsRoutes);

app.get("/", (req, res) => {
    res.json("OK!")
})

export default app;