import { Link } from 'react-router-dom'

/**
 * Ana sayfa — Woontegra çatı marka alanı (panelden: kicker, başlık, gövde, CTA, görsel URL)
 */
export default function UmbrellaFoldSection(p: Record<string, unknown>) {
  const kicker = String(p.kicker ?? 'Çatı marka')
  const title = String(p.title ?? 'Woontegra')
  const lead = String(p.lead ?? 'Teknoloji, yazılım ve dijital ticarette güvenilir çatı markanız.')
  const body = String(
    p.body ??
      'Optimoon’dan Bilirkişi Hesaplama’ya, Datça Tropikal’den Mercan Danışmanlık’a kadar ürün ve hizmet markalarımızı aynı mühendislik disiplini ve kalite anlayışıyla yönetiyoruz.'
  )
  const imageUrl = String(p.imageUrl ?? '')
  const cta1 = (p.cta1 as { text?: string; href?: string }) ?? { text: 'Çözümlerimiz', href: '/cozumler' }
  const cta2 = (p.cta2 as { text?: string; href?: string }) ?? { text: 'İletişim', href: '/iletisim' }

  return (
    <section
      className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24"
      aria-labelledby="umbrella-fold-title"
      data-section="umbrella_fold"
    >
      {/* Sıcak degrade: amber, şeftali, yumuşak terracotta */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-rose-100/70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-amber-300/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-[360px] w-[360px] rounded-full bg-rose-300/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(rgba(180, 83, 9, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(180, 83, 9, 0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        <div>
          {kicker ? (
            <p className="mb-4 inline-flex rounded-full border border-amber-200/70 bg-amber-50/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800/90 shadow-sm backdrop-blur-sm">
              {kicker}
            </p>
          ) : null}
          <h1
            id="umbrella-fold-title"
            className="text-4xl font-semibold leading-[1.15] tracking-tight text-slate-900 md:text-5xl lg:text-[2.75rem]"
          >
            {title}
          </h1>
          <p className="mt-5 text-xl font-medium leading-relaxed text-slate-700 md:text-2xl">{lead}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">{body}</p>
          <div className="mt-9 flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
            {cta1.text ? (
              <Link
                to={cta1.href ?? '#'}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:opacity-95"
              >
                {cta1.text}
              </Link>
            ) : null}
            {cta2.text ? (
              <Link
                to={cta2.href ?? '#'}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-amber-200/80 bg-amber-50/90 px-7 py-3 text-sm font-semibold text-amber-900/90 backdrop-blur-sm transition hover:border-amber-400/70 hover:text-amber-950"
              >
                {cta2.text}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-amber-100/60 bg-amber-50/50 shadow-xl shadow-amber-900/8 ring-1 ring-amber-200/50 backdrop-blur-sm">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-amber-100/90 via-orange-50/70 to-rose-50/60 p-8 text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  {['Woontegra', 'SaaS', 'E-ticaret', 'Danışmanlık'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-amber-200/70 bg-amber-50/90 px-3 py-1.5 text-xs font-semibold text-amber-800/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-amber-800/70">
                  Panelden bu alana görsel URL&apos;si ekleyebilirsiniz. Boş bırakılınca yer tutucu gösterilir.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
