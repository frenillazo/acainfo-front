import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import { MaterialsGroupedByFolder } from './MaterialsGroupedByFolder'
import type { Material, MaterialFolder } from '../types/material.types'

afterEach(cleanup)

const baseMaterial: Material = {
  id: 1,
  subjectId: 10,
  uploadedById: 1,
  name: 'Apuntes tema 1',
  description: null,
  folderId: null,
  academicYear: 2025,
  originalFilename: 'tema1.pdf',
  fileExtension: 'pdf',
  mimeType: 'application/pdf',
  fileSize: 1024,
  fileSizeFormatted: '1 KB',
  isCodeFile: false,
  isDocumentFile: true,
  uploadedAt: '2026-07-01T10:00:00',
  createdAt: '2026-07-01T10:00:00',
  updatedAt: '2026-07-01T10:00:00',
  visible: true,
  downloadDisabled: false,
  visibilityEnabledAt: null,
  downloadEnabledAt: null,
  subjectName: 'Cálculo I',
  uploadedByName: 'Admin',
  folderName: null,
}

const folder = (id: number, name: string, position: number): MaterialFolder => ({
  id,
  subjectId: 10,
  name,
  position,
  createdAt: '2026-07-01T10:00:00',
  updatedAt: '2026-07-01T10:00:00',
})

const folders = [folder(1, 'Teoría', 0), folder(2, 'Exámenes', 2)]

describe('MaterialsGroupedByFolder', () => {
  it('agrupa por carpeta en el orden dado y manda los sin carpeta a "Sin carpeta" al final', () => {
    const materials: Material[] = [
      { ...baseMaterial, id: 1, name: 'Suelto raíz', folderId: null },
      { ...baseMaterial, id: 2, name: 'Examen 2025', folderId: 2, folderName: 'Exámenes' },
      { ...baseMaterial, id: 3, name: 'Apuntes teoría', folderId: 1, folderName: 'Teoría' },
    ]
    render(<MaterialsGroupedByFolder materials={materials} folders={folders} />)

    const groups = [
      screen.getByTestId('group-folder-1'),
      screen.getByTestId('group-folder-2'),
      screen.getByTestId('group-root'),
    ]
    expect(within(groups[0]).getByText('Teoría')).toBeInTheDocument()
    expect(within(groups[0]).getByText('Apuntes teoría')).toBeInTheDocument()
    expect(within(groups[1]).getByText('Exámenes')).toBeInTheDocument()
    expect(within(groups[1]).getByText('Examen 2025')).toBeInTheDocument()
    expect(within(groups[2]).getByText('Sin carpeta')).toBeInTheDocument()
    expect(within(groups[2]).getByText('Suelto raíz')).toBeInTheDocument()

    // El orden en pantalla respeta: carpetas por position y la raíz al final
    const order = Array.from(document.querySelectorAll('[data-testid^="group-"]')).map((el) =>
      el.getAttribute('data-testid')
    )
    expect(order).toEqual(['group-folder-1', 'group-folder-2', 'group-root'])
  })

  it('muestra el contador de materiales de cada grupo', () => {
    const materials: Material[] = [
      { ...baseMaterial, id: 1, folderId: 1, folderName: 'Teoría' },
      { ...baseMaterial, id: 2, name: 'Otro de teoría', folderId: 1, folderName: 'Teoría' },
    ]
    render(<MaterialsGroupedByFolder materials={materials} folders={folders} />)

    expect(within(screen.getByTestId('group-folder-1')).getByText('(2)')).toBeInTheDocument()
  })

  it('oculta las carpetas vacías por defecto (vista alumno) y las muestra con showEmptyFolders (admin)', () => {
    const materials: Material[] = [
      { ...baseMaterial, id: 1, folderId: 1, folderName: 'Teoría' },
    ]
    const { unmount } = render(
      <MaterialsGroupedByFolder materials={materials} folders={folders} />
    )
    expect(screen.queryByTestId('group-folder-2')).toBeNull()
    unmount()

    render(
      <MaterialsGroupedByFolder materials={materials} folders={folders} showEmptyFolders />
    )
    expect(screen.getByTestId('group-folder-2')).toBeInTheDocument()
    expect(screen.getByText('Carpeta vacía')).toBeInTheDocument()
  })

  it('un material cuya carpeta ya no existe cae al grupo "Sin carpeta"', () => {
    const materials: Material[] = [
      { ...baseMaterial, id: 1, folderId: 999, folderName: 'Borrada' },
    ]
    render(<MaterialsGroupedByFolder materials={materials} folders={folders} />)

    expect(within(screen.getByTestId('group-root')).getByText('Apuntes tema 1')).toBeInTheDocument()
  })

  it('sin materiales ni carpetas que mostrar, enseña el estado vacío', () => {
    render(<MaterialsGroupedByFolder materials={[]} folders={folders} />)
    expect(screen.getByText('Todavía no hay materiales')).toBeInTheDocument()
  })
})
