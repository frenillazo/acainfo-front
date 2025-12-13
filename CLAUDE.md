# AcaInfo Frontend - Plan de Desarrollo

## Stack Tecnológico
- React 19 + TypeScript + Vite
- TanStack Query (data fetching/cache)
- Zustand (estado global)
- React Router DOM (routing)
- Axios (HTTP client)
- Tailwind CSS + shadcn/ui (UI)
- React Hook Form + Zod (formularios)
- date-fns (fechas)

## Arquitectura
Feature-based: `src/features/{feature}/` con components, hooks, services, types, pages.

## Fases de Desarrollo

### Fase 1: Fundamentos
1. **Setup proyecto**
   - Instalar dependencias (react-router-dom, @tanstack/react-query, zustand, axios, tailwindcss, etc.)
   - Configurar alias `@/` en vite.config.ts y tsconfig
   - Crear estructura de carpetas (app/, features/, shared/, assets/)
   - Configurar Tailwind CSS

2. **Shared base**
   - `shared/config/env.ts` - Variables de entorno
   - `shared/services/apiClient.ts` - Axios con interceptores (auth, refresh token)
   - `shared/types/api.types.ts` - PageResponse, ApiError
   - `shared/utils/formatters.ts` - Fechas, moneda

3. **Providers**
   - `app/providers/QueryProvider.tsx` - TanStack Query
   - `app/providers/AuthProvider.tsx` - Contexto auth (opcional, Zustand puede bastar)
   - `app/providers/index.tsx` - Composición de providers

### Fase 2: Autenticación
1. **Auth types** - `features/auth/types/auth.types.ts`
2. **Auth store** - `features/auth/store/authStore.ts` (Zustand + persist)
3. **Auth API** - `features/auth/services/authApi.ts`
4. **Auth hooks** - `features/auth/hooks/useAuth.ts`
5. **Componentes auth**
   - LoginForm.tsx
   - RegisterForm.tsx
   - ProtectedRoute.tsx
6. **Páginas auth**
   - LoginPage.tsx
   - RegisterPage.tsx

### Fase 3: Layout y UI Base
1. **Componentes UI** (shadcn/ui)
   - Button, Input, Card, Badge, Alert, Spinner, Toast
2. **Layout**
   - MainLayout.tsx (sidebar + header + content)
   - Header.tsx
   - Sidebar.tsx
3. **Common**
   - LoadingScreen.tsx
   - ErrorBoundary.tsx
   - Pagination.tsx

### Fase 4: Router
- `app/router.tsx` - Definición de rutas
- `app/App.tsx` - RouterProvider + Providers

### Fase 5: Student Dashboard
1. **Types** - student.types.ts
2. **API** - studentApi.ts
3. **Hooks** - useStudentOverview.ts
4. **Componentes**
   - Dashboard.tsx
   - EnrollmentCard.tsx
   - UpcomingSessionCard.tsx
   - PaymentSummary.tsx
5. **Page** - StudentDashboardPage.tsx

### Fase 6: Features Estudiante
1. **Enrollments** - Lista, detalle, inscripción
2. **Sessions** - Calendario, reservas
3. **Payments** - Lista de pagos, estados
4. **Materials** - Lista, descarga (con control de acceso)
5. **Profile** - Edición perfil

### Fase 7: Admin Panel (futuro)
- Gestión usuarios, asignaturas, grupos, sesiones, pagos

## Convenciones
- Componentes: PascalCase.tsx
- Hooks: useNombre.ts
- Services: nombreApi.ts
- Types: nombre.types.ts
- Constantes: SCREAMING_SNAKE_CASE

## Query Keys
```
['student', 'overview', limit]
['enrollments', 'list', filters]
['enrollment', id]
['sessions', 'list', filters]
['payments', 'list', filters]
['payment', 'access', studentId]
```

## Próximo paso
Comenzar con **Fase 1: Setup proyecto** - instalar dependencias y crear estructura.
