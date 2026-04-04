# AGENTS.md - Project Guidelines for AI Agents

## Project Overview

Full-stack medical appointment scheduling system:
- **Backend**: Express + TypeScript + PostgreSQL + Redis
- **Frontend**: React + TypeScript + Vite + TailwindCSS

---

## Commands

### Backend
```bash
cd backend
npm run dev              # Start dev server (nodemon)
npm run dev:api          # Start with --api flag
npm run test:concurrency # Run concurrency test script
# No unit test framework configured
```

### Frontend
```bash
cd frontend
npm run dev              # Start Vite dev server
npm run build            # Production build (tsc + vite)
npm run lint             # Run ESLint
npm run lint -- --fix    # Auto-fix lint issues
npm run preview          # Preview production build
```

---

## Backend Code Style

### File Organization
```
src/
├── config/           # DB, Redis, Redlock, Nodemailer configs
├── middlewares/      # Auth, validation, role verification
├── models/           # Sequelize models (User, Slot, Appointment)
├── modules/          # Feature modules (auth, appointments, slots, schedules)
│   └── [module]/
│       ├── [module].controller.ts
│       ├── [module].service.ts
│       └── [module].routes.ts
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (jwt, bcrypt, date formatting)
└── server.ts         # Express app setup
```

### Imports
Group imports: external libs → internal modules → types. Use named exports:
```typescript
import { Request, Response } from "express";
import * as appointmentService from "./appointments.service";
import type { LoginData } from "../../types/auth.types";
```

### Naming Conventions
- Files: `camelCase` (e.g., `auth.service.ts`)
- Functions/Variables: `camelCase` (e.g., `getAvailableSlots`)
- Classes/Types: `PascalCase` (e.g., `User`, `AppointmentModel`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`)
- Enums: `PascalCase` values (e.g., `UserRole.PATIENT`)

### TypeScript Guidelines
- Enable strict mode (tsconfig.json)
- Always type parameters and return types
- Use `interface` for object shapes, `type` for unions/aliases
- Avoid `any` - use `unknown` when type is unknown

### Error Handling Pattern
Services throw error objects, controllers catch and respond:
```typescript
// Service
if (!slot) throw { status: 404, message: "El bloque no existe" };

// Controller
export const getSlot = async (req, res) => {
    try {
        const result = await slotService.getSlot(...);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        res.status(500).json({ message: error.message });
    }
};
```

### Sequelize Models
Use decorators:
```typescript
@Table({ tableName: 'users' })
export default class User extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
    declare id: string;
}
```

---

## Frontend Code Style

### File Organization
```
src/
├── api/              # Axios instance
├── components/      # React components (auth/, dashboard/, shared/)
├── constants/       # App constants
├── data/            # Static data (specialties, etc.)
├── hooks/           # Custom React hooks
├── layouts/         # Layout components
├── pages/           # Page components (auth/, dashboard/)
├── routes/          # Router configuration
├── services/        # API service functions
├── types/           # TypeScript types
└── utils/           # Utility functions
```

### Component Structure
- Use default exports
- PascalCase component names
- Type props with interfaces

```typescript
interface LoginFormProps {
    onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
    return <form>...</form>;
}
```

### React Query / TanStack Query
- `useMutation` for mutations
- `useQuery` for fetching

### Form Handling
Use `react-hook-form` with TypeScript:
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
```

### TailwindCSS
- Use utility classes
- `emerald-` primary color theme

---

## API Structure

All routes prefixed with `/api/`:
- `/api/auth` - Authentication
- `/api/appointments` - Appointment management
- `/api/slots` - Slot management
- `/api/schedules` - Doctor schedules

JWT in `Authorization: Bearer <token>` header.

---

## Database

- PostgreSQL + Sequelize ORM
- Redis for caching (slots, schedules)
- Redlock for distributed locking (appointment concurrency)

---

## General Guidelines

1. Avoid `any` - use proper TypeScript types
2. Handle errors consistently with the defined pattern
3. Use meaningful variable/function names
4. Keep functions small and focused
5. User-facing messages in Spanish
6. Test concurrency when modifying appointment creation
7. Invalidate Redis cache when slots/schedules change
