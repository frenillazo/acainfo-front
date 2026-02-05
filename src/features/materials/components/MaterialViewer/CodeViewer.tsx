import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { CODE_LANGUAGE_MAP } from '../../types/material.types'
import { Loader2 } from 'lucide-react'

interface CodeViewerProps {
  content: string
  language: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function CodeViewer({ content, language }: CodeViewerProps) {
  const [html, setHtml] = useState<string>('')
  const [isHighlighting, setIsHighlighting] = useState(true)

  const shikiLanguage = CODE_LANGUAGE_MAP[language.toLowerCase()] || 'text'
  const lineCount = content.split('\n').length

  useEffect(() => {
    async function highlight() {
      setIsHighlighting(true)
      try {
        const highlighted = await codeToHtml(content, {
          lang: shikiLanguage,
          theme: 'github-light',
        })
        setHtml(highlighted)
      } catch {
        // Fallback a texto plano si el lenguaje no es soportado
        setHtml(`<pre class="shiki"><code>${escapeHtml(content)}</code></pre>`)
      } finally {
        setIsHighlighting(false)
      }
    }
    highlight()
  }, [content, shikiLanguage])

  if (isHighlighting) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="relative max-h-[70vh] overflow-auto rounded-lg border border-gray-200">
      {/* Header con info del lenguaje */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="text-sm font-medium text-gray-700">{shikiLanguage.toUpperCase()}</span>
        <span className="text-xs text-gray-500">{lineCount} líneas</span>
      </div>

      {/* Código con syntax highlighting */}
      <div
        className="p-4 text-sm [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
