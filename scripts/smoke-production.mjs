/**
 * Canlı production smoke — yalnızca okuma/test; admin yazma işlemi yok.
 * Kullanım: npm run smoke:production
 * Opsiyonel: SMOKE_CONSENT=1 SMOKE_RESPONSIVE=1
 */
import {
  isBadImageUrl,
  isCriticalConsoleMessage,
  loadPlaywright,
  printSummary,
  VIEWPORTS,
} from './smoke-lib.mjs'

const BASE_URL = (process.env.SMOKE_BASE_URL || 'https://woontegra.com').replace(/\/$/, '')
const API_URL = (process.env.SMOKE_API_URL || 'https://websitebackend-production-ab6e.up.railway.app').replace(/\/$/, '')

const PUBLIC_ROUTES = [
  { path: '/', expectText: 'Woontegra' },
  { path: '/hakkimizda', expectText: 'Hakkımızda' },
  { path: '/hizmetler', expectText: 'Hizmetler' },
  { path: '/cozumler', expectText: 'Çözümler' },
  { path: '/ucretsiz-araclar', expectText: 'Ücretsiz' },
  { path: '/ucretsiz-araclar/sifre-kasasi', expectText: 'Şifre Kasası' },
  { path: '/blog', expectText: 'Blog' },
  { path: '/sss', expectText: 'Sorular' },
  { path: '/iletisim', expectText: 'İletişim' },
  { path: '/gizlilik-politikasi', expectText: 'Gizlilik Politikası' },
  { path: '/cerez-politikasi', expectText: 'Çerez Politikası' },
  { path: '/kvkk-aydinlatma-metni', expectText: 'KVKK Aydınlatma Metni' },
  { path: '/acik-riza-metni', expectText: 'Açık Rıza Metni' },
  { path: '/kullanim-sartlari', expectText: 'Kullanım Şartları' },
]

const SEO_ROUTES = [
  '/',
  '/hakkimizda',
  '/hizmetler',
  '/cozumler',
  '/ucretsiz-araclar',
  '/ucretsiz-araclar/sifre-kasasi',
  '/blog',
  '/sss',
  '/iletisim',
  '/kvkk-aydinlatma-metni',
  '/gizlilik-politikasi',
  '/cerez-politikasi',
  '/acik-riza-metni',
  '/kullanim-sartlari',
]

async function runSeoFileChecks() {
  const issues = []

  const robotsRes = await fetch(`${BASE_URL}/robots.txt`, { signal: AbortSignal.timeout(15000) })
  if (!robotsRes.ok) {
    issues.push(`robots.txt HTTP ${robotsRes.status}`)
  } else {
    const robots = await robotsRes.text()
    if (!robots.includes('Allow: /')) issues.push('robots.txt Allow: / yok')
    if (!robots.includes('Sitemap: https://woontegra.com/sitemap.xml')) issues.push('robots.txt sitemap satırı eksik')
  }

  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(15000) })
  if (!sitemapRes.ok) {
    issues.push(`sitemap.xml HTTP ${sitemapRes.status}`)
  } else {
    const sitemap = await sitemapRes.text()
    if (!sitemap.includes('<urlset')) issues.push('sitemap.xml geçersiz XML')
    for (const stale of ['https://woontegra.com/kvkk', 'https://woontegra.com/gizlilik']) {
      if (sitemap.includes(`<loc>${stale}</loc>`)) issues.push(`sitemap eski URL: ${stale}`)
    }
    for (const required of [
      'https://woontegra.com/ucretsiz-araclar',
      'https://woontegra.com/acik-riza-metni',
      'https://woontegra.com/kvkk-aydinlatma-metni',
    ]) {
      if (!sitemap.includes(`<loc>${required}</loc>`)) issues.push(`sitemap eksik: ${required}`)
    }
  }

  return { ok: issues.length === 0, name: 'seo-files-live', detail: issues.join(' | ') || undefined }
}

async function runApiChecks() {
  const issues = []
  const endpoints = [
    '/api/health',
    '/api/settings',
    '/api/settings/tracking',
    '/api/page-content/menuItems',
    '/api/page-content/footerGroups',
    '/api/page-content/blogPosts',
    '/api/public/cookies',
  ]

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${API_URL}${ep}`, {
        headers: { Origin: BASE_URL },
        signal: AbortSignal.timeout(15000),
      })
      if (!res.ok) issues.push(`${ep} HTTP ${res.status}`)
      const cors = res.headers.get('access-control-allow-origin')
      if (ep !== '/api/public/cookies' && cors && cors !== BASE_URL && cors !== '*') {
        issues.push(`${ep} CORS origin beklenmeyen: ${cors}`)
      }
    } catch (err) {
      issues.push(`${ep} erişilemedi: ${err.message}`)
    }
  }

  return { ok: issues.length === 0, name: 'live-api-cors', detail: issues.join(' | ') || undefined }
}

async function runRouteSmoke(page, route) {
  const issues = []
  const consoleErrors = []
  const imageFailures = []

  page.on('console', (msg) => {
    if (msg.type() === 'error' && isCriticalConsoleMessage(msg.text())) {
      consoleErrors.push(msg.text())
    }
  })

  page.on('response', (response) => {
    const url = response.url()
    const type = response.request().resourceType()
    if (type === 'image' && response.status() >= 400) {
      imageFailures.push(`${response.status()} ${url}`)
    }
  })

  const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 60000 })
  if (!response || response.status() >= 400) {
    issues.push(`HTTP ${response?.status() ?? 'no-response'}`)
  }

  const bodyText = await page.locator('body').innerText()
  if (!bodyText.includes(route.expectText)) {
    issues.push(`Beklenen metin yok: "${route.expectText}"`)
  }

  const badSrcs = await page.$$eval('img[src]', (imgs) =>
    imgs.map((img) => img.getAttribute('src')).filter((src) => !src || src.includes('undefined') || src.includes('null')),
  )
  for (const src of badSrcs) {
    if (isBadImageUrl(src)) imageFailures.push(`Geçersiz img src: ${src}`)
  }

  if (consoleErrors.length) issues.push(...consoleErrors.map((e) => `Console: ${e.slice(0, 200)}`))
  if (imageFailures.length) issues.push(...imageFailures.map((e) => `Görsel: ${e}`))

  return { ok: issues.length === 0, name: route.path, detail: issues.join(' | ') || undefined }
}

async function runSeoMetaSmoke(page) {
  const issues = []
  const titles = new Map()

  for (const path of SEO_ROUTES) {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded', timeout: 45000 })
    const meta = await page.evaluate(() => ({
      title: document.title?.trim() || '',
      description: document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '',
    }))
    if (!meta.title) issues.push(`${path}: boş title`)
    if (!meta.description) issues.push(`${path}: boş description`)
    titles.set(meta.title, (titles.get(meta.title) || 0) + 1)
  }

  const duplicates = [...titles.entries()].filter(([, count]) => count > 3)
  for (const [title, count] of duplicates) {
    issues.push(`Duplicate title (${count}x): ${title}`)
  }

  return { ok: issues.length === 0, name: 'seo-meta-live', detail: issues.join(' | ') || undefined }
}

async function runConsentSmoke(context) {
  const page = await context.newPage()
  const gaRequests = []
  const metaScripts = []

  page.on('request', (req) => {
    const url = req.url()
    if (url.includes('google-analytics.com/g/collect') || url.includes('googletagmanager.com/gtag/js')) {
      gaRequests.push(url)
    }
  })
  page.on('response', (res) => {
    if (res.url().includes('fbevents.js') || res.url().includes('connect.facebook.net')) {
      metaScripts.push(res.url())
    }
  })

  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 60000 })

  const bannerVisible = await page.getByRole('button', { name: /Tümünü reddet|Tümünü kabul et/i }).count()
  if (bannerVisible === 0) {
    return { ok: false, name: 'consent-banner', detail: 'İlk girişte çerez banner görünmüyor' }
  }

  await page.evaluate(() => {
    localStorage.setItem(
      'woontegra_cookie_consent',
      JSON.stringify({ necessary: true, analytics: false, marketing: false, ts: Date.now() }),
    )
  })
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)

  const rejectGa = gaRequests.length
  const rejectMeta = metaScripts.length
  gaRequests.length = 0
  metaScripts.length = 0

  await page.evaluate(() => {
    localStorage.setItem(
      'woontegra_cookie_consent',
      JSON.stringify({ necessary: true, analytics: true, marketing: true, ts: Date.now() }),
    )
  })
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  const acceptGa = gaRequests.length
  const acceptMeta = metaScripts.length

  const issues = []
  if (rejectGa > 0) issues.push('Reddet sonrası GA isteği gitti')
  if (rejectMeta > 0) issues.push('Reddet sonrası Meta script yüklendi')

  return {
    ok: issues.length === 0,
    name: 'consent-gating-live',
    detail: issues.length
      ? issues.join(' | ')
      : `Banner=OK; Reddet GA=${rejectGa} Meta=${rejectMeta}; Kabul GA=${acceptGa} Meta=${acceptMeta}`,
  }
}

async function runResponsiveSmoke(page) {
  const issues = []
  const paths = ['/', '/blog', '/ucretsiz-araclar/sifre-kasasi', '/iletisim', '/kvkk-aydinlatma-metni']

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    for (const path of paths) {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded', timeout: 45000 })
      const layout = await page.evaluate(() => {
        const doc = document.documentElement
        const header = document.querySelector('header')
        const footer = document.querySelector('footer')
        return {
          pageOverflow: doc.scrollWidth > doc.clientWidth + 2,
          headerOverflow: header ? header.scrollWidth > header.clientWidth + 2 : false,
          footerOverflow: footer ? footer.scrollWidth > footer.clientWidth + 2 : false,
        }
      })
      if (layout.pageOverflow) issues.push(`${vp.name} ${path}: sayfa taşma`)
      if (layout.headerOverflow) issues.push(`${vp.name} ${path}: header taşma`)
      if (layout.footerOverflow) issues.push(`${vp.name} ${path}: footer taşma`)
    }
  }

  return { ok: issues.length === 0, name: 'responsive-live', detail: issues.join(' | ') || undefined }
}

async function main() {
  console.log(`Production smoke: ${BASE_URL} (API: ${API_URL})`)

  const results = []
  results.push(await runSeoFileChecks())
  results.push(await runApiChecks())

  const { chromium } = loadPlaywright()
  const browser = await chromium.launch({ headless: true })

  if (process.env.SMOKE_CONSENT === '1') {
    const consentContext = await browser.newContext()
    results.push(await runConsentSmoke(consentContext))
    await consentContext.close()
  }

  const context = await browser.newContext()
  const page = await context.newPage()

  for (const route of PUBLIC_ROUTES) {
    results.push(await runRouteSmoke(page, route))
  }

  results.push(await runSeoMetaSmoke(page))

  if (process.env.SMOKE_RESPONSIVE === '1') {
    results.push(await runResponsiveSmoke(page))
  }

  await browser.close()
  const code = printSummary('Production Smoke', results)
  process.exit(code)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
