export type VisualSessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'

interface SessionStatusInput {
  status: string
  date: string
  startTime: string
  endTime: string
}

/**
 * Compute the visual session status based on backend status and current time.
 * For SCHEDULED sessions, checks if the session has started or completed
 * based on the current date/time, without requiring a backend transition.
 */
export function getVisualSessionStatus(session: SessionStatusInput): VisualSessionStatus {
  const backendStatus = session.status.toUpperCase()

  if (backendStatus !== 'SCHEDULED') {
    return backendStatus.toLowerCase() as VisualSessionStatus
  }

  const now = new Date()
  const sessionEnd = new Date(`${session.date}T${session.endTime}`)
  const sessionStart = new Date(`${session.date}T${session.startTime}`)

  if (now >= sessionEnd) return 'completed'
  if (now >= sessionStart) return 'in_progress'
  return 'scheduled'
}
