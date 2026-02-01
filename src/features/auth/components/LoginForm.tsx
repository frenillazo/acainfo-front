import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { FormField } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        {...register('email')}
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
      />

      <FormField
        {...register('password')}
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
      />

      {loginError && (
        <Alert
          variant="error"
          message={
            loginError instanceof Error
              ? loginError.message
              : 'Error al iniciar sesión'
          }
        />
      )}

      <Button
        type="submit"
        isLoading={isLoggingIn}
        loadingText="Iniciando sesión..."
        fullWidth
      >
        Iniciar sesión
      </Button>
    </form>
  )
}
