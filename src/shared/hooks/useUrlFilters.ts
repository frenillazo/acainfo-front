import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

type FilterValue = string | number | boolean | undefined

/**
 * Drop-in replacement for useState that syncs filters with URL search params.
 * - Reads initial values from URL on mount (falling back to defaults)
 * - Writes non-default filter values to URL as search params
 * - Uses replace (not push) to avoid polluting browser history
 *
 * Usage:
 *   const [filters, setFilters] = useUrlFilters({ page: 0, size: 10, status: undefined })
 */
export function useUrlFilters<T extends object>(
  defaults: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [searchParams, setSearchParams] = useSearchParams()
  const defaultsRef = useRef(defaults)

  const [filters, setFiltersState] = useState<T>(() => {
    const initial = { ...defaults }
    const defs = defaults as Record<string, FilterValue>
    for (const key of Object.keys(defaults)) {
      const urlValue = searchParams.get(key)
      if (urlValue === null) continue
      ;(initial as Record<string, FilterValue>)[key] = parseUrlValue(urlValue, defs[key])
    }
    return initial
  })

  // Sync filters → URL on every change (skip defaults and empty values)
  useEffect(() => {
    const defs = defaultsRef.current as Record<string, FilterValue>
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(filters as Record<string, FilterValue>)) {
      if (value === undefined || value === null || value === '') continue
      // Skip if value matches the non-undefined default
      if (key in defs && defs[key] !== undefined && value === defs[key]) continue
      params.set(key, String(value))
    }

    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  return [filters, setFiltersState]
}

function parseUrlValue(raw: string, defaultValue: FilterValue): FilterValue {
  if (typeof defaultValue === 'number') {
    const n = Number(raw)
    return isNaN(n) ? undefined : n
  }
  if (typeof defaultValue === 'boolean') {
    return raw === 'true'
  }
  if (typeof defaultValue === 'string') {
    return raw
  }
  // defaultValue is undefined — infer type from the raw string
  if (raw === 'true' || raw === 'false') return raw === 'true'
  if (/^-?\d+$/.test(raw)) return Number(raw)
  return raw
}
