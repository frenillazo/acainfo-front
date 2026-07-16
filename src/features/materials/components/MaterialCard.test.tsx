import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MaterialCard } from './MaterialCard'
import type { Material } from '../types/material.types'

afterEach(cleanup)

const baseMaterial: Material = {
  id: 1,
  subjectId: 10,
  uploadedById: 1,
  name: 'Pizarra 2026-07-01',
  description: null,
  folderId: null,
  academicYear: 2025,
  originalFilename: '2026-07-01.pdf',
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
  subjectName: 'Matemáticas II',
  uploadedByName: 'Admin',
  folderName: null,
}

const TRANSCRIBE_TITLE = 'Transcribir a limpio con IA'

describe('MaterialCard — botón Transcribir con IA', () => {
  it('lo muestra en modo admin sobre un PDF y dispara onTranscribe con el material', () => {
    const onTranscribe = vi.fn()
    render(
      <MaterialCard material={baseMaterial} isAdminMode onTranscribe={onTranscribe} />
    )

    const button = screen.getByTitle(TRANSCRIBE_TITLE)
    fireEvent.click(button)
    expect(onTranscribe).toHaveBeenCalledWith(baseMaterial)
  })

  it('no lo muestra para materiales que no son PDF', () => {
    render(
      <MaterialCard
        material={{ ...baseMaterial, fileExtension: 'docx' }}
        isAdminMode
        onTranscribe={vi.fn()}
      />
    )

    expect(screen.queryByTitle(TRANSCRIBE_TITLE)).toBeNull()
  })

  it('no lo muestra fuera del modo admin aunque llegue el handler', () => {
    render(<MaterialCard material={baseMaterial} onTranscribe={vi.fn()} />)

    expect(screen.queryByTitle(TRANSCRIBE_TITLE)).toBeNull()
  })

  it('no lo muestra en modo admin si no llega onTranscribe', () => {
    render(<MaterialCard material={baseMaterial} isAdminMode />)

    expect(screen.queryByTitle(TRANSCRIBE_TITLE)).toBeNull()
  })
})
