import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/RegisterForm'
import { config } from '@/shared/config/env'

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="flex flex-col items-center gap-3 group">
            <img src="/logo.png" alt="AcaInfo" className="h-20 w-20 object-contain" />
            <h1
              className="text-3xl font-semibold tracking-wide text-gray-800 group-hover:text-blue-600 transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AcaInfo
            </h1>
          </Link>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Regístrate para acceder a la plataforma
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          <RegisterForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">¿Ya tienes cuenta? </span>
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
