import express from "express";
import cors from "cors";
import db from "./config/database";
import authRoutes from "./modules/auth/auth.routes";

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

// REST APi
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json("OK!")
})

export default app;