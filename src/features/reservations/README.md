# Módulo de Reservas (Reservations)

Módulo completo para gestión de reservas de sesiones, asistencia y solicitudes online.

## 📁 Estructura

```
reservations/
├── index.ts                          # Exportaciones públicas del módulo
├── types/
│   └── reservation.types.ts          # Types y enums mapeados del backend
└── services/
    ├── reservationApi.ts             # API de reservas (CRUD)
    ├── attendanceApi.ts              # API de control de asistencia
    └── onlineRequestApi.ts           # API de solicitudes online
```

## 🔗 Mapeo Backend → Frontend

### Enums

| Backend (Java) | Frontend (TypeScript) | Valores |
|----------------|----------------------|---------|
| `ReservationMode` | `ReservationMode` | `IN_PERSON`, `ONLINE` |
| `ReservationStatus` | `ReservationStatus` | `CONFIRMED`, `CANCELLED` |
| `AttendanceStatus` | `AttendanceStatus` | `PRESENT`, `ABSENT` |
| `OnlineRequestStatus` | `OnlineRequestStatus` | `PENDING`, `APPROVED`, `REJECTED` |

### Entidad Principal

| Backend | Frontend |
|---------|----------|
| `SessionReservation.java` | `Reservation` interface |
| `ReservationResponse.java` | `Reservation` interface |

### Controladores Implementados

1. **ReservationController.java** → `reservationApi.ts`
   - ✅ POST `/api/reservations` - Crear reserva
   - ✅ GET `/api/reservations/{id}` - Obtener por ID
   - ✅ GET `/api/reservations` - Listar con filtros
   - ✅ GET `/api/reservations/session/{sessionId}` - Por sesión
   - ✅ GET `/api/reservations/student/{studentId}` - Por estudiante
   - ✅ DELETE `/api/reservations/{id}` - Cancelar
   - ✅ PUT `/api/reservations/{id}/switch-session` - Cambiar sesión

2. **AttendanceController.java** → `attendanceApi.ts`
   - ✅ PUT `/api/reservations/{id}/attendance` - Registrar asistencia individual
   - ✅ POST `/api/sessions/{sessionId}/attendance` - Registrar asistencia masiva
   - ✅ GET `/api/sessions/{sessionId}/attendance` - Obtener asistencia de sesión

3. **OnlineRequestController.java** → `onlineRequestApi.ts`
   - ✅ POST `/api/reservations/{id}/online-request` - Solicitar asistencia online
   - ✅ PUT `/api/reservations/{id}/online-request/process` - Aprobar/rechazar
   - ✅ GET `/api/online-requests/pending` - Solicitudes pendientes de profesor

4. **ReservationGenerationController.java** → `reservationApi.ts`
   - ✅ POST `/api/sessions/{sessionId}/reservations/generate` - Generar reservas

## 📦 Uso

### Importación

```typescript
// Importar todo desde el módulo
import {
  reservationApi,
  attendanceApi,
  onlineRequestApi,
  ReservationMode,
  ReservationStatus,
  AttendanceStatus,
  OnlineRequestStatus,
  type Reservation,
  type CreateReservationRequest,
} from '@/features/reservations'
```

### Ejemplos de Uso

#### 1. Crear una Reserva

```typescript
import { reservationApi, ReservationMode } from '@/features/reservations'

const reservation = await reservationApi.create({
  studentId: 123,
  sessionId: 456,
  enrollmentId: 789,
  mode: ReservationMode.IN_PERSON,
})
```

#### 2. Listar Reservas de un Estudiante

```typescript
const studentReservations = await reservationApi.getByStudentId(123)
```

#### 3. Solicitar Asistencia Online

```typescript
import { onlineRequestApi } from '@/features/reservations'

const reservation = await onlineRequestApi.requestOnline(
  reservationId,
  studentId
)

// El estudiante ahora tiene una solicitud PENDING
console.log(reservation.onlineRequestStatus) // 'PENDING'
```

#### 4. Aprobar Solicitud Online (Profesor)

```typescript
const approved = await onlineRequestApi.processRequest(
  reservationId,
  teacherId,
  { approved: true }
)

// La solicitud fue aprobada
console.log(approved.onlineRequestStatus) // 'APPROVED'
console.log(approved.mode) // 'ONLINE'
```

#### 5. Registrar Asistencia Individual

```typescript
import { attendanceApi, AttendanceStatus } from '@/features/reservations'

const updated = await attendanceApi.recordSingle(
  reservationId,
  teacherId,
  { status: AttendanceStatus.PRESENT }
)

console.log(updated.attendanceStatus) // 'PRESENT'
console.log(updated.hasAttendanceRecorded) // true
```

#### 6. Registrar Asistencia Masiva

```typescript
const attendanceMap = {
  101: AttendanceStatus.PRESENT,
  102: AttendanceStatus.ABSENT,
  103: AttendanceStatus.PRESENT,
}

const results = await attendanceApi.recordBulk(
  sessionId,
  teacherId,
  { attendanceMap }
)

console.log(results.length) // 3
```

#### 7. Cambiar de Sesión

```typescript
const switched = await reservationApi.switchSession(
  reservationId,
  studentId,
  { newSessionId: 999 }
)

console.log(switched.sessionId) // 999
```

#### 8. Cancelar Reserva

```typescript
const cancelled = await reservationApi.cancel(reservationId, studentId)

console.log(cancelled.status) // 'CANCELLED'
console.log(cancelled.isCancelled) // true
```

## 🎯 Flags Calculados por el Backend

La interfaz `Reservation` incluye flags booleanos calculados automáticamente por el backend:

### Estados de Reserva
- `isConfirmed` - Reserva confirmada
- `isCancelled` - Reserva cancelada
- `isInPerson` - Asistencia presencial
- `isOnline` - Asistencia online

### Solicitudes Online
- `hasOnlineRequest` - Tiene solicitud online
- `isOnlineRequestPending` - Solicitud pendiente
- `isOnlineRequestApproved` - Solicitud aprobada
- `isOnlineRequestRejected` - Solicitud rechazada

### Asistencia
- `hasAttendanceRecorded` - Asistencia registrada
- `wasPresent` - Estuvo presente
- `wasAbsent` - Estuvo ausente

### Acciones Disponibles
- `canBeCancelled` - Puede cancelarse (confirmada y sin asistencia)
- `canRequestOnline` - Puede solicitar online (presencial confirmada sin solicitud previa)

## 🔒 Permisos

### STUDENT
- ✅ Crear reserva propia
- ✅ Ver reservas propias
- ✅ Cancelar reserva propia
- ✅ Cambiar de sesión
- ✅ Solicitar asistencia online

### TEACHER
- ✅ Ver reservas de sus sesiones
- ✅ Aprobar/rechazar solicitudes online
- ✅ Registrar asistencia (individual y masiva)

### ADMIN
- ✅ Todos los permisos de STUDENT y TEACHER
- ✅ Generar reservas automáticamente

## 🔄 Flujos Principales

### Flujo 1: Reserva Presencial Normal
1. Admin genera sesiones → se crean reservas automáticamente
2. Estudiante tiene reserva `IN_PERSON` con estado `CONFIRMED`
3. Estudiante asiste a clase
4. Profesor registra asistencia: `PRESENT` o `ABSENT`

### Flujo 2: Solicitud de Asistencia Online
1. Estudiante tiene reserva `IN_PERSON`
2. Estudiante solicita cambio a online (6+ horas antes)
3. Estado: `onlineRequestStatus = PENDING`
4. Profesor aprueba/rechaza solicitud
5. Si aprueba: `mode = ONLINE`, `onlineRequestStatus = APPROVED`
6. Si rechaza: `mode = IN_PERSON`, `onlineRequestStatus = REJECTED`

### Flujo 3: Cambio de Sesión
1. Estudiante está matriculado en Grupo A
2. Quiere asistir a sesión del Grupo B (mismo tema)
3. Llama a `switchSession(reservationId, studentId, { newSessionId })`
4. Sistema verifica capacidad y permite el cambio
5. Reserva ahora apunta a la nueva sesión

## 📊 Tipos de Datos

Consulta `reservation.types.ts` para ver todas las interfaces y enums disponibles.

## ⚠️ Reglas de Negocio

1. **Capacidad**: Asistencia presencial limitada a capacidad de aula (típicamente 24)
2. **Solicitudes Online**: Solo grupos regulares, requieren 6+ horas de anticipación
3. **Grupos Intensivos**: Reserva directa como presencial u online
4. **Cancelación**: Solo si asistencia no ha sido registrada
5. **Cambio de Sesión**: Solo a sesiones del mismo tema (diferente grupo)

## 🔍 Filtros Disponibles

Al usar `getWithFilters()`:

```typescript
const filters: ReservationFilters = {
  studentId: 123,                          // Filtrar por estudiante
  sessionId: 456,                          // Filtrar por sesión
  enrollmentId: 789,                       // Filtrar por matrícula
  status: ReservationStatus.CONFIRMED,     // CONFIRMED | CANCELLED
  mode: ReservationMode.IN_PERSON,         // IN_PERSON | ONLINE
  onlineRequestStatus: OnlineRequestStatus.PENDING, // PENDING | APPROVED | REJECTED
  attendanceStatus: AttendanceStatus.PRESENT,       // PRESENT | ABSENT
  hasAttendanceRecorded: true,             // true | false | undefined
  page: 0,                                 // Número de página
  size: 20,                                // Tamaño de página
  sortBy: 'reservedAt',                    // Campo de ordenamiento
  sortDirection: 'DESC',                   // ASC | DESC
}

const result = await reservationApi.getWithFilters(filters)
```

## ✅ Estado de Implementación

**100% Completo** - Todos los endpoints del backend están implementados en el frontend.

### Cobertura de Endpoints

- ✅ **ReservationController** (7/7 endpoints)
- ✅ **AttendanceController** (3/3 endpoints)
- ✅ **OnlineRequestController** (3/3 endpoints)
- ✅ **ReservationGenerationController** (1/1 endpoint)

**Total: 14/14 endpoints implementados**
