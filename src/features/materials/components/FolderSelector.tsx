import { FormSelectControlled } from '@/shared/components/form'
import { useMaterialFoldersBySubject } from '../hooks/useMaterialFolders'

interface FolderSelectorProps {
  // Sin asignatura (undefined/0) el selector se deshabilita: las carpetas son por asignatura
  subjectId?: number
  value: number | null
  onChange: (folderId: number | null) => void
  disabled?: boolean
}

export function FolderSelector({
  subjectId,
  value,
  onChange,
  disabled = false,
}: FolderSelectorProps) {
  const { data: folders = [], isLoading } = useMaterialFoldersBySubject(subjectId ?? 0)

  const options = [
    { value: '', label: 'Sin carpeta (raíz de la asignatura)' },
    ...folders.map((folder) => ({ value: folder.id, label: folder.name })),
  ]

  return (
    <FormSelectControlled
      label="Carpeta"
      name="folderId"
      value={value?.toString() ?? ''}
      onChange={(v) => onChange(v === '' ? null : Number(v))}
      options={options}
      disabled={disabled || !subjectId || isLoading}
      helperText={
        !subjectId
          ? 'Selecciona primero una asignatura'
          : folders.length === 0 && !isLoading
            ? 'Esta asignatura no tiene carpetas; el material irá a la raíz'
            : undefined
      }
    />
  )
}
