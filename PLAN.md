# Plan de Normalización de Base de Datos - 3FN

## Descripción del Proyecto

Sistema de agendamiento de citas médicas con:
- **Backend**: Express + TypeScript + PostgreSQL + Redis
- **Frontend**: React + TypeScript + Vite + TailwindCSS

---

## Estructura Normalizada Objetivo

```
users
  ├─── user_roles ────► roles
  │
  └─── specialty_id ──► specialties (allowNull)

users ──(doctor_id)──► doctor_schedules ──► slots ──► appointments ──► users(patient_id)
                                              │
                                              └─── users(doctor_id via schedule)
```

---

## Tablas a Crear

### 1. `roles`
Almacena los roles del sistema.

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| name | VARCHAR(50) | UNIQUE, NOT NULL | 'admin', 'doctor', 'patient' |
| created_at | TIMESTAMP | DEFAULT NOW() | |

**Datos iniciales:**
```sql
INSERT INTO roles (name) VALUES ('admin'), ('doctor'), ('patient');
```

**Notas:**
- El rol 'admin' tiene como funcionalidad principal aprobar doctores.
- Los permisos se manejan a nivel de endpoint/middleware, no en esta tabla.

---

### 2. `user_roles`
Tabla pivote para la relación muchos a muchos entre usuarios y roles.

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| user_id | UUID | FK → users(id) ON DELETE CASCADE, PK | |
| role_id | UUID | FK → roles(id) ON DELETE CASCADE, PK | |

---

### 3. `specialties`
Catálogo de especialidades médicas.

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| name | VARCHAR(100) | UNIQUE, NOT NULL | 'Cardiología', 'General', etc. |
| created_at | TIMESTAMP | DEFAULT NOW() | |

**Datos iniciales:**
```sql
INSERT INTO specialties (name) VALUES 
  ('General'), ('Cardiología'), ('Dermatología'), 
  ('Pediatría'), ('Ginecología'), ('Ortopedia'), 
  ('Neurología'), ('Psiquiatría');
```

---

## Tablas a Modificar

### 4. `users`
**Cambios:**
- Eliminar enum `role` → se manejará via `user_roles`
- Eliminar enum `specialty` → FK a `specialties` (allowNull)

**Estructura final:**
| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | UUID | PK | |
| email | VARCHAR | UNIQUE, NOT NULL | |
| password | VARCHAR | NOT NULL | |
| full_name | VARCHAR | NOT NULL | (renombrado de fullName) |
| specialty_id | UUID | FK → specialties(id), NULL | allowNull |
| is_active | BOOLEAN | DEFAULT true | |
| is_email_verified | BOOLEAN | DEFAULT false | |
| is_approved_by_admin | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

**Relaciones:**
- Many-to-many con `roles` via `user_roles`

---

### 5. `doctor_schedules`
**Cambios:**
- Eliminar `slot_duration` (hardcodeado a 60 minutos)

**Estructura final:**
| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | UUID | PK | |
| doctor_id | UUID | FK → users(id) ON DELETE CASCADE, NOT NULL | |
| day_of_week | ENUM | NOT NULL | 'monday'...'sunday' |
| start_time | TIME | NOT NULL | Formato "HH:mm" |
| end_time | TIME | NOT NULL | Formato "HH:mm" |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

**Constraints:**
- UNIQUE(doctor_id, day_of_week) - Un doctor no puede tener dos horarios para el mismo día

**Notas:**
- La duración del slot es hardcodeada a 60 minutos en la lógica de generación de slots.
- Los 15-30 minutos剩余 permiten al doctor reordenar el consultorio, limpiar, reabastecer, etc.

---

### 6. `slots`
**Cambios:**
- Eliminar `doctor_id` → se obtiene via `schedule_id` → `doctor_schedules` → `doctor_id`
- Eliminar `slot_duration` → hardcodeado a 60 min

**Estructura final:**
| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | UUID | PK | |
| schedule_id | UUID | FK → doctor_schedules(id) ON DELETE CASCADE, NOT NULL | |
| start_time | TIMESTAMP | NOT NULL | Fecha + hora de inicio |
| end_time | TIMESTAMP | NOT NULL | Fecha + hora de fin |
| date | VARCHAR(10) | NOT NULL | Formato "yyyy-MM-dd" |
| is_available | BOOLEAN | DEFAULT true | TRUE = libre, FALSE = reservado |
| is_active | BOOLEAN | DEFAULT true | FALSE = eliminado |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

**Notas:**
- `doctor_id` se obtiene mediante JOIN: `slot.schedule.doctor_id`
- `date` se mantiene como campo separado para facilitar consultas sin necesidad de convertir timestamps

---

### 7. `appointments`
**Cambios:**
- Eliminar `patient_fullName` → JOIN con `users.full_name`
- Eliminar `patient_email` → JOIN con `users.email`
- Eliminar `start_time` → JOIN con `slots.start_time`
- Eliminar `end_time` → JOIN con `slots.end_time`
- Eliminar `date` → JOIN con `slots.date` o calcular de `slots.start_time`

**Estructura final:**
| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | UUID | PK | |
| doctor_id | UUID | FK → users(id), NOT NULL | |
| patient_id | UUID | FK → users(id), NOT NULL | |
| slot_id | UUID | FK → slots(id) ON DELETE CASCADE, NOT NULL | |
| reason | TEXT | NOT NULL | Motivo de la cita |
| cancellation_reason | TEXT | NULL | Razón de cancelación |
| status | ENUM | DEFAULT 'pending' | 'pending', 'confirmed', 'completed', 'cancelled' |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

---

## Tablas Sin Cambios

### 8. `medical_records`
Sin modificaciones.

### 9. `medical_record_annexes`
Sin modificaciones.

---

## Middleware Simplificado

### Antes:
```typescript
// Dos middlewares separados
verifyPatient
verifyDoctor
```

### Después:
```typescript
// Un solo middleware genérico
verifyRole('doctor')
verifyRole('patient')
verifyRole('admin')
```

El middleware consultará la tabla `user_roles` para verificar el rol del usuario.

---

## Migración de Datos (Estrategia Simplificada)

Dado que solo existen datos de prueba, se recomienda un enfoque straightforward:

### Fase 1: Crear nuevas tablas
1. Crear tabla `roles`
2. Crear tabla `specialties`
3. Poblar con datos iniciales
4. Crear tabla `user_roles`

### Fase 2: Migrar datos existentes
1. Migrar roles de `users.role` → `user_roles`
2. Migrar specialties de `users.specialty` → `specialties`

### Fase 3: Modificar tablas existentes
1. Modificar `users`: eliminar columnas `role`, `specialty`
2. Modificar `doctor_schedules`: eliminar `slot_duration`
3. Modificar `slots`: eliminar `doctor_id`, `slot_duration`
4. Modificar `appointments`: eliminar campos redundantes

### Fase 4: Actualizar código
1. Actualizar todos los models de Sequelize
2. Refactorizar middleware `verifyRole`
3. Actualizar services con JOINs necesarios
4. Actualizar types

---

## Archivos a Modificar/Crear

### Models
| Archivo | Acción |
|---------|--------|
| `models/User.ts` | Modificar - relaciones, quitar enums |
| `models/Role.ts` | **CREAR** |
| `models/UserRole.ts` | **CREAR** |
| `models/Specialty.ts` | **CREAR** |
| `models/DoctorSchedule.ts` | Modificar - quitar slot_duration |
| `models/Slot.ts` | Modificar - quitar doctor_id, slot_duration |
| `models/Appointment.ts` | Modificar - quitar campos redundantes |
| `models/MedicalRecord.ts` | Sin cambios |
| `models/MedicalRecordAnnexe.ts` | Sin cambios |

### Middlewares
| Archivo | Acción |
|---------|--------|
| `middlewares/verifyRole.ts` | Refactorizar a middleware genérico |
| `middlewares/verifyPatient.ts` | **ELIMINAR** |
| `middlewares/auth.ts` | Actualizar si referencia roles directamente |

### Services
| Archivo | Acción |
|---------|--------|
| `modules/slots/slots.service.ts` | Queries con JOIN para obtener doctor |
| `modules/schedules/schedules.service.ts` | Remover slot_duration en generación |
| `modules/appointments/appointments.service.ts` | JOIN para datos de paciente |
| `modules/auth/auth.service.ts` | Manejar asignación de roles |

### Types
| Archivo | Acción |
|---------|--------|
| `types/auth.types.ts` | Actualizar tipos de rol |
| `types/schedules.types.ts` | Remover slot_duration |
| `types/slots.types.ts` | Actualizar si es necesario |

---

## Queries de Ejemplo Post-Normalización

### Obtener slots disponibles de un doctor
```sql
SELECT s.*, u.full_name as doctor_name
FROM slots s
JOIN doctor_schedules ds ON s.schedule_id = ds.id
JOIN users u ON ds.doctor_id = u.id
WHERE ds.doctor_id = :doctorId
  AND s.is_available = true
  AND s.is_active = true;
```

### Obtener cita con datos del paciente
```sql
SELECT a.*, 
       u.full_name as patient_name,
       u.email as patient_email,
       s.start_time,
       s.end_time,
       s.date
FROM appointments a
JOIN users u ON a.patient_id = u.id
JOIN slots s ON a.slot_id = s.id
WHERE a.id = :appointmentId;
```

### Verificar rol de usuario
```sql
SELECT r.name 
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
WHERE ur.user_id = :userId;
```

---

## Notas Adicionales

1. **Duración fija de 60 minutos**: Hardcodear en la lógica de generación de slots en `schedules.service.ts`.

2. **Validación de horarios**: El sistema debe validar que un doctor no tenga overlapping schedules.

3. **Cache de Redis**: Actualizar invalidación de cache cuando se modifiquen las relaciones.

4. **Tests**: Después de la migración, ejecutar `npm run test:concurrency` para verificar que las citas aún funcionan correctamente.

---

## Regeneración Semanal de Slots

### Descripción del Problema

Actualmente, los slots se generan por 14 días al crear un schedule. Si un doctor tiene 12 slots disponibles y ocupa 7, cuando llega la semana siguiente debe volver a crear el schedule manualmente.

### Solución Propuesta

Regenerar slots automáticamente cada semana para la semana siguiente, permitiendo:
- Doctor define su horario (día + rango de horas) una vez
- Sistema regenera slots semanalmente
- Doctor puede editar el schedule para ajustar la semana siguiente sin afectar citas actuales

### Flujo de Regeneración

```
1. Ejecución: Cada domingo (o manualmente)
2. Para cada doctor con schedule activo:
   a. Obtener el schedule del doctor
   b. Para cada día configurado:
      - Generar slots para la semana siguiente (próximos 7 días)
      - OMITIR slots que ya tienen citas ocupadas
      - Mantener slots actuales intactos
3. Invalidar cache de slots
```

### Reglas de protección

| Escenario | Comportamiento |
|----------|----------------|
| Slot con cita confirmada/pendiente | No regenerar, mantener existente |
| Slot libre sin cita | Regenerar/crear nuevo |
| Doctor edita schedule | Solo aplicar a semana siguiente |

### Implementación

#### Opción A: Script CLI (recomendado)

Archivo: `backend/scripts/regenerate-slots.ts`

```typescript
import DoctorSchedule from "../src/models/DoctorSchedule";
import Slot from "../src/models/Slot";
import Appointment from "../src/models/Appointment";
import { Op } from "sequelize";
import { format, addDays, startOfDay, addMinutes } from "date-fns";

const DAYS_TO_GENERATE = 7;

export const regenerateWeeklySlots = async () => {
    const schedules = await DoctorSchedule.findAll({
        where: { is_active: true }
    });

    for (const schedule of schedules) {
        await generateNextWeekSlots(schedule);
    }
};

const generateNextWeekSlots = async (schedule: DoctorSchedule) => {
    const today = startOfDay(new Date());
    const dayName = schedule.day_of_week.toLowerCase();
    const [startH, startM] = schedule.start_time.split(':').map(Number);
    const [endH, endM] = schedule.end_time.split(':').map(Number);

    for (let i = 1; i <= DAYS_TO_GENERATE; i++) {
        const currentDay = addDays(today, i);
        const currentDayName = format(currentDay, 'EEEE').toLowerCase();

        if (currentDayName !== dayName) continue;

        const dateStr = format(currentDay, 'yyyy-MM-dd');

        // Obtener slots ocupados para esta fecha
        const occupiedSlots = await Slot.findAll({
            where: {
                schedule_id: schedule.id,
                date: dateStr,
                is_available: false,
                is_active: true
            }
        });

        // Solo generar slots si no hay citas ocupadas
        if (occupiedSlots.length === 0) {
            // Generar slots para este día
            let slotStart = addMinutes(startOfDay(currentDay), startH * 60 + startM);
            const dayEnd = addMinutes(startOfDay(currentDay), endH * 60 + endM);
            const SLOT_DURATION = 60;

            while (slotStart < dayEnd) {
                const slotEnd = addMinutes(slotStart, SLOT_DURATION);
                if (slotEnd <= dayEnd) {
                    await Slot.findOrCreate({
                        where: {
                            schedule_id: schedule.id,
                            date: dateStr,
                            start_time: slotStart
                        },
                        defaults: {
                            end_time: slotEnd,
                            is_available: true,
                            is_active: true
                        }
                    });
                }
                slotStart = slotEnd;
            }
        }
    }
};
```

#### Opción B: Endpoint API

`POST /api/slots/regenerate` - Regenerar slots para la próxima semana

#### Script npm

```json
// package.json
{
    "scripts": {
        "regenerate-slots": "ts-node backend/scripts/regenerate-slots.ts"
    }
}
```

### Integración con Cron (opcional)

```typescript
// backend/src/cron.ts
import cron from "node-cron";
import { regenerateWeeklySlots } from "./scripts/regenerate-slots";

// Ejecutar cada domingo a medianoche
cron.schedule("0 0 * * 0", async () => {
    console.log("Iniciando regeneración semanal de slots...");
    await regenerateWeeklySlots();
    console.log("Regeneración semanal completada");
});
```

### Caso de uso: Edición de Schedule

**Escenario:** Doctor tiene schedule Lun 9:00-12:00,-edita a Lun 14:00-17:00

**Flujo:**
1. Backend recibe PATCH `/api/schedules/:id` con nuevo rango
2. Validar que no haya citas ocupadas para el resto de la semana actual
3. Si hay citas → devolver error "Cancela las citas primero"
4. Si no hay citas → actualizar schedule
5. Regeneración automática ocurre para semana siguiente con nuevo rango

**Código existente** (ya implementado):
- `schedules.service.ts:159-195` ya valida citas ocupadas
- Solo regenera slots futuros (`date >= today`)

---

## Orden de Implementación Sugerido

### Fase 1: Normalización (sin cambios funcionales)
1. Crear models: `Role`, `UserRole`, `Specialty`
2. Modificar model: `User`
3. Modificar model: `DoctorSchedule`
4. Modificar model: `Slot`
5. Modificar model: `Appointment`
6. Refactorizar middleware: `verifyRole`
7. Actualizar services: `slots`, `schedules`, `appointments`, `auth`
8. Actualizar types
9. Probar endpoints
10. Ejecutar test de concurrencia

### Fase 2: Regeneración Semanal (nueva funcionalidad)
11. Crear script: `scripts/regenerate-slots.ts`
12. Agregar endpoint: `POST /api/slots/regenerate` (opcional)
13. Integrar con cron o crear script npm

### Fase 3: Frontend - Validación 30 minutos
14. Modificar `useAppointmentsMutations` para mostrar mensajes de error del backend
