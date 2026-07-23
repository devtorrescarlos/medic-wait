# MedicWait

Plataforma web full-stack para la gestión y agendamiento de citas médicas. Permite a los pacientes buscar doctores, reservar turnos disponibles y gestionar su historial clínico, mientras que los doctores administran sus horarios, slots y expedientes médicos con asistencia de IA.

> **Estado del proyecto:** En desarrollo

---

## Tabla de contenidos

- [Características principales](#características-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Uso básico](#uso-básico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [API REST](#api-rest)
- [Deuda técnica](#deuda-técnica)
- [Contribuciones](#contribuciones)
- [Autor](#autor)
- [Licencia](#licencia)

---

## Características principales

- **Autenticación completa:** Registro, login, confirmación de cuenta por email, recuperación de contraseña y JWT-based auth.
- **Gestión de horarios y slots:** Los doctores crean horarios recurrentes con generación automática de slots disponibles.
- **Reserva de citas:** Los pacientes buscan doctores por especialidad y reservan turnos en tiempo real.
- **Concurrencia segura:** Bloqueo distribuido con Redlock + Redis para prevenir doble agendamiento en alta concurrencia.
- **Expedientes médicos:** Creación de historiales clínicos y anexos (evolución, resultados de laboratorio, correcciones).
- **Asistencia de IA:** Generación asistida de expedientes médicos mediante OpenRouter API.
- **Notificaciones en tiempo real:** Sistema de notificaciones push vía WebSockets.
- **Panel dual:** Dashboards separados para pacientes y doctores con vistas específicas.
- **Rate limiting:** Protección contra abuso en endpoints de autenticación.

---

## Stack tecnológico

| Capa                | Tecnologías                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------- |
| **Frontend**        | React 19, TypeScript, Vite, TailwindCSS 4, React Router, TanStack Query, React Hook Form |
| **Backend**         | Express 5, TypeScript, Sequelize ORM, Node.js                                            |
| **Base de datos**   | PostgreSQL 16, Redis 7                                                                   |
| **Infraestructura** | Docker, Docker Compose                                                                   |
| **Seguridad**       | JWT, bcrypt, express-rate-limit, CORS                                                    |
| **Comunicación**    | WebSockets (ws), Nodemailer                                                              |
| **Distribuido**     | Redlock (bloqueo distribuido)                                                            |
| **IA**              | OpenRouter API                                                                           |

---

## Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- [Docker](https://www.docker.com/) y Docker Compose
- npm o yarn

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/medic-wait.git
cd medic-wait
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales (ver [Variables de entorno](#variables-de-entorno)).

### 3. Levantar servicios base

```bash
docker-compose up -d
```

Esto inicia PostgreSQL y Redis en contenedores Docker.

### 4. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 5. Ejecutar migraciones

```bash
npm run migrate
```

### 6. (Opcional) Cargar datos de prueba

```bash
npm run seed
```

### 7. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

---

## Variables de entorno

| Variable              | Descripción                             |
| --------------------- | --------------------------------------- |
| `PORT`                | Puerto del servidor backend             |
| `POSTGRES_USER`       | Usuario de PostgreSQL                   |
| `POSTGRES_PASSWORD`   | Contraseña de PostgreSQL                |
| `POSTGRES_DB`         | Nombre de la base de datos              |
| `POSTGRES_PORT`       | Puerto de PostgreSQL                    |
| `POSTGRES_HOST`       | Host de PostgreSQL                      |
| `EMAIL_HOST`          | Servidor SMTP para envío de correos     |
| `EMAIL_USER`          | Usuario del correo                      |
| `EMAIL_PASS`          | Contraseña del correo                   |
| `EMAIL_PORT`          | Puerto del servidor SMTP                |
| `SUPER_SECRET`        | Secreto para firmar JWT de sesión       |
| `VERIFICATION_SECRET` | Secreto para firmar JWT de verificación |
| `CLIENT_URL`          | URL del frontend (para CORS)            |
| `OPEN_ROUTER_KEY`     | API key de OpenRouter                   |
| `OPEN_ROUTER_MODEL`   | Modelo de IA a utilizar                 |

---

## Uso básico

### Iniciar el backend (desarrollo)

```bash
cd backend
npm run dev
```

El servidor arranca en `http://localhost:<PORT>` con nodemon (hot-reload).

### Iniciar el frontend (desarrollo)

```bash
cd frontend
npm run dev
```

Vite sirve la app en `http://localhost:5173`.

### Construir para producción

```bash
cd frontend
npm run build
```

---

## Estructura del proyecto

```
medic-wait/
├── backend/
│   └── src/
│       ├── config/              # DB, Redis, Redlock, Nodemailer
│       ├── middlewares/          # Auth, validación, roles
│       ├── models/              # Sequelize models (10 modelos)
│       ├── modules/
│       │   ├── auth/            # Autenticación y registro
│       │   ├── appointments/    # Gestión de citas
│       │   ├── slots/           # Bloques de tiempo
│       │   ├── schedules/       # Horarios del doctor
│       │   ├── doctors/         # Listado de doctores
│       │   ├── notifications/   # Notificaciones
│       │   └── medical-records/ # Expedientes + IA
│       ├── types/               # Definiciones TypeScript
│       ├── utils/               # Utilidades (jwt, bcrypt, fechas)
│       └── server.ts            # Setup de Express
├── frontend/
│   └── src/
│       ├── api/                 # Instancia Axios
│       ├── components/          # Componentes React (50+)
│       ├── hooks/               # Custom hooks
│       ├── layouts/             # Layouts de página
│       ├── pages/               # Páginas (31 rutas)
│       ├── routes/              # Configuración de rutas
│       ├── services/            # Funciones de llamada a API
│       ├── types/               # Tipos TypeScript
│       └── utils/               # Utilidades
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## API REST

Todos los endpoints están prefijados con `/api/`. JWT se envía via header `Authorization: Bearer <token>`.

| Módulo              | Endpoints | Descripción                                                 |
| ------------------- | --------- | ----------------------------------------------------------- |
| **Auth**            | 9         | Registro, login, confirmación, recuperación, especialidades |
| **Appointments**    | 6         | Crear, cancelar, completar, confirmar, listar               |
| **Slots**           | 4         | CRUD de bloques de tiempo                                   |
| **Schedules**       | 6         | CRUD de horarios + toggle activo/inactivo                   |
| **Doctors**         | 2         | Listado y detalle de doctores                               |
| **Notifications**   | 5         | CRUD de notificaciones + conteo no leídas                   |
| **Medical Records** | 7         | CRUD de expedientes y anexos + generación IA                |

---

## Deuda técnica

- [ ] Configurar framework de testing (Jest/Vitest) y cubrir servicios críticos
- [✓] Implementar migraciones automáticas en el arranque del contenedor
- [ ] Centralizar manejo de errores con middleware global
- [✓] Implementar refresh tokens para mejorar seguridad de sesiones
- [ ] Agregar paginación server-side en todos los endpoints de listado
- [ ] Agregar tests de integración para concurrencia de citas
- [✓] Agregar cola de tareas para limpieza de slots no agendados
- [ ] Agregar ZOD para validación de datos

---

## Contribuciones

Las contribuciones son bienvenidas. Por favor, consulta la guía de contribución del proyecto antes de abrir un PR.

1. Hacer fork del repositorio
2. Crear una rama para la feature (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commit de los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

---

## Autor

**Carlos Torres** - Desarrollador Full Stack

[GitHub](https://github.com/tu-usuario)
