import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { resolveAssetUrl } from '../../lib/resolveAssetUrl'

export type GalleryImageRef = { id: string; url: string }

type Props = {
  productName: string
  coverImage: string | null
  galleryImages: GalleryImageRef[]
  sectionTitle?: string
}

export function ProductImageGallery({
  productName,
  coverImage,
  galleryImages,
  sectionTitle = 'Ekran görüntüleri',
}: Props) {
  const [brokenSrcs, setBrokenSrcs] = useState<Set<string>>(() => new Set())

  const slides = useMemo(() => {
    const coverSrc = coverImage ? resolveAssetUrl(coverImage) : null
    const ordered: { key: string; src: string }[] = []
    if (coverSrc) ordered.push({ key: 'cover', src: coverSrc })
    for (const g of galleryImages) {
      const src = resolveAssetUrl(g.url)
      if (ordered.some((o) => o.src === src)) continue
      ordered.push({ key: g.id, src })
    }
    return ordered.filter((s) => !brokenSrcs.has(s.src))
  }, [coverImage, galleryImages, brokenSrcs])

  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const slideKey = slides.map((s) => s.src).join('|')
  useEffect(() => {
    setActive(0)
  }, [slideKey])

  useEffect(() => {
    if (!lightbox) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [lightbox])

  const handleImageError = useCallback((src: string) => {
    setBrokenSrcs((prev) => {
      if (prev.has(src)) return prev
      const next = new Set(prev)
      next.add(src)
      return next
    })
  }, [])

  const safeIndex = slides.length ? Math.min(active, slides.length - 1) : 0
  const current = slides[safeIndex]

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!slides.length) return
      setActive((i) => (i + dir + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, go])

  if (!slides.length) return null

  return (
    <>
      <section aria-labelledby="product-gallery-heading" className="scroll-mt-24">
        <h2 id="product-gallery-heading" className="text-2xl font-bold tracking-tight text-slate-900">
          {sectionTitle}
        </h2>
        <figure className="group relative mt-7 lg:mt-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-900/5 shadow-[0_28px_70px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5">
            <button
              type="button"
              className="relative block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              onClick={() => setLightbox(true)}
              aria-label="Görseli büyüt"
            >
              <img
                src={current.src}
                alt={productName}
                className="aspect-[5/4] w-full object-cover sm:aspect-[16/10] lg:aspect-[2/1] lg:min-h-[min(28rem,52vh)] lg:max-h-[min(32rem,58vh)]"
                onError={() => handleImageError(current.src)}
              />
            </button>
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md backdrop-blur-sm transition hover:bg-white lg:left-4 lg:h-12 lg:w-12"
                  onClick={() => go(-1)}
                  aria-label="Önceki görsel"
                >
                  <ChevronLeft className="h-6 w-6 lg:h-7 lg:w-7" />
                </button>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md backdrop-blur-sm transition hover:bg-white lg:right-4 lg:h-12 lg:w-12"
                  onClick={() => go(1)}
                  aria-label="Sonraki görsel"
                >
                  <ChevronRight className="h-6 w-6 lg:h-7 lg:w-7" />
                </button>
              </>
            )}
          </div>

          {slides.length > 1 && (
            <div className="mt-4 flex snap-x snap-mandatory justify-start gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative h-16 w-24 shrink-0 snap-start overflow-hidden rounded-xl border-2 transition sm:h-[4.5rem] sm:w-[6.75rem] lg:h-[4.75rem] lg:w-[7.25rem] ${
                    i === safeIndex
                      ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                      : 'border-slate-200/80 opacity-80 hover:border-slate-300 hover:opacity-100'
                  }`}
                  aria-label={`Görsel ${i + 1}`}
                >
                  <img
                    src={s.src}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => handleImageError(s.src)}
                  />
                </button>
              ))}
            </div>
          )}
        </figure>
      </section>

      {lightbox && current && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Görsel önizleme"
          onClick={() => setLightbox(false)}
        >
          <div className="flex min-h-0 flex-1 flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex shrink-0 justify-end">
              <button
                type="button"
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                onClick={() => setLightbox(false)}
                aria-label="Kapat"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              {slides.length > 1 && (
                <button
                  type="button"
                  className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 sm:left-2"
                  onClick={() => go(-1)}
                  aria-label="Önceki"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
              )}
              <img
                src={current.src}
                alt={productName}
                className="max-h-[min(85vh,900px)] max-w-full object-contain"
                onError={() => handleImageError(current.src)}
              />
              {slides.length > 1 && (
                <button
                  type="button"
                  className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 sm:right-2"
                  onClick={() => go(1)}
                  aria-label="Sonraki"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              )}
            </div>
            {slides.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto py-2">
                {slides.map((s, i) => (
                  <button
                    key={`lb-${s.key}`}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                      i === safeIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={s.src}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={() => handleImageError(s.src)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
