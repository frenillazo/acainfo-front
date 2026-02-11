import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { FormField } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'
import type { Degree } from '../types/auth.types'

const ALLOWED_DOMAINS = ['red.ujaen.es', 'gmail.com']

const degreeOptions: { value: Degree; label: string }[] = [
  { value: 'INGENIERIA_INFORMATICA', label: 'Ingeniería Informática' },
  { value: 'INGENIERIA_INDUSTRIAL', label: 'Ingeniería Industrial' },
]

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
    degree: z.enum(['INGENIERIA_INFORMATICA', 'INGENIERIA_INDUSTRIAL'], {
      message: 'Selecciona tu carrera',
    }),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, { message: 'Debes aceptar los términos y condiciones' }),
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
      degree: data.degree,
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

      <div className="space-y-1">
        <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
          Carrera
        </label>
        <select
          id="degree"
          {...register('degree')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Selecciona tu carrera</option>
          {degreeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.degree && (
          <p className="text-sm text-red-500">{errors.degree.message}</p>
        )}
      </div>

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

      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('termsAccepted')}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            He leído y acepto los{' '}
            <a
              href="/docs/terminos-y-condiciones"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Términos y Condiciones, Política de Privacidad y Política de Cookies
            </a>
            . Entiendo que mis datos serán tratados conforme a lo descrito en dicho documento.
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
        )}
      </div>

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
