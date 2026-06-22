import DOMPurify from 'dompurify'

const LEGAL_HTML_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'div',
    'section',
    'h1',
    'h2',
    'h3',
    'h4',
    'p',
    'strong',
    'em',
    'b',
    'i',
    'br',
    'ul',
    'ol',
    'li',
    'hr',
    'span',
    'a',
  ],
  ALLOWED_ATTR: ['class', 'href', 'data-variant', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
}

/** Admin/checkout yasal HTML içeriğini güvenli şekilde temizler. */
export function sanitizeLegalHtml(html: string): string {
  return DOMPurify.sanitize(html, LEGAL_HTML_CONFIG)
}

export function isProbablyHtml(content: string): boolean {
  const trimmed = content.trim()
  if (!trimmed) return false
  if (!trimmed.startsWith('<')) return false
  return /<\/[a-z][\s\S]*>/i.test(trimmed)
}

export const LEGAL_HTML_PROSE_CLASS =
  'legal-prose min-w-0 text-sm leading-relaxed text-slate-800 [&_.legal-block]:my-3 [&_.legal-buyer-block]:my-4 [&_.legal-buyer-block_h3]:text-sm [&_.legal-buyer-block_h3]:font-bold [&_.legal-buyer-block_h3]:text-slate-900 [&_.legal-doc_h2]:mt-5 [&_.legal-doc_h2]:text-base [&_.legal-doc_h2]:font-bold [&_.legal-doc_h2]:text-slate-900 [&_.legal-doc_h3]:mt-4 [&_.legal-doc_h3]:text-sm [&_.legal-doc_h3]:font-bold [&_.legal-doc_p]:mt-2 [&_.legal-doc_ul]:mt-2 [&_.legal-doc_ul]:list-disc [&_.legal-doc_ul]:pl-5 [&_.legal-doc_ol]:mt-2 [&_.legal-doc_ol]:list-decimal [&_.legal-doc_ol]:pl-5'
