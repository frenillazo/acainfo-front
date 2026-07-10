# AcaInfo Frontend

React 19 + TypeScript + Vite 6 · TanStack Query 5 · Zustand 5 · React Router 7 · Tailwind 4 · React Hook Form + Zod · axios. Submódulo git (remote: frenillazo/acainfo-front); tras commitear aquí, bumpear el puntero en el superproyecto.

**La app está CONSTRUIDA y en producción** (~45 rutas, área estudiante + panel admin completos). Este archivo describe el estado real, no un plan.

## Verificación

- `npx tsc --noEmit` — pasa. OJO: `strict: false` en tsconfig.app.json (relajación temporal que se quedó); escribir código nuevo strict-clean.
- `npm run build` (tsc -b && vite build) — pasa.
- `npm run lint` — baseline heredado: **55 errores / 11 warnings**; no introducir nuevos.
- Sin tests aún. Verificación manual: `npm run dev` contra el back en perfil dev (usuarios seed, contraseña "password"), probar como STUDENT y como ADMIN.

## Arquitectura real

- `src/app/` — router (`createBrowserRouter`, rutas lazy con helper `lazyPage()`) + providers (solo QueryProvider; auth vive en Zustand). Áreas: públicas, `/dashboard` (cualquier autenticado), `/admin` (rol ADMIN vía `ProtectedRoute`). No hay área TEACHER.
- `src/features/{auth,student,enrollments,sessions,reservations,payments,materials,subjects,group-requests,landing,legal,admin}` — cada una con pages/components/hooks/services/types. `admin/` tiene sub-features por dominio.
- `src/shared/` — **UI kit PROPIO** en `components/ui` (Button, Modal, DataTable, ConfigBadge…). NO es shadcn: **no ejecutar `npx shadcn add`** (components.json es un resto engañoso). `services/apiClient.ts` (axios + Bearer desde localStorage + refresh automático en 401), `config/badgeConfig.ts` + `domainConstants.ts`, `utils/`.
- Estado global (Zustand): solo `authStore` (persist en localStorage) y toasts.

## Patrones

- Services: objeto `xxxApi` usando `apiClient` — la baseURL YA incluye `/api`, las rutas de los servicios NO llevan ese prefijo.
- Hooks: `useXxx` (queries) / `useXxxMutations` / `useEnrichedXxx` (agregación). `sessions` y `reservations` usan key factories exportadas (`sessionKeys`, `reservationKeys`); el resto, arrays inline.
- Estado visual de sesiones: SIEMPRE `getVisualSessionStatus()` (`shared/utils/sessionStatus.ts`), nunca `session.status` directo (el back no transiciona estados automáticamente).
- Formularios: RHF + zodResolver. Badges: `ConfigBadge` + `badgeConfig.ts`.
- Excepción heredada: la feature `materials` usa hooks imperativos con useState (sin TanStack Query) — migrar a Query cuando se toque.

## Trampas

- **Tipos espejo del back duplicados y con deriva**: `Degree` ×4 (uno obsoleto GRADO/MASTER), `Session` ×2, `Classroom` ×3 (el de session.types.ts tiene aulas fantasma). La referencia fiable son los DTOs Java (`back/.../infrastructure/adapter/in/rest/dto/`). `admin/types/admin.types.ts` marca con @deprecated lo eliminado del back.
- `groupType` YA NO EXISTE en el backend; varios componentes aún lo tipan/renderizan (bug conocido: rompe el botón "Solicitar online").
- **OBSOLETO — no invertir** (se eliminará en la simplificación): `features/group-requests` (el flujo estudiante ya está huérfano, sin rutas), el flujo de pago del alumno (botón "Pagar" es un no-op deliberado), `features/profile/` (esqueleto vacío; el perfil real vive en `features/auth`).
- `.env` → `http://localhost:8080/api`; `.env.production` → `/api` relativo (proxy nginx en el servidor).
- Los docs útiles por feature: `features/auth/README.md` y `features/reservations/README.md`. `docs/API_INTEGRACION.md` y `docs/ESTRUCTURA_FRONTEND.md` están desfasados.
