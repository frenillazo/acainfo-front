import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { FormField } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'

const ALLOWED_DOMAINS = ['red.ujaen.es', 'gmail.com']

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Mínimo 2 caracteres'),
    lastName: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z
      .string()
      .email('Email inválido')
      .refine(
        (email) => {
          const domain = email.split('@')[1]?.toLowerCase()
          return domain && ALLOWED_DOMAINS.includes(domain)
        },
        {
          message: 'Solo se permiten emails de @red.ujaen.es o @gmail.com',
        }
      ),
    phoneNumber: z.string().min(1, 'El teléfono es obligatorio'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { register: registerUser, isRegistering, registerError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          {...register('firstName')}
          label="Nombre"
          type="text"
          autoComplete="given-name"
          error={errors.firstName?.message}
        />

        <FormField
          {...register('lastName')}
          label="Apellidos"
          type="text"
          autoComplete="family-name"
          error={errors.lastName?.message}
        />
      </div>

      <FormField
        {...register('email')}
        label="Email"
        type="email"
        autoComplete="email"
        helperText="Solo se permiten emails de @red.ujaen.es o @gmail.com"
        error={errors.email?.message}
      />

      <FormField
        {...register('phoneNumber')}
        label="Teléfono"
        type="tel"
        autoComplete="tel"
        error={errors.phoneNumber?.message}
      />

      <FormField
        {...register('password')}
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
      />

      <FormField
        {...register('confirmPassword')}
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
      />

      {registerError && (
        <Alert
          variant="error"
          message={
            registerError instanceof Error
              ? registerError.message
              : 'Error al registrarse'
          }
        />
      )}

      <Button
        type="submit"
        isLoading={isRegistering}
        loadingText="Registrando..."
        fullWidth
      >
        Registrarse
      </Button>
    </form>
  )
}
