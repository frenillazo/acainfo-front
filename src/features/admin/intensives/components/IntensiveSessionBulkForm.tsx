import { useState } from 'react'
import { Trash2, Plus, ClipboardPaste } from 'lucide-react'
import { Button, Alert } from '@/shared/components/ui'
import type { IntensiveSessionEntry } from '../types/intensive.types'
import type { Classroom } from '../../types/admin.types'

interface IntensiveSessionBulkFormProps {
  intensiveStartDate: string
  intensiveEndDate: string
  isSubmitting?: boolean
  error?: Error | null
  onSubmit: (entries: IntensiveSessionEntry[]) => void
  onCancel?: () => void
}

const CLASSROOMS: { value: Classroom; label: string }[] = [
  { value: 'AULA_PORTAL1', label: 'Aula Portal 1' },
  { value: 'AULA_PORTAL2', label: 'Aula Portal 2' },
  { value: 'AULA_VIRTUAL', label: 'Aula Virtual' },
]

interface DraftEntry {
  date: string
  startTime: string
  endTime: string
  classroom: Classroom
}

const emptyEntry = (defaults?: { date?: string }): DraftEntry => ({
  date: defaults?.date ?? '',
  startTime: '',
  endTime: '',
  classroom: 'AULA_VIRTUAL',
})

/**
 * Bulk creation form for intensive sessions.
 *
 * Each row collects {date, startTime, endTime, classroom}. Supports adding,
 * removing and pasting CSV-style content (one entry per line).
 *
 * Pastable formats (one row per line):
 *   yyyy-MM-dd,HH:mm,HH:mm,AULA_VIRTUAL
 *   2026-05-22 08:00 10:00 AULA_PORTAL1
 *   22/05/2026 08:00-10:00 AULA_VIRTUAL
 */
export function IntensiveSessionBulkForm({
  intensiveStartDate,
  intensiveEndDate,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: IntensiveSessionBulkFormProps) {
  const [entries, setEntries] = useState<DraftEntry[]>([emptyEntry({ date: intensiveStartDate })])
  const [bulkText, setBulkText] = useState('')
  const [showBulkPaste, setShowBulkPaste] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  const updateEntry = (index: number, field: keyof DraftEntry, value: string) => {
    setEntries((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value as any }
      return next
    })
  }

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const addEntry = () => {
    const lastDate = entries[entries.length - 1]?.date || intensiveStartDate
    setEntries((prev) => [...prev, emptyEntry({ date: lastDate })])
  }

  const validate = (): IntensiveSessionEntry[] | null => {
    const out: IntensiveSessionEntry[] = []
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i]
      if (!e.date || !e.startTime || !e.endTime || !e.classroom) {
        setParseError(`Fila ${i + 1}: todos los campos son obligatorios`)
        return null
      }
      if (e.date < intensiveStartDate || e.date > intensiveEndDate) {
        setParseError(
          `Fila ${i + 1}: la fecha ${e.date} está fuera del rango del intensivo (${intensiveStartDate} a ${intensiveEndDate})`
        )
        return null
      }
      if (e.startTime >= e.endTime) {
        setParseError(`Fila ${i + 1}: la hora inicio debe ser anterior a la hora fin`)
        return null
      }
      out.push({
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        classroom: e.classroom,
      })
    }
    setParseError(null)
    return out
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const valid = validate()
    if (!valid || valid.length === 0) return
    onSubmit(valid)
  }

  // ===== Bulk paste =====

  const parseDate = (s: string): string | null => {
    // yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
    // dd/MM/yyyy
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (m) return `${m[3]}-${m[2]}-${m[1]}`
    return null
  }

  const parseTime = (s: string): string | null => {
    if (/^\d{2}:\d{2}$/.test(s)) return s
    return null
  }

  const parseClassroom = (s: string): Classroom | null => {
    const upper = s.toUpperCase().replace(/\s+/g, '_')
    if (upper === 'AULA_PORTAL1' || upper === 'PORTAL1') return 'AULA_PORTAL1'
    if (upper === 'AULA_PORTAL2' || upper === 'PORTAL2') return 'AULA_PORTAL2'
    if (upper === 'AULA_VIRTUAL' || upper === 'VIRTUAL' || upper === 'ONLINE') return 'AULA_VIRTUAL'
    return null
  }

  const applyBulkPaste = () => {
    const lines = bulkText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    if (lines.length === 0) {
      setParseError('No hay líneas que importar')
      return
    }
    const parsed: DraftEntry[] = []
    for (let i = 0; i < lines.length; i++) {
      const tokens = lines[i].split(/[\s,;]+/).filter((t) => t.length > 0)
      // Try formats: [date, startTime, endTime, classroom]
      // OR [date, startTime-endTime, classroom]
      let date: string | null = null
      let start: string | null = null
      let end: string | null = null
      let classroom: Classroom | null = null

      if (tokens.length >= 4) {
        date = parseDate(tokens[0])
        start = parseTime(tokens[1])
        end = parseTime(tokens[2])
        classroom = parseClassroom(tokens[3])
      } else if (tokens.length === 3 && tokens[1].includes('-')) {
        const [s, e] = tokens[1].split('-')
        date = parseDate(tokens[0])
        start = parseTime(s)
        end = parseTime(e)
        classroom = parseClassroom(tokens[2])
      }

      if (!date || !start || !end || !classroom) {
        setParseError(
          `Línea ${i + 1}: formato no reconocido. Esperado: "yyyy-MM-dd HH:mm HH:mm AULA_VIRTUAL"`
        )
        return
      }
      parsed.push({ date, startTime: start, endTime: end, classroom })
    }
    setEntries(parsed)
    setBulkText('')
    setShowBulkPaste(false)
    setParseError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Rango permitido: <span className="font-medium">{intensiveStartDate}</span> →{' '}
          <span className="font-medium">{intensiveEndDate}</span>
        </p>
        <button
          type="button"
          onClick={() => setShowBulkPaste((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <ClipboardPaste className="h-4 w-4" />
          {showBulkPaste ? 'Ocultar pegado' : 'Pegar varias líneas'}
        </button>
      </div>

      {showBulkPaste && (
        <div className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs text-gray-600">
            Una sesión por línea. Formato: <code>yyyy-MM-dd HH:mm HH:mm AULA_VIRTUAL</code> (también
            acepta comas, <code>dd/MM/yyyy</code> y <code>HH:mm-HH:mm</code>).
          </p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={5}
            className="block w-full rounded-md border border-gray-300 p-2 font-mono text-xs"
            placeholder={`2026-05-22 08:00 10:00 AULA_VIRTUAL\n2026-05-23 08:00 10:00 AULA_VIRTUAL\n2026-05-25 08:00 10:00 AULA_PORTAL1`}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setBulkText('')}>
              Limpiar
            </Button>
            <Button type="button" onClick={applyBulkPaste} disabled={!bulkText.trim()}>
              Aplicar
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">#</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Fecha</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Inicio</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Fin</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Aula</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {entries.map((e, i) => (
              <tr key={i}>
                <td className="px-3 py-2 text-sm text-gray-500">{i + 1}</td>
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={e.date}
                    min={intensiveStartDate}
                    max={intensiveEndDate}
                    onChange={(ev) => updateEntry(i, 'date', ev.target.value)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="time"
                    value={e.startTime}
                    onChange={(ev) => updateEntry(i, 'startTime', ev.target.value)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="time"
                    value={e.endTime}
                    onChange={(ev) => updateEntry(i, 'endTime', ev.target.value)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={e.classroom}
                    onChange={(ev) => updateEntry(i, 'classroom', ev.target.value)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  >
                    {CLASSROOMS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeEntry(i)}
                    className="rounded-md p-1 text-red-600 hover:bg-red-50"
                    title="Eliminar fila"
                    disabled={entries.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addEntry}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50"
      >
        <Plus className="h-4 w-4" />
        Añadir sesión
      </button>

      {parseError && <Alert variant="error" message={parseError} />}
      {error && <Alert variant="error" message={error.message || 'Error al crear las sesiones'} />}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting} loadingText="Creando...">
          Crear {entries.length} sesión{entries.length === 1 ? '' : 'es'}
        </Button>
      </div>
    </form>
  )
}
