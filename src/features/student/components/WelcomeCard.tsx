interface WelcomeCardProps {
  fullName: string
  waitingListCount: number
}

export function WelcomeCard({ fullName, waitingListCount }: WelcomeCardProps) {
  return (
    <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg">
      <h1 className="text-2xl font-bold">¡Hola, {fullName}!</h1>
      <p className="mt-2 text-blue-100">
        Bienvenido a tu panel de estudiante
      </p>
      {waitingListCount > 0 && (
        <div className="mt-4 rounded-md bg-blue-500/30 px-3 py-2 text-sm">
          Estás en lista de espera en {waitingListCount}{' '}
          {waitingListCount === 1 ? 'grupo' : 'grupos'}
        </div>
      )}
    </div>
  )
}
