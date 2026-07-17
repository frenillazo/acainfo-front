# AcaInfo Frontend

React 19 + TypeScript + Vite 6 · TanStack Query 5 · Zustand 5 · React Router 7 · Tailwind 4 · React Hook Form + Zod · axios. Submódulo git (remote: frenillazo/acainfo-front); tras commitear aquí, bumpear el puntero en el superproyecto.

**La app está CONSTRUIDA y en producción** (~45 rutas, área estudiante + panel admin completos). Este archivo describe el estado real, no un plan.

## Verificación

- **Typecheck: `npx tsc -b`** (NO `npx tsc --noEmit`). ⚠️ **`tsc --noEmit` NO COMPRUEBA NADA** y siempre pasa: el `tsconfig.json` raíz es solo un fichero de referencias (`"files": []`), así que sin `-b` no entra en `tsconfig.app.json`. Verificado el 16-jul-2026 metiendo un error a propósito: `--noEmit` no lo vio y `-b` sí. `strict: true` + noUnusedLocals/Parameters activos en tsconfig.app.json (15-jul-2026). Único flag relajado: `erasableSyntaxOnly: false` (hay enums TS en reservation.types; el de material murió con las carpetas, 15-jul-2026).
- `npm run build` (tsc -b && vite build) — pasa.
- `npm run lint` — **0 errores / 0 warnings** (baseline eliminado 13-jul-2026) y bloqueante en CI; mantenerlo a 0. Errores de API: helper `getApiErrorMessage` (`shared/utils/apiError.ts`), nada de `catch (err: any)`. En formularios RHF usar `useWatch`, no `watch()` (el plugin react-hooks lo marca como incompatible).
- `npm run test:run` — **100 tests** (vitest + testing-library sobre jsdom) que deben estar SIEMPRE en verde; CI los exige. Tests co-locados (`*.test.ts(x)` junto al código), **sin globals** (imports explícitos de vitest); setup en `src/test/setup.ts` (jest-dom + `afterEach(cleanup)` — obligatorio: sin globals testing-library no auto-limpia — + `configure({ asyncUtilTimeout: 5000 })`). **El techo de `findBy*`/`waitFor` sube a 5 s a propósito** (17-jul-2026): el defecto de 1 s no daba para que TanStack Query resolviera y repintara con 19 ficheros en paralelo y la CPU saturada, y los tests fallaban sin que nada estuviera roto (reproducido 4/4 metiendo carga; con 5 s, 4/4 en verde). No es un retardo — son MutationObserver y resuelven en cuanto aparece el nodo, así que la suite no tarda más (~23 s). El `testTimeout: 15000` de `vite.config.ts` va deliberadamente por encima: si un `findBy*` agota la espera debe ganar el error de testing-library (dice qué no encontró y vuelca el DOM), no el "test timed out" de vitest. jsdom 27 (Node local 22.23 desde 15-jul-2026, alineado con el CI; los formatters componen fecha+hora a mano porque el patrón de unión de Intl es-ES cambia entre versiones de ICU).
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
- **Usa el kit, no lo redibujes**: `<Card>` (47 ficheros) y `<PageHeader>` (22) son el sistema. La
  **migración está COMPLETA** (17-jul-2026, 5 tandas por área, cada una verificada entera contra la
  versión anterior en el navegador). Ya no hay Cards a mano salvo **4 excepciones, todas comentadas EN
  el código** con su porqué — si te topas con una, léelo antes de "arreglarla":
  - `SessionContextMenu`: es un desplegable (`shadow-lg`), no una tarjeta.
  - El `<form>` de `AdminMaterialGeneratePage`: el form ES la tarjeta y `Card` solo puede ser
    `div`/`article`/`section`.
  - Los *segmented control* `p-1` de `AdminSessionsPage` y `SessionsPage`: comparten prefijo de clases
    por casualidad.
  - Cabeceras que NO van a `PageHeader`: las de **detalle** (avatar a la izquierda, `items-start`,
    subtítulo sin `mt-1 text-sm`, 2-3 acciones) y las **responsive** de `AdminSessionsPage` y
    `SessionsPage` (`flex-col` + `sm:flex-row`: apilan las acciones en móvil y `PageHeader` siempre las
    pone en fila — migrarlas rompe el móvil sin que tests ni typecheck lo vean). Y la de
    `AdminDashboardPage`, cuyo subtítulo va a 16px (sin `text-sm`): migrarla lo encogería.
- **Al añadir una página nueva**: `<PageHeader title subtitle actions>` + `<Card>`. Equivalencias de
  padding: `p-6` → `<Card>` (por defecto), `p-4` → `padding="sm"`, `p-8` → `"lg"`, sin padding →
  `"none"`. El resto de clases van en `className` (`twMerge` las fusiona con las del `cva`). Sin
  `actions`, `PageHeader` NO monta el flex, a propósito (una cabecera suelta no debe cambiar de
  layout). `PageHeader` pinta el `h1` + un `<p className="mt-1 text-sm text-gray-500">`; `subtitle` y
  `actions` son `ReactNode`, así que admiten JSX (`AdminEnrollmentsPage` mete un botón en el subtítulo).
  Si tus acciones no usan `gap-3`, pasa tu propio wrapper como hijo único (lo hace `AdminUsersPage`,
  que va con `gap-2`).
- **Diálogos** (16-jul-2026): `Modal`, `ConfirmDialog` y `PromptDialog` comparten `useFocusTrap` (foco dentro al abrir, Tab reciclado, foco de vuelta al disparador al cerrar) y cierran con Escape. Un diálogo nuevo debe usar el `Modal` base, no montar el suyo a mano.
- **Estado que depende del viewport**: resolverlo con clases (`invisible lg:visible` saca del orden de tabulación sin JS), NO con `matchMedia`. El sidebar lo hacía con un hook y un evento `change` perdido dejaba el menú inservible en escritorio. `useMediaQuery` (useSyncExternalStore) queda solo para lo que las clases no pueden: parar el carrusel con `prefers-reduced-motion`.
- **Errores de mutación** (16-jul-2026): el `MutationCache` de `QueryProvider` tiene un `onError` global que saca un toast con `getApiErrorMessage` — red de seguridad para que ninguna mutación falle en silencio. Si el componente YA pinta el error en contexto (banner del formulario o del modal), marcar la mutación con `meta: { silentError: true }` para no decir lo mismo dos veces. El interceptor de `apiClient` NO refresca en 401 de `/auth/login|register|refresh`: ahí el 401 es la respuesta legítima del back y debe llegar al formulario.
- La feature `materials` usa TanStack Query desde el 14-jul-2026 (`useMaterialsList/BySubject/Recent` + `useMaterialMutations`; las mutaciones invalidan `materialKeys.all` — nada de recargas manuales).
- **Listas paginadas**: `placeholderData: keepPreviousData` en la query (las 6 de admin + subjects ya lo tienen) y filtros en la URL con `useUrlFilters` — nunca `useState` para un filtro, o se pierde al volver de un detalle o con F5. Buscadores: `useDebounce` y NO hacer early-return con spinner de toda la página (desmonta el propio input y le roba el foco al que escribe).
- **Materiales del alumno**: solo la inscripción **ACTIVA** da acceso (el back devuelve 403 a las demás) y solo se ve el **curso académico actual** (corte sep→ago). Donde no haya acceso, `MaterialsLocked` con el motivo; donde no haya material del año, `NoMaterialsYet` (nombra el curso: si no, en septiembre el material "desaparece" sin explicación).
- **Carpetas de materiales** (15-jul-2026, sustituyen a las categorías): `materialFolderKeys` + `useMaterialFolders.ts` (query + mutaciones que invalidan carpetas Y materiales), `MaterialsGroupedByFolder` (carpetas por `position` + pseudo-grupo "Sin carpeta"; `showEmptyFolders` solo admin), `FolderSelector` en el upload y `MaterialFolderManager` en `AdminSubjectDetailPage`. Mover a raíz en el PATCH = `clearFolder: true` (null en `folderId` es "no cambiar").
- **Generador IA** (15-jul-2026): `useAiJob` en `useMaterialAi.ts` es el ÚNICO polling del codebase (`refetchInterval` 3s + corte a 10 min + `refetchIntervalInBackground: true` — sin esto TanStack pausa el polling con la pestaña oculta y el toast/invalidación no llegan). Al COMPLETED invalida `materialKeys.all` y toast; relanzar = job NUEVO re-enviando la petición (no hay retry server-side). Multi-upload: `MultiFileUpload` de shared (el `FileUpload` mono-archivo sigue intacto).

## Trampas

- **Lo que exporta un barrel de feature SE ENVÍA, lo use alguien o no.** El router hace
  `lazyPage(() => import('@/features/enrollments'), 'EnrollmentsPage')`: importa el **módulo entero** y
  saca el componente por nombre, así que Rollup no puede demostrar qué exports sobran y se los traga
  todos al chunk. Comprobado el 17-jul-2026: `EnrollmentListItem` llevaba muerto (nadie lo importaba,
  solo el barrel lo re-exportaba) y aun así viajaba a los usuarios; borrarlo quitó **554 bytes** del
  chunk de `/dashboard/enrollments` (11904 → 11350). O sea: un `export` de más en `features/*/index.ts`
  no es solo desorden, son bytes que bajan los 121 usuarios. Ojo también al buscar código muerto:
  `grep "from '@/features/x'"` **no ve** los `import()` dinámicos del router.
- **Tipos espejo del back copiados a mano**: la referencia fiable son los DTOs Java (`back/.../infrastructure/adapter/in/rest/dto/`). Al tocar un DTO en el back, actualizar su copia TS.
- Migración curso unificado APLICADA (11-jul-2026): admin de "Cursos" (capacity vacío = ilimitado/virtual, precio/mes), "me interesa" vía `useSubjectInterest` (`/subjects/{id}/interest`), página admin Demanda. Ya NO existen payments, group-requests, intensives, asistencia ni online-requests — no reintroducirlos.
- `.env` → `http://localhost:8080/api`; `.env.production` → `/api` relativo (proxy nginx en el servidor).
- El único doc por feature es `features/auth/README.md`. La carpeta `docs/` se borró el 13-jul-2026 y `features/reservations/README.md` el 15-jul-2026, ambos por desfasados (el de reservations documentaba asistencia y online-requests, eliminados en la migración); la referencia de API es el back (DTOs Java + Swagger).
