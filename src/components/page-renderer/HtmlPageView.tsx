import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'
import type { PageApiResponse } from '../../types/page-api'
import { DEFAULT_PAGE_HTML } from '../../constants/cmsDefaults'

export function HtmlPageView({ page }: { page: PageApiResponse }) {
  const html = page.content?.trim() ? page.content : DEFAULT_PAGE_HTML

  return (
    <article className="pb-16 pt-8 md:pb-24 md:pt-12">
      <div className={LAYOUT_CONTAINER_CLASS}>
        <div
          className="cms-content max-w-none text-slate-700 [&_a]:text-accent-blue [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_img]:rounded-xl [&_img]:shadow-md [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_section.hero]:rounded-2xl [&_section.hero]:border [&_section.hero]:border-slate-200 [&_section.hero]:bg-slate-50 [&_section.hero]:p-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  )
}
