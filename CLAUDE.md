# AcaInfo Frontend

React 19 + TypeScript + Vite 6 · TanStack Query 5 · Zustand 5 · React Router 7 · Tailwind 4 · React Hook Form + Zod · axios. Submódulo git (remote: frenillazo/acainfo-front); tras commitear aquí, bumpear el puntero en el superproyecto.

**La app está CONSTRUIDA y en producción** (~45 rutas, área estudiante + panel admin completos). Este archivo describe el estado real, no un plan.

## Verificación

- `npx tsc --noEmit` — pasa. OJO: `strict: false` en tsconfig.app.json (relajación temporal que se quedó); escribir código nuevo strict-clean.
- `npm run build` (tsc -b && vite build) — pasa.
- `npm run lint` — **0 errores / 0 warnings** (baseline eliminado 13-jul-2026) y bloqueante en CI; mantenerlo a 0. Errores de API: helper `getApiErrorMessage` (`shared/utils/apiError.ts`), nada de `catch (err: any)`. En formularios RHF usar `useWatch`, no `watch()` (el plugin react-hooks lo marca como incompatible).
- `npm run test:run` — **18 tests** (vitest + testing-library sobre jsdom) que deben estar SIEMPRE en verde; CI los exige. Tests co-locados (`*.test.ts(x)` junto al código), **sin globals** (imports explícitos de vitest); setup en `src/test/setup.ts` (jest-dom + `afterEach(cleanup)` — obligatorio: sin globals testing-library no auto-limpia). OJO: jsdom fijado a **26** (la 27 exige Node ≥ 22.12 y el local va en 22.11).
- Verificación manual: `npm run dev` contra el back en perfil dev (usuarios seed, contraseña "password"), probar como STUDENT y como ADMIN.

## Arquitectura real

- `src/app/` — router (`createBrowserRouter`, rutas lazy con helper `lazyPage()`) + providers (solo QueryProvider; auth vive en Zustand). Áreas: públicas, `/dashboard` (cualquier autenticado), `/admin` (rol ADMIN vía `ProtectedRoute`). No hay área TEACHER.
- `src/features/{auth,student,enrollments,sessions,reservations,materials,subjects,landing,legal,admin}` — cada una con pages/components/hooks/services/types. `admin/` tiene sub-features por dominio (courses, enrollments, schedules, sessions, subjects, teachers, users + página Demanda).
- `src/shared/` — **UI kit PROPIO** en `components/ui` (Button, Modal, DataTable, ConfigBadge…). NO es shadcn: **no ejecutar `npx shadcn add`** (components.json es un resto engañoso). `services/apiClient.ts` (axios + Bearer desde localStorage + refresh automático en 401), `config/badgeConfig.ts` + `domainConstants.ts`, `utils/`.
- Estado global (Zustand): solo `authStore` (persist en localStorage) y toasts.

## Patrones

- Services: objeto `xxxApi` usando `apiClient` — la baseURL YA incluye `/api`, las rutas de los servicios NO llevan ese prefijo.
- Hooks: `useXxx` (queries) / `useXxxMutations` / `useEnrichedXxx` (agregación). `sessions` y `reservations` usan key factories exportadas (`sessionKeys`, `reservationKeys`); el resto, arrays inline.
- Estado visual de sesiones: SIEMPRE `getVisualSessionStatus()` (`shared/utils/sessionStatus.ts`), nunca `session.status` directo (el back no transiciona estados automáticamente).
- Formularios: RHF + zodResolver. Badges: `ConfigBadge` + `badgeConfig.ts`.
- Excepción heredada: la feature `materials` usa hooks imperativos con useState (sin TanStack Query) — migrar a Query cuando se toque.

## Trampas

- **Tipos espejo del back copiados a mano**: la referencia fiable son los DTOs Java (`back/.../infrastructure/adapter/in/rest/dto/`). Al tocar un DTO en el back, actualizar su copia TS.
- Migración curso unificado APLICADA (11-jul-2026): admin de "Cursos" (capacity vacío = ilimitado/virtual, precio/mes), "me interesa" vía `useSubjectInterest` (`/subjects/{id}/interest`), página admin Demanda. Ya NO existen payments, group-requests, intensives, asistencia ni online-requests — no reintroducirlos.
- `.env` → `http://localhost:8080/api`; `.env.production` → `/api` relativo (proxy nginx en el servidor).
- Los docs útiles por feature: `features/auth/README.md` y `features/reservations/README.md`. La carpeta `docs/` (API_INTEGRACION, ESTRUCTURA_FRONTEND) se borró el 13-jul-2026 por desfasada; la referencia de API es el back (DTOs Java + Swagger).
