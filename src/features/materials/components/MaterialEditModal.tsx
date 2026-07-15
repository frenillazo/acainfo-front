import { useState } from 'react'
import { Modal, ModalFooter } from '@/shared/components/ui/Modal'
import { currentAcademicYear, formatAcademicYear } from '@/shared/utils/formatters'
import type { Material, UpdateMaterialRequest } from '../types/material.types'

interface MaterialEditModalProps {
  isOpen: boolean
  material: Material | null
  isSaving?: boolean
  onClose: () => void
  onSave: (id: number, payload: UpdateMaterialRequest) => Promise<void> | void
}

/**
 * Admin modal to edit a single material's metadata and admin flags.
 * "Documento" en este contexto = metadatos (nombre/descripción/visibilidad/descarga).
 */
export function MaterialEditModal({
  isOpen,
  material,
  isSaving = false,
  onClose,
  onSave,
}: MaterialEditModalProps) {
  // El padre remonta el modal via key={material.id}: el estado inicial sale del prop
  const [name, setName] = useState(material?.name ?? '')
  const [description, setDescription] = useState(material?.description ?? '')
  const [visible, setVisible] = useState(material?.visible ?? true)
  const [downloadDisabled, setDownloadDisabled] = useState(material?.downloadDisabled ?? false)
  const [academicYear, setAcademicYear] = useState(
    material?.academicYear ?? currentAcademicYear()
  )

  if (!material) return null

  // El submit envía todos los campos: si el año del material quedara fuera del
  // rango ±4 y no estuviera entre las opciones, el select lo re-etiquetaría
  // silenciosamente al guardar — por eso se une siempre a las opciones.
  const current = currentAcademicYear()
  const yearOptions = Array.from({ length: 9 }, (_, i) => current - 4 + i)
  if (!yearOptions.includes(material.academicYear)) {
    yearOptions.push(material.academicYear)
    yearOptions.sort((a, b) => a - b)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(material.id, {
      name: name.trim(),
      description: description.trim(),
      visible,
      downloadDisabled,
      academicYear,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar material" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={255}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={1000}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Curso académico</label>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {formatAcademicYear(year)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Los estudiantes solo ven material del curso académico actual (
            {formatAcademicYear(current)}).
          </p>
        </div>

        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
            Documento
          </p>
          <p className="text-sm text-gray-700">{material.originalFilename}</p>
          <p className="text-xs text-gray-500">
            {material.fileSizeFormatted} · .{material.fileExtension}
          </p>
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              <span className="font-medium text-gray-900">Visible para estudiantes</span>
              <span className="block text-gray-500">
                Si está desmarcado, el material no aparece en la vista de estudiante.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={downloadDisabled}
              onChange={(e) => setDownloadDisabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm">
              <span className="font-medium text-gray-900">Descarga deshabilitada</span>
              <span className="block text-gray-500">
                Los estudiantes no podrán descargar el material aunque sea visible.
              </span>
            </span>
          </label>
        </div>

        <ModalFooter className="-mx-6 -mb-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving || !name.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
