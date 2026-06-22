import { useMemo } from 'react'
import { isProbablyHtml, LEGAL_HTML_PROSE_CLASS, sanitizeLegalHtml } from '../../lib/sanitizeLegalHtml'

type Props = {
  content: string
}

export function AdminLegalSnapshotContent({ content }: Props) {
  const trimmed = content.trim()

  const rendered = useMemo(() => {
    if (!trimmed) return { kind: 'empty' as const }
    if (!isProbablyHtml(trimmed)) return { kind: 'plain' as const, text: trimmed }
    return { kind: 'html' as const, html: sanitizeLegalHtml(trimmed) }
  }, [trimmed])

  if (rendered.kind === 'empty') {
    return <p className="px-3 py-2 text-sm text-slate-500">İçerik yok.</p>
  }

  if (rendered.kind === 'plain') {
    return (
      <div className="max-h-[32rem] overflow-auto border-t border-slate-100 bg-slate-50/40 px-4 py-3 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
        {rendered.text}
      </div>
    )
  }

  return (
    <div
      className={`max-h-[32rem] overflow-auto border-t border-slate-100 bg-white px-4 py-3 ${LEGAL_HTML_PROSE_CLASS}`}
      dangerouslySetInnerHTML={{ __html: rendered.html }}
    />
  )
}
