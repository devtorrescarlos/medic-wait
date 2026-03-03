import express from "express";
import db from "./config/database";

const connectDB = async () => {
    try {
        await db.authenticate();
        await db.sync({ force: true });
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}

connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json("OK!")
})

export default app;