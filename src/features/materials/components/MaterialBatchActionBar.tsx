import { Ban, Check, Eye, EyeOff, Square, CheckSquare } from 'lucide-react'

interface MaterialBatchActionBarProps {
  selectedCount: number
  totalCount: number
  isLoading?: boolean
  onSelectAll: () => void
  onClearSelection: () => void
  onDisableDownload: () => void
  onEnableDownload: () => void
  onHide: () => void
  onShow: () => void
}

/**
 * Sticky action bar for batch operations on selected materials.
 * Renders only when at least one material is selected.
 */
export function MaterialBatchActionBar({
  selectedCount,
  totalCount,
  isLoading = false,
  onSelectAll,
  onClearSelection,
  onDisableDownload,
  onEnableDownload,
  onHide,
  onShow,
}: MaterialBatchActionBarProps) {
  if (selectedCount === 0) return null

  const allSelected = selectedCount >= totalCount
  const buttonBase =
    'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ' +
    'shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className="sticky bottom-4 z-20 mx-auto mt-4 flex w-fit max-w-full flex-wrap items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-lg">
      <span className="text-sm font-semibold text-gray-700">
        {selectedCount} seleccionado{selectedCount === 1 ? '' : 's'}
      </span>

      <div className="h-6 w-px bg-gray-200" />

      {/* Selection toggles */}
      <button
        onClick={allSelected ? onClearSelection : onSelectAll}
        disabled={isLoading}
        className={`${buttonBase} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
        title={allSelected ? 'Limpiar selección' : 'Seleccionar todos'}
      >
        {allSelected ? (
          <>
            <Square className="h-4 w-4" />
            Limpiar selección
          </>
        ) : (
          <>
            <CheckSquare className="h-4 w-4" />
            Seleccionar todos ({totalCount})
          </>
        )}
      </button>

      <div className="h-6 w-px bg-gray-200" />

      {/* Download batch */}
      <button
        onClick={onDisableDownload}
        disabled={isLoading}
        className={`${buttonBase} bg-red-600 text-white hover:bg-red-700`}
      >
        <Ban className="h-4 w-4" />
        Deshabilitar descarga
      </button>
      <button
        onClick={onEnableDownload}
        disabled={isLoading}
        className={`${buttonBase} border border-green-300 bg-white text-green-700 hover:bg-green-50`}
      >
        <Check className="h-4 w-4" />
        Habilitar descarga
      </button>

      <div className="h-6 w-px bg-gray-200" />

      {/* Visibility batch */}
      <button
        onClick={onHide}
        disabled={isLoading}
        className={`${buttonBase} bg-gray-700 text-white hover:bg-gray-800`}
      >
        <EyeOff className="h-4 w-4" />
        Ocultar
      </button>
      <button
        onClick={onShow}
        disabled={isLoading}
        className={`${buttonBase} border border-blue-300 bg-white text-blue-700 hover:bg-blue-50`}
      >
        <Eye className="h-4 w-4" />
        Mostrar
      </button>
    </div>
  )
}
