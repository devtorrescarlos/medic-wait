import { WebSocketServer, WebSocket } from "ws";
import { verifyJWT } from "../utils/jwt";
import { format } from "date-fns";
import Appointment from "../models/Appointment";
import Slot from "../models/Slot";
import User from "../models/User";
import * as notificationsService from "../modules/notifications/notifications.service";

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

    const [slot, patient, doctor] = await Promise.all([
        Slot.findByPk(appointment.slot_id),
        User.findByPk(patient_id),
        User.findByPk(doctor_id),
    ]);

    const formattedDate = slot?.start_time
        ? format(new Date(slot.start_time), "dd/MM/yyyy")
        : "fecha desconocida";

    const patientName = patient?.full_name || "Paciente";
    const doctorName = doctor?.full_name || "Doctor";

    let type: string;
    let title: string;
    let message: string;

    switch (action) {
        case "created":
            type = "appointment_created";
            title = "Nueva cita agendada";
            message = `${patientName} ha agendado una cita para el ${formattedDate}`;
            break;
        case "confirmed":
            type = "appointment_confirmed";
            title = "Cita confirmada";
            message = `${patientName} ha confirmado la cita del ${formattedDate}`;
            break;
        case "cancelled":
            type = "appointment_cancelled";
            title = "Cita cancelada";
            const actorName = actorId === doctor_id ? `Dr. ${doctorName}` : patientName;
            message = `La cita del ${formattedDate} ha sido cancelada por ${actorName}`;
            break;
        case "completed":
            type = "appointment_completed";
            title = "Cita completada";
            message = `La cita del ${formattedDate} ha sido completada por el Dr. ${doctorName}`;
            break;
        default:
            return;
    }

    const notification = await notificationsService.create(
        recipientId, type, title, message, appointment.id, "appointment",
    );

    sendToUser(recipientId, {
        type: "appointment_update",
        action,
        appointmentId: appointment.id,
        notificationId: notification.id,
        title,
        message,
    });
}