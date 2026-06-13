import axios from "axios";

const OPEN_ROUTER_BASE_URL = "https://openrouter.ai/api/v1";

const openrouterClient = axios.create({
  baseURL: OPEN_ROUTER_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
    "X-Title": "MedicWait",
  },
  timeout: 30000,
});

export default openrouterClient;
