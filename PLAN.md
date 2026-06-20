# Plan: Culminación de DoctorDetailPage

## Objetivo

Reemplazar los datos mock de `DoctorDetailPage.tsx` con datos reales provenientes del backend, e implementar el flujo completo de agendamiento de citas desde la vista de detalle del doctor.

---

## Fase 1 — Backend: Nuevo endpoint `GET /api/doctors/:doctorId/profile`

### Archivos a crear

| Archivo | Propósito |
|---|---|
| `backend/src/modules/doctors/doctors.routes.ts` | Ruta protegida con `verifyPatient` |
| `backend/src/modules/doctors/doctors.controller.ts` | Controller que delega al service |
| `backend/src/modules/doctors/doctors.service.ts` | Lógica de negocio |

### Response del endpoint

```json
{
  "doctor": {
    "id": "uuid",
    "full_name": "Dr. Juan Pérez García",
    "email": "juan.perez@medicwait.com",
    "specialty": { "id": "uuid", "name": "Cardiología" }
  },
  "availableSlots": [
    {
      "date": "2026-06-22",
      "dayName": "lunes",
      "slots": [
        { "id": "uuid", "start_time": "08:00", "end_time": "09:00" },
        { "id": "uuid", "start_time": "09:00", "end_time": "10:00" }
      ]
    }
  ],
  "hasPendingAppointment": false
}
```

### Lógica del service

1. Buscar doctor en `User` con `Role` = "doctor", incluyendo `Specialty`
2. Buscar slots disponibles (`is_available = true`, `is_active = true`, fecha futura) ordenados por fecha y hora
3. Verificar si existe un `Appointment` del paciente actual con este doctor en estado `pending`
4. Agrupar slots por fecha para facilitar el acordeón en el frontend
5. Cachear en Redis

### Registro en server.ts

```typescript
import doctorsRoutes from "./modules/doctors/doctors.routes";
app.use("/api/doctors", doctorsRoutes);
```

---

## Fase 2 — Frontend: Servicios y Hooks

### Servicios

| Archivo | Cambio |
|---|---|
| `frontend/src/services/doctorsService.ts` | **Nuevo:** `getDoctorProfile(doctorId)` |
| `frontend/src/services/appointmentsService.ts` | **Agregar:** `createAppointment({ doctorId, slotId, reason })` |

### Hooks

| Archivo | Cambio |
|---|---|
| `frontend/src/hooks/doctors/useDoctorProfile.ts` | **Nuevo:** `useQuery` con key `["doctorProfile", doctorId]` |
| `frontend/src/hooks/appointments/useAppointmentsMutations.ts` | **Agregar** mutation `createAppointment` que invalida `["doctorProfile"]` y `["patientAppointments"]` |

---

## Fase 3 — Frontend: DoctorDetailPage.tsx

Sustituir completamente el contenido mock por:

1. **Obtener `:id`** de la URL con `useParams()`
2. **Cargar datos** con `useDoctorProfile(id)`
3. **Estados:**
   - **Loading:** spinner/skeleton mientras se cargan los datos
   - **Error:** mensaje de error con opción de reintentar
   - **Success:** renderizar contenido real
4. **Info del doctor:** nombre, especialidad, email (desde datos reales)
5. **Alerta de cita pendiente:** mostrar condicionalmente si `hasPendingAppointment` es `true`, con botón "Ver Cita" que navega al detalle de la cita
6. **Acordeón de slots disponibles:** agrupados por fecha, cada grupo expandible muestra los slots de ese día. Cada slot tiene un botón **"Agendar Cita"**
7. **Modal de agendamiento:** al hacer clic en "Agendar Cita" se abre un modal con:
   - **Select de motivo de consulta** con opciones predefinidas:
     - Consulta de rutina / Control general
     - Análisis de resultados de laboratorio
     - Examen pre-operatorio
     - Examen post-operatorio
     - Control de enfermedad crónica
     - Síntomas respiratorios
     - Dolor o malestar general
     - Solicitud de receta médica
     - Vacunación / Inmunización
     - Chequeo preventivo / Check-up anual
     - Segunda opinión
     - Derivación / Referencia médica
     - Otro
   - Si selecciona **"Otro"**, se muestra un textarea para escribir el motivo manualmente
   - Botón **"Confirmar cita"** que ejecuta la mutation
   - Toast de éxito/error al finalizar
8. **Post-agendamiento:** invalidar queries para refrescar slots y mostrar la alerta de cita pendiente

---

## Fase 4 — Tipos

Agregar a `frontend/src/types/index.ts`:

| Tipo | Descripción |
|---|---|
| `DoctorSlotGroup` | `{ date: string; dayName: string; slots: Slot[] }` |
| `DoctorProfileResponse` | `{ doctor: Doctor; availableSlots: DoctorSlotGroup[]; hasPendingAppointment: boolean }` |

---

## Resumen de archivos a crear/modificar

### Crear

| Archivo |
|---|
| `backend/src/modules/doctors/doctors.routes.ts` |
| `backend/src/modules/doctors/doctors.controller.ts` |
| `backend/src/modules/doctors/doctors.service.ts` |
| `frontend/src/services/doctorsService.ts` |
| `frontend/src/hooks/doctors/useDoctorProfile.ts` |

### Modificar

| Archivo | Cambio |
|---|---|
| `backend/src/server.ts` | Agregar ruta `/api/doctors` |
| `frontend/src/services/appointmentsService.ts` | Agregar `createAppointment` |
| `frontend/src/hooks/appointments/useAppointmentsMutations.ts` | Agregar mutation de crear cita |
| `frontend/src/types/index.ts` | Agregar `DoctorSlotGroup` y `DoctorProfileResponse` |
| `frontend/src/pages/dashboard/patient/doctors/DoctorDetailPage.tsx` | Reemplazar mocks con lógica real |
