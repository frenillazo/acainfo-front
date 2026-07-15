import { useState } from 'react'
import { Folder, Pencil, Trash2, ArrowUp, ArrowDown, Check, X } from 'lucide-react'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { getApiErrorMessage } from '@/shared/utils/apiError'
import {
  useMaterialFoldersBySubject,
  useCreateMaterialFolder,
  useUpdateMaterialFolder,
  useDeleteMaterialFolder,
} from '../hooks/useMaterialFolders'
import type { MaterialFolder } from '../types/material.types'

interface MaterialFolderManagerProps {
  subjectId: number
}

/**
 * Gestión inline de carpetas de una asignatura (solo admin):
 * crear, renombrar, reordenar (posición) y borrar. Borrar una carpeta
 * NUNCA borra materiales: pasan a "Sin carpeta" (raíz).
 */
export function MaterialFolderManager({ subjectId }: MaterialFolderManagerProps) {
  const { data: folders = [] } = useMaterialFoldersBySubject(subjectId)
  const createMutation = useCreateMaterialFolder()
  const updateMutation = useUpdateMaterialFolder()
  const deleteMutation = useDeleteMaterialFolder()
  const { dialogProps, confirm } = useConfirmDialog()

  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  const mutationError = createMutation.error ?? updateMutation.error ?? deleteMutation.error
  const error = mutationError
    ? getApiErrorMessage(mutationError, 'No se pudo completar la operación con la carpeta')
    : null

  const resetErrors = () => {
    createMutation.reset()
    updateMutation.reset()
    deleteMutation.reset()
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    resetErrors()
    createMutation.mutate(
      { subjectId, payload: { name } },
      { onSuccess: () => setNewName('') }
    )
  }

  const startRename = (folder: MaterialFolder) => {
    resetErrors()
    setEditingId(folder.id)
    setEditingName(folder.name)
  }

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault()
    const name = editingName.trim()
    if (!name || editingId === null) return
    resetErrors()
    updateMutation.mutate(
      { id: editingId, payload: { name } },
      { onSuccess: () => setEditingId(null) }
    )
  }

  // Intercambia posiciones con el vecino usando los índices actuales como
  // posición nueva (normaliza los huecos que dejó el backfill del enum)
  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= folders.length) return
    resetErrors()
    updateMutation.mutate({ id: folders[index].id, payload: { position: targetIndex } })
    updateMutation.mutate({ id: folders[targetIndex].id, payload: { position: index } })
  }

  const handleDelete = async (folder: MaterialFolder) => {
    resetErrors()
    const confirmed = await confirm({
      title: 'Eliminar carpeta',
      message: `Los materiales de "${folder.name}" pasarán a "Sin carpeta". La carpeta se eliminará; los materiales no se borran. ¿Continuar?`,
      confirmLabel: 'Sí, eliminar carpeta',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(folder.id)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Carpetas de la asignatura
      </h3>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {folders.length === 0 ? (
        <p className="mb-3 text-sm text-gray-500">
          No hay carpetas. Los materiales se muestran en la raíz de la asignatura.
        </p>
      ) : (
        <ul className="mb-3 divide-y divide-gray-100">
          {folders.map((folder, index) => (
            <li key={folder.id} className="flex items-center gap-2 py-2">
              <Folder className="h-4 w-4 flex-shrink-0 text-blue-600" />

              {editingId === folder.id ? (
                <form onSubmit={handleRename} className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    maxLength={100}
                    autoFocus
                    className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isMutating || !editingName.trim()}
                    className="rounded-md p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50"
                    title="Guardar nombre"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                    title="Cancelar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <>
                  <span className="flex-1 truncate text-sm text-gray-900">{folder.name}</span>
                  <button
                    onClick={() => handleMove(index, -1)}
                    disabled={isMutating || index === 0}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    title="Subir"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 1)}
                    disabled={isMutating || index === folders.length - 1}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    title="Bajar"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => startRename(folder)}
                    disabled={isMutating}
                    className="rounded-md p-1.5 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                    title="Renombrar carpeta"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(folder)}
                    disabled={isMutating}
                    className="rounded-md p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    title="Eliminar carpeta"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleCreate} className="flex items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={100}
          placeholder="Nueva carpeta..."
          className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isMutating || !newName.trim()}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Crear
        </button>
      </form>

      <ConfirmDialog {...dialogProps} isLoading={deleteMutation.isPending} />
    </div>
  )
}
