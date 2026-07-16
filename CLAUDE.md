# AcaInfo Frontend

React 19 + TypeScript + Vite 6 · TanStack Query 5 · Zustand 5 · React Router 7 · Tailwind 4 · React Hook Form + Zod · axios. Submódulo git (remote: frenillazo/acainfo-front); tras commitear aquí, bumpear el puntero en el superproyecto.

**La app está CONSTRUIDA y en producción** (~45 rutas, área estudiante + panel admin completos). Este archivo describe el estado real, no un plan.

## Verificación

- `npx tsc --noEmit` — pasa. `strict: true` + noUnusedLocals/Parameters activos en tsconfig.app.json (15-jul-2026). Único flag relajado: `erasableSyntaxOnly: false` (hay enums TS en reservation.types; el de material murió con las carpetas, 15-jul-2026).
- `npm run build` (tsc -b && vite build) — pasa.
- `npm run lint` — **0 errores / 0 warnings** (baseline eliminado 13-jul-2026) y bloqueante en CI; mantenerlo a 0. Errores de API: helper `getApiErrorMessage` (`shared/utils/apiError.ts`), nada de `catch (err: any)`. En formularios RHF usar `useWatch`, no `watch()` (el plugin react-hooks lo marca como incompatible).
- `npm run test:run` — **91 tests** (vitest + testing-library sobre jsdom) que deben estar SIEMPRE en verde; CI los exige. Tests co-locados (`*.test.ts(x)` junto al código), **sin globals** (imports explícitos de vitest); setup en `src/test/setup.ts` (jest-dom + `afterEach(cleanup)` — obligatorio: sin globals testing-library no auto-limpia). jsdom 27 (Node local 22.23 desde 15-jul-2026, alineado con el CI; los formatters componen fecha+hora a mano porque el patrón de unión de Intl es-ES cambia entre versiones de ICU).
- Verificación manual: `npm run dev` contra el back en perfil dev (usuarios seed, contraseña "password"), probar como STUDENT y como ADMIN.

## Arquitectura real

- `src/app/` — router (`createBrowserRouter`, rutas lazy con helper `lazyPage()`) + providers (solo QueryProvider; auth vive en Zustand). Áreas: públicas, `/dashboard` (cualquier autenticado), `/admin` (rol ADMIN vía `ProtectedRoute`). No hay área TEACHER. **Todas las rutas cuelgan de una raíz `RootLayout`** (16-jul-2026) con `errorElement: <RouteErrorPage />` (detecta el fallo de chunk tras un deploy y ofrece recargar; sin él React Router pinta su pantalla en inglés — y el `ErrorBoundary` de `App.tsx` NO lo captura: los data routers interceptan antes) y `HydrateFallback: LoadingScreen` (sin él, un F5 en una ruta lazy deja la pantalla en blanco). `RootLayout` fija el `document.title` por ruta (`useDocumentTitle`, tabla de patrones) y pinta la barra de progreso con `useNavigation()`.
- `src/features/{auth,student,enrollments,sessions,reservations,materials,subjects,landing,legal,admin}` — cada una con pages/components/hooks/services/types. `admin/` tiene sub-features por dominio (courses, enrollments, schedules, sessions, subjects, teachers, users + página Demanda).
- `src/shared/` — **UI kit PROPIO** en `components/ui` (Button, Modal, DataTable, ConfigBadge…). NO es shadcn: **no ejecutar `npx shadcn add`** (components.json es un resto engañoso). `services/apiClient.ts` (axios `withCredentials` + Bearer del access token del store + refresh automático en 401 vía cookie httpOnly, con cola single-flight; el refresh token NO vive en JS), `config/badgeConfig.ts` + `domainConstants.ts`, `utils/`.
- Estado global (Zustand): solo `authStore` (persist en localStorage) y toasts.

## Patrones

- Services: objeto `xxxApi` usando `apiClient` — la baseURL YA incluye `/api`, las rutas de los servicios NO llevan ese prefijo.
- Hooks: `useXxx` (queries) / `useXxxMutations` / `useEnrichedXxx` (agregación). `sessions`, `reservations` y `materials` usan key factories exportadas (`sessionKeys`, `reservationKeys`, `materialKeys`); el resto, arrays inline.
- Estado visual de sesiones: SIEMPRE `getVisualSessionStatus()` (`shared/utils/sessionStatus.ts`), nunca `session.status` directo (el back no transiciona estados automáticamente).
- Formularios: RHF + zodResolver. Badges: `ConfigBadge` + `badgeConfig.ts`.
- **Diálogos** (16-jul-2026): `Modal`, `ConfirmDialog` y `PromptDialog` comparten `useFocusTrap` (foco dentro al abrir, Tab reciclado, foco de vuelta al disparador al cerrar) y cierran con Escape. Un diálogo nuevo debe usar el `Modal` base, no montar el suyo a mano.
- **Estado que depende del viewport**: resolverlo con clases (`invisible lg:visible` saca del orden de tabulación sin JS), NO con `matchMedia`. El sidebar lo hacía con un hook y un evento `change` perdido dejaba el menú inservible en escritorio. `useMediaQuery` (useSyncExternalStore) queda solo para lo que las clases no pueden: parar el carrusel con `prefers-reduced-motion`.
- **Errores de mutación** (16-jul-2026): el `MutationCache` de `QueryProvider` tiene un `onError` global que saca un toast con `getApiErrorMessage` — red de seguridad para que ninguna mutación falle en silencio. Si el componente YA pinta el error en contexto (banner del formulario o del modal), marcar la mutación con `meta: { silentError: true }` para no decir lo mismo dos veces. El interceptor de `apiClient` NO refresca en 401 de `/auth/login|register|refresh`: ahí el 401 es la respuesta legítima del back y debe llegar al formulario.
- La feature `materials` usa TanStack Query desde el 14-jul-2026 (`useMaterialsList/BySubject/Recent` + `useMaterialMutations`; las mutaciones invalidan `materialKeys.all` — nada de recargas manuales).
- **Carpetas de materiales** (15-jul-2026, sustituyen a las categorías): `materialFolderKeys` + `useMaterialFolders.ts` (query + mutaciones que invalidan carpetas Y materiales), `MaterialsGroupedByFolder` (carpetas por `position` + pseudo-grupo "Sin carpeta"; `showEmptyFolders` solo admin), `FolderSelector` en el upload y `MaterialFolderManager` en `AdminSubjectDetailPage`. Mover a raíz en el PATCH = `clearFolder: true` (null en `folderId` es "no cambiar").
- **Generador IA** (15-jul-2026): `useAiJob` en `useMaterialAi.ts` es el ÚNICO polling del codebase (`refetchInterval` 3s + corte a 10 min + `refetchIntervalInBackground: true` — sin esto TanStack pausa el polling con la pestaña oculta y el toast/invalidación no llegan). Al COMPLETED invalida `materialKeys.all` y toast; relanzar = job NUEVO re-enviando la petición (no hay retry server-side). Multi-upload: `MultiFileUpload` de shared (el `FileUpload` mono-archivo sigue intacto).

## Trampas

- **Tipos espejo del back copiados a mano**: la referencia fiable son los DTOs Java (`back/.../infrastructure/adapter/in/rest/dto/`). Al tocar un DTO en el back, actualizar su copia TS.
- Migración curso unificado APLICADA (11-jul-2026): admin de "Cursos" (capacity vacío = ilimitado/virtual, precio/mes), "me interesa" vía `useSubjectInterest` (`/subjects/{id}/interest`), página admin Demanda. Ya NO existen payments, group-requests, intensives, asistencia ni online-requests — no reintroducirlos.
- `.env` → `http://localhost:8080/api`; `.env.production` → `/api` relativo (proxy nginx en el servidor).
- El único doc por feature es `features/auth/README.md`. La carpeta `docs/` se borró el 13-jul-2026 y `features/reservations/README.md` el 15-jul-2026, ambos por desfasados (el de reservations documentaba asistencia y online-requests, eliminados en la migración); la referencia de API es el back (DTOs Java + Swagger).
