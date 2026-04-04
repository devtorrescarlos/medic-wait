import { WebSocketServer, WebSocket } from "ws";
import { verifyJWT } from "../utils/jwt";
import Appointment from "../models/Appointment";

type ExtendedWebSocket = WebSocket & {
    userId?: string;
    isAlive?: boolean;
}
let wss: WebSocketServer;

const clients = new Map<string, ExtendedWebSocket>();

const sendJson = (socket: ExtendedWebSocket, payload: unknown) => {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
};

export const getWSS = () => wss;

export const broadcast = (payload: unknown) => {
    for (const client of clients.values()) {
        sendJson(client, payload);
    }
};
export const sendToUser = (userId: string, payload: unknown) => {
    const client = clients.get(userId);
    if (client) {
        sendJson(client, payload);
    }
};
export const attachWebSocketServer = (server: any) => {
    wss = new WebSocket.Server({
        server,
        path: "/ws",
        maxPayload: 1024 * 1024,
    });
    wss.on("connection", (socket: ExtendedWebSocket, req) => {
        socket.isAlive = true;

        const url = new URL(req.url || "", `http://${req.headers.host}`);
        const token = url.searchParams.get("token");

        if (!token) {
            sendJson(socket, { type: "error", message: "Token requerido" });
            socket.close(4001);
            return;
        }

        try {
            const decoded = verifyJWT(token);
            socket.userId = decoded.id;
            clients.set(decoded.id, socket);
            sendJson(socket, { type: "authenticated", userId: decoded.id });
        } catch (error: any) {
            console.error("WebSocket auth error:", error.message);
            sendJson(socket, { type: "error", message: error.message || "Token inválido" });
            socket.close(4001);
            return;
        }

        socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        });
        socket.on("close", () => {
            if (socket.userId) {
                clients.delete(socket.userId);
            }
        });
        socket.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
    });
};

export const notifyAppointmentChange = async (appointment: Appointment, action: string, actorId: string) => {
    const { doctor_id, patient_id } = appointment;
    const recipientId = actorId === doctor_id ? patient_id : doctor_id;
    sendToUser(recipientId, { type: "appointment_update", appointmentId: appointment.id, action });
}