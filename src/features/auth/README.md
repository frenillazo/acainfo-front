# Módulo de Autenticación y Perfil (Auth)

Módulo completo para autenticación de usuarios y gestión de perfil.

## 📁 Estructura

```
auth/
├── index.ts                          # Exportaciones públicas del módulo
├── types/
│   └── auth.types.ts                 # Types y enums del módulo
├── services/
│   └── authApi.ts                    # API de autenticación y perfil
├── hooks/
│   ├── useAuth.ts                    # Hook de autenticación
│   └── useProfile.ts                 # Hook de gestión de perfil (NUEVO)
├── store/
│   └── authStore.ts                  # Estado global de autenticación
├── components/
│   ├── LoginForm.tsx                 # Formulario de login
│   ├── RegisterForm.tsx              # Formulario de registro
│   └── ProtectedRoute.tsx            # Rutas protegidas
└── pages/
    ├── LoginPage.tsx                 # Página de login
    └── RegisterPage.tsx              # Página de registro
```

## 🆕 Actualizaciones - Módulo de Perfil

Se han agregado los siguientes endpoints y funcionalidades:

### Endpoints Nuevos

| Endpoint | Método | Descripción | Backend |
|----------|--------|-------------|---------|
| `/users/profile` | PUT | Actualizar perfil (nombre) | `UserController.updateProfile()` |
| `/users/profile/password` | PUT | Cambiar contraseña | `UserController.changePassword()` |

### Types Nuevos

```typescript
export interface UpdateProfileRequest {
  firstName: string   // Máx 50 caracteres
  lastName: string    // Máx 50 caracteres
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string  // Mínimo 6 caracteres
}
```

### Hook Nuevo: `useProfile`

```typescript
const {
  updateProfile,      // Función para actualizar perfil
  changePassword,     // Función para cambiar contraseña
  isLoading,          // Estado de carga
  error,              // Mensaje de error
  clearError,         // Limpiar error
} = useProfile()
```

## 📦 API Completa

### Autenticación

```typescript
// Login
const authResponse = await authApi.login({
  email: 'usuario@example.com',
  password: 'password123',
})

// Register
const authResponse = await authApi.register({
  email: 'usuario@example.com',
  password: 'password123',
  firstName: 'Juan',
  lastName: 'Pérez',
})

// Refresh token
const authResponse = await authApi.refresh(refreshToken)

// Logout
await authApi.logout()

// Logout de todos los dispositivos
await authApi.logoutAll()
```

### Perfil de Usuario

```typescript
// Obtener perfil actual
const user = await authApi.getMe()

// Actualizar perfil ✨ NUEVO
const updatedUser = await authApi.updateProfile({
  firstName: 'Juan Carlos',
  lastName: 'Pérez García',
})

// Cambiar contraseña ✨ NUEVO
await authApi.changePassword({
  currentPassword: 'oldPassword123',
  newPassword: 'newPassword456',
})
```

## 🎯 Ejemplos de Uso

### 1. Actualizar Perfil con Hook

```typescript
import { useProfile } from '@/features/auth'

function ProfileEditForm() {
  const { updateProfile, isLoading, error } = useProfile()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedUser = await updateProfile({
      firstName,
      lastName,
    })

    if (updatedUser) {
      console.log('Profile updated successfully:', updatedUser)
      // Actualizar estado global, mostrar mensaje, etc.
    } else {
      console.error('Update failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        required
        maxLength={50}
      />
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        required
        maxLength={50}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Profile'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
```

### 2. Cambiar Contraseña con Hook

```typescript
import { useProfile } from '@/features/auth'

function ChangePasswordForm() {
  const { changePassword, isLoading, error, clearError } = useProfile()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Validación de confirmación
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }

    // Validación de longitud
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters')
      return
    }

    const success = await changePassword({
      currentPassword,
      newPassword,
    })

    if (success) {
      console.log('Password changed successfully')
      // Limpiar campos, mostrar mensaje de éxito, redirigir, etc.
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      alert('Password changed successfully!')
    } else {
      console.error('Password change failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current Password"
        required
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        required
        minLength={6}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Changing...' : 'Change Password'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
```

### 3. Uso Directo del API (sin hook)

```typescript
import { authApi } from '@/features/auth'

// Actualizar perfil directamente
async function updateUserProfile() {
  try {
    const updatedUser = await authApi.updateProfile({
      firstName: 'María',
      lastName: 'González',
    })
    console.log('Updated:', updatedUser)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Cambiar contraseña directamente
async function changeUserPassword() {
  try {
    await authApi.changePassword({
      currentPassword: 'current123',
      newPassword: 'newSecure456!',
    })
    console.log('Password changed successfully')
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## 🔒 Validaciones

### Backend (Java)

**UpdateProfileRequest**:
- `firstName`: Requerido, máximo 50 caracteres
- `lastName`: Requerido, máximo 50 caracteres

**ChangePasswordRequest**:
- `currentPassword`: Requerido
- `newPassword`: Requerido, mínimo 6 caracteres

### Frontend (Recomendado)

```typescript
// Validación de perfil
const validateProfileUpdate = (data: UpdateProfileRequest) => {
  if (!data.firstName.trim()) {
    return 'First name is required'
  }
  if (data.firstName.length > 50) {
    return 'First name must not exceed 50 characters'
  }
  if (!data.lastName.trim()) {
    return 'Last name is required'
  }
  if (data.lastName.length > 50) {
    return 'Last name must not exceed 50 characters'
  }
  return null
}

// Validación de cambio de contraseña
const validatePasswordChange = (data: ChangePasswordRequest) => {
  if (!data.currentPassword) {
    return 'Current password is required'
  }
  if (!data.newPassword) {
    return 'New password is required'
  }
  if (data.newPassword.length < 6) {
    return 'New password must be at least 6 characters'
  }
  if (data.currentPassword === data.newPassword) {
    return 'New password must be different from current password'
  }
  return null
}
```

## 🔐 Permisos

Todos los endpoints de perfil requieren autenticación:
- ✅ Usuario debe estar autenticado (`@PreAuthorize("isAuthenticated()")`)
- ✅ Operaciones solo afectan al usuario actual
- ✅ No se puede modificar perfil de otros usuarios

## 📊 Respuestas

### Actualizar Perfil (200 OK)

```json
{
  "id": 123,
  "email": "usuario@example.com",
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "fullName": "Juan Carlos Pérez García",
  "status": "ACTIVE",
  "roles": ["STUDENT"],
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-03-20T14:45:00"
}
```

### Cambiar Contraseña (200 OK)

```json
{
  "message": "Password changed successfully"
}
```

### Errores Comunes

**400 Bad Request** - Validación fallida:
```json
{
  "message": "New password must be at least 6 characters"
}
```

**400 Bad Request** - Contraseña actual incorrecta:
```json
{
  "message": "Invalid current password"
}
```

**401 Unauthorized** - No autenticado:
```json
{
  "message": "User not authenticated"
}
```

## ✅ Estado de Implementación

**100% Completo** - Todos los endpoints del módulo de perfil están implementados.

### Cobertura de Endpoints

#### AuthController.java ✅
- ✅ POST `/auth/register` - Registro
- ✅ POST `/auth/login` - Login
- ✅ POST `/auth/refresh` - Refresh token
- ✅ POST `/auth/logout` - Logout
- ✅ POST `/auth/logout/all` - Logout all devices

#### UserController.java ✅
- ✅ GET `/users/profile` - Obtener perfil
- ✅ PUT `/users/profile` - Actualizar perfil ✨ **NUEVO**
- ✅ PUT `/users/profile/password` - Cambiar contraseña ✨ **NUEVO**

**Total: 8/8 endpoints implementados**

## 🎨 Características del Hook `useProfile`

1. **Gestión de Estado**: Loading y error states automáticos
2. **Type Safety**: TypeScript completo
3. **Error Handling**: Manejo de errores con mensajes claros
4. **Clean API**: Funciones async/await fáciles de usar
5. **Reusable**: Puede usarse en múltiples componentes
6. **Clear Errors**: Método para limpiar errores manualmente

## 🔄 Integración con Estado Global

Después de actualizar el perfil, es recomendable actualizar el estado global:

```typescript
import { useProfile } from '@/features/auth'
import { useAuthStore } from '@/features/auth'

function ProfileForm() {
  const { updateProfile } = useProfile()
  const setUser = useAuthStore((state) => state.setUser)

  const handleUpdate = async (data: UpdateProfileRequest) => {
    const updatedUser = await updateProfile(data)

    if (updatedUser) {
      // Actualizar estado global
      setUser(updatedUser)
    }
  }

  // ...
}
```

## 🚀 Próximos Pasos Recomendados

1. **Crear componentes de UI**:
   - `ProfileEditForm` - Formulario de edición de perfil
   - `ChangePasswordForm` - Formulario de cambio de contraseña
   - `ProfilePage` - Página completa de perfil

2. **Agregar validación con bibliotecas**:
   - React Hook Form para gestión de formularios
   - Zod o Yup para validación de esquemas

3. **Mejorar UX**:
   - Toast notifications para éxito/error
   - Confirmación antes de cambiar contraseña
   - Loading spinners
   - Validación en tiempo real

4. **Seguridad adicional**:
   - Logout automático después de cambiar contraseña
   - Confirmación por email (si se implementa en backend)
   - Rate limiting en el frontend
