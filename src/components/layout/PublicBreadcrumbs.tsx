import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { productsPublicApi, productCategoriesPublicApi } from '../../api/products-public'
import { findBlogPostBySlug } from '../../data/blogPostsContent'
import { isLegalCheckoutDocSlug, LEGAL_CHECKOUT_DOC_BY_SLUG } from '../../data/legalCheckoutDocuments'
import { useBlogPosts } from '../../hooks/useBlogPosts'
import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'

type Crumb = { label: string; to?: string }

const HOME: Crumb = { label: 'Ana sayfa', to: '/' }

const STORE_INDEX: Crumb = { label: 'Ürünler', to: '/urunler' }

function humanizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug)
      .split('-')
      .filter(Boolean)
      .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
      .join(' ')
  } catch {
    return slug
  }
}

/** Layout altındaki sayfalar; ana sayfada gizlenir */
export function PublicBreadcrumbs() {
  const { pathname } = useLocation()
  const { bundle: blogBundle } = useBlogPosts()
  const [asyncLabel, setAsyncLabel] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setAsyncLabel(null)

    const urun = matchPath({ path: '/urun/:slug', end: true }, pathname)
    const urunSlug = urun?.params.slug
    if (urunSlug) {
      void productsPublicApi
        .getBySlug(urunSlug)
        .then((d) => {
          if (!cancelled) setAsyncLabel(d.name)
        })
        .catch(() => {
          if (!cancelled) setAsyncLabel(null)
        })
      return () => {
        cancelled = true
      }
    }

    const kat = matchPath({ path: '/kategori/:slug', end: true }, pathname)
    const katSlug = kat?.params.slug
    if (katSlug) {
      void productCategoriesPublicApi
        .list()
        .then((cats) => {
          if (cancelled) return
          const c = cats.find((x) => x.slug === katSlug)
          setAsyncLabel(c?.name ?? humanizeSlug(katSlug))
        })
        .catch(() => {
          if (!cancelled) setAsyncLabel(humanizeSlug(katSlug))
        })
      return () => {
        cancelled = true
      }
    }

    return () => {
      cancelled = true
    }
  }, [pathname])

  const items = useMemo((): Crumb[] | null => {
    if (pathname === '/' || pathname === '') return null

    const hidePrefixes = ['/panel', '/admin']
    if (hidePrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null

    if (pathname === '/hakkimizda') return [HOME, { label: 'Hakkımızda' }]
    if (pathname === '/hizmetler') return [HOME, { label: 'Hizmetler' }]
    if (pathname.startsWith('/hizmetler/')) {
      const slug = pathname.slice('/hizmetler/'.length).split('/')[0] || ''
      return [HOME, { to: '/hizmetler', label: 'Hizmetler' }, { label: humanizeSlug(slug) }]
    }
    if (pathname === '/cozumler') return [HOME, { label: 'Çözümler' }]
    if (pathname.startsWith('/cozumler/')) {
      const slug = pathname.slice('/cozumler/'.length).split('/')[0] || ''
      return [HOME, { to: '/cozumler', label: 'Çözümler' }, { label: humanizeSlug(slug) }]
    }
    if (pathname === '/ucretsiz-araclar') return [HOME, { label: 'Ücretsiz Araçlar' }]
    if (pathname === '/ucretsiz-araclar/sifre-kasasi') {
      return [HOME, { to: '/ucretsiz-araclar', label: 'Ücretsiz Araçlar' }, { label: 'Şifre Kasası' }]
    }
    if (pathname === '/blog') return [HOME, { label: 'Blog' }]
    const blogPost = matchPath({ path: '/blog/:slug', end: true }, pathname)
    const blogSlug = blogPost?.params.slug
    if (blogSlug) {
      const post = findBlogPostBySlug(blogBundle, blogSlug, true)
      const title = post?.title?.trim() || humanizeSlug(blogSlug)
      return [HOME, { to: '/blog', label: 'Blog' }, { label: title }]
    }
    if (pathname === '/iletisim') return [HOME, { label: 'İletişim' }]
    if (pathname === '/urunler') return [HOME, STORE_INDEX]
    const urun = matchPath({ path: '/urun/:slug', end: true }, pathname)
    if (urun?.params.slug) {
      const label = asyncLabel?.trim() || 'Ürün'
      return [HOME, STORE_INDEX, { label }]
    }
    const kat = matchPath({ path: '/kategori/:slug', end: true }, pathname)
    const kSlug = kat?.params.slug
    if (kSlug) {
      const label = asyncLabel?.trim() || humanizeSlug(kSlug)
      return [HOME, STORE_INDEX, { label }]
    }
    if (pathname === '/sepet') return [HOME, { label: 'Sepet' }]
    if (pathname === '/checkout' || pathname.startsWith('/checkout/')) {
      return [HOME, { to: '/sepet', label: 'Sepet' }, { label: 'Ödeme' }]
    }

    const yasalMatch = matchPath({ path: '/yasal/:docSlug', end: true }, pathname)
    const yasalSlug = yasalMatch?.params.docSlug
    if (yasalSlug && isLegalCheckoutDocSlug(yasalSlug)) {
      return [HOME, { to: '/checkout', label: 'Ödeme' }, { label: LEGAL_CHECKOUT_DOC_BY_SLUG[yasalSlug].title }]
    }

    if (pathname === '/hesabim' || pathname === '/hesabim/') return [HOME, { label: 'Hesabım' }]
    if (pathname === '/hesabim/siparisler') return [HOME, { to: '/hesabim', label: 'Hesabım' }, { label: 'Siparişler' }]
    const hesOrder = matchPath({ path: '/hesabim/siparisler/:orderNo', end: true }, pathname)
    const orderNoParam = hesOrder?.params.orderNo
    if (orderNoParam) {
      const no = decodeURIComponent(orderNoParam)
      return [
        HOME,
        { to: '/hesabim', label: 'Hesabım' },
        { to: '/hesabim/siparisler', label: 'Siparişler' },
        { label: no },
      ]
    }
    if (pathname === '/hesabim/adresler') {
      return [HOME, { to: '/hesabim', label: 'Hesabım' }, { label: 'Adresler' }]
    }
    if (pathname === '/hesabim/hesap-detaylari') {
      return [HOME, { to: '/hesabim', label: 'Hesabım' }, { label: 'Hesap detayları' }]
    }
    if (pathname === '/hesabim/favoriler') {
      return [HOME, { to: '/hesabim', label: 'Hesabım' }, { label: 'Favoriler' }]
    }
    if (pathname.startsWith('/hesabim/')) {
      return [HOME, { to: '/hesabim', label: 'Hesabım' }, { label: 'Sayfa' }]
    }

    if (pathname === '/giris' || pathname === '/kayit' || pathname === '/siparis-sorgula') return null

    if (pathname === '/sss') return [HOME, { label: 'SSS' }]
    if (pathname === '/teklif-al') return [HOME, { label: 'Teklif Al' }]

    const segs = pathname.split('/').filter(Boolean)
    if (segs.length > 0) {
      return [HOME, { label: humanizeSlug(segs[segs.length - 1]!) }]
    }

    return null
  }, [pathname, asyncLabel, blogBundle])

  if (!items?.length) return null

  return (
    <div className={`${LAYOUT_CONTAINER_CLASS} w-full max-w-full pt-4`}>
      <nav aria-label="Sayfa konumu" className="border-b border-slate-200/80 pb-3">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-slate-500 sm:text-sm">
          {items.map((c, i) => {
            const last = i === items.length - 1
            return (
              <Fragment key={`${c.label}-${i}`}>
                {i > 0 ? (
                  <span className="select-none text-slate-300" aria-hidden>
                    /
                  </span>
                ) : null}
                <li className="min-w-0">
                  {last || !c.to ? (
                    <span className={last ? 'font-medium text-slate-800' : 'text-slate-600'}>{c.label}</span>
                  ) : (
                    <Link to={c.to} className="text-accent-blue hover:underline">
                      {c.label}
                    </Link>
                  )}
                </li>
              </Fragment>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
