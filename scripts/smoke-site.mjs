import {
  API_URL,
  BASE_URL,
  VIEWPORTS,
  assertServerUp,
  isBadImageUrl,
  isCriticalConsoleMessage,
  loadPlaywright,
  printSummary,
  withSmokeHeaders,
} from './smoke-lib.mjs'

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

const SERVICE_DETAIL_ROUTES = [
  {
    path: '/hizmetler/yazilim-gelistirme',
    expectTitle: 'İşletmenize Özel Yazılım Sistemleri Geliştiriyoruz',
    expectSection: 'Neden Woontegra?',
    expectCta: 'Teklif Al',
  },
  {
    path: '/hizmetler/web-tasarim',
    expectTitle: 'Dönüşüm Odaklı Kurumsal Web Siteleri Tasarlıyoruz',
    expectSection: 'Nasıl Çalışıyoruz?',
    expectCta: 'Teklif Al',
  },
  {
    path: '/hizmetler/e-ticaret',
    expectTitle: 'Satış Odaklı E-Ticaret Altyapıları Kuruyoruz',
    expectSection: 'Neden Woontegra?',
    expectCta: 'Teklif Al',
  },
  {
    path: '/hizmetler/saas',
    expectTitle: 'Ölçeklenebilir SaaS Ürünleri Geliştiriyoruz',
    expectSection: 'Nasıl Çalışıyoruz?',
    expectCta: 'Teklif Al',
  },
  {
    path: '/hizmetler/marka-patent-vekilligi',
    expectTitle: 'Markanızı ve Fikri Mülkiyetinizi Koruyoruz',
    expectSection: 'Neden Woontegra?',
    expectCta: 'Teklif Al',
  },
  {
    path: '/hizmetler/oyun-gelistirme',
    expectTitle: 'Mobil ve Web Oyunları Geliştiriyoruz',
    expectSection: 'Nasıl Çalışıyoruz?',
    expectCta: 'Teklif Al',
  },
  {
    path: '/hizmetler/dijital-danismanlik',
    expectTitle: 'Dijital Dönüşüm ve Teknoloji Stratejisi Danışmanlığı',
    expectSection: 'Neden Woontegra?',
    expectCta: 'Teklif Al',
  },
]

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

  const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 45000 })
  if (!response || response.status() >= 400) {
    issues.push(`HTTP ${response?.status() ?? 'no-response'}`)
  }

  const bodyText = await page.locator('body').innerText()
  if (!bodyText.includes(route.expectText)) {
    issues.push(`Beklenen metin bulunamadı: "${route.expectText}"`)
  }

  const badSrcs = await page.$$eval('img[src]', (imgs) =>
    imgs.map((img) => img.getAttribute('src')).filter((src) => !src || src.includes('undefined') || src.includes('null')),
  )
  for (const src of badSrcs) {
    if (isBadImageUrl(src)) imageFailures.push(`Geçersiz img src: ${src}`)
  }

  if (consoleErrors.length) issues.push(...consoleErrors.map((e) => `Console: ${e.slice(0, 200)}`))
  if (imageFailures.length) issues.push(...imageFailures.map((e) => `Görsel: ${e}`))

  return {
    ok: issues.length === 0,
    name: route.path,
    detail: issues.join(' | ') || undefined,
  }
}

async function runServiceDetailSmoke(page, route) {
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

  const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 45000 })
  if (!response || response.status() >= 400) {
    issues.push(`HTTP ${response?.status() ?? 'no-response'}`)
  }

  const bodyText = await page.locator('body').innerText()
  if (!bodyText.includes(route.expectTitle)) {
    issues.push(`Hero başlık yok: "${route.expectTitle}"`)
  }
  if (!bodyText.includes(route.expectSection)) {
    issues.push(`Bölüm başlığı yok: "${route.expectSection}"`)
  }
  if (!bodyText.includes(route.expectCta)) {
    issues.push(`CTA metni yok: "${route.expectCta}"`)
  }

  const h1 = await page.locator('h1').count()
  if (h1 < 1) issues.push('H1 başlık bulunamadı')

  const badSrcs = await page.$$eval('img[src]', (imgs) =>
    imgs.map((img) => img.getAttribute('src')).filter((src) => !src || src.includes('undefined') || src.includes('null')),
  )
  for (const src of badSrcs) {
    if (isBadImageUrl(src)) imageFailures.push(`Geçersiz img src: ${src}`)
  }

  if (consoleErrors.length) issues.push(...consoleErrors.map((e) => `Console: ${e.slice(0, 200)}`))
  if (imageFailures.length) issues.push(...imageFailures.map((e) => `Görsel: ${e}`))

  return {
    ok: issues.length === 0,
    name: route.path,
    detail: issues.join(' | ') || undefined,
  }
}

async function runServiceResponsiveSmoke(page) {
  const issues = []
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    for (const route of SERVICE_DETAIL_ROUTES) {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement
        const header = document.querySelector('header')
        const hero = document.querySelector('h1')
        const headerOverflow = header ? header.scrollWidth > header.clientWidth + 2 : false
        const pageOverflow = doc.scrollWidth > doc.clientWidth + 2
        const heroVisible = hero ? hero.getBoundingClientRect().width > 0 : false
        return { pageOverflow, headerOverflow, heroVisible }
      })
      if (overflow.pageOverflow) issues.push(`${vp.name} ${route.path}: sayfa yatay taşma`)
      if (overflow.headerOverflow) issues.push(`${vp.name} ${route.path}: header taşma`)
      if (!overflow.heroVisible) issues.push(`${vp.name} ${route.path}: hero görünmüyor`)
    }
  }
  return { ok: issues.length === 0, name: 'service-detail-responsive', detail: issues.join(' | ') || undefined }
}

async function runCmsSmoke(page) {
  const issues = []

  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 45000 })
  const headerLinks = await page.locator('header nav a, header nav button').count()
  if (headerLinks < 3) issues.push(`Header menü öğesi az: ${headerLinks}`)

  const footerLegal = await page.locator('footer').innerText()
  for (const label of ['KVKK', 'Gizlilik', 'Çerez']) {
    if (!footerLegal.includes(label)) issues.push(`Footer yasal metin eksik: ${label}`)
  }

  await page.goto(`${BASE_URL}/hizmetler`, { waitUntil: 'networkidle', timeout: 45000 })
  const serviceCards = await page.locator('a:has-text("Detaylı incele"), div:has-text("Detaylı incele")').count()
  if (serviceCards < 4) issues.push(`Hizmet kartları yetersiz: ${serviceCards}`)

  await page.goto(`${BASE_URL}/cozumler`, { waitUntil: 'networkidle', timeout: 45000 })
  const solutionCards = await page.locator('a:has-text("Detaylı incele"), div:has-text("Detaylı incele")').count()
  if (solutionCards < 3) issues.push(`Çözüm kartları yetersiz: ${solutionCards}`)

  await page.goto(`${BASE_URL}/ucretsiz-araclar`, { waitUntil: 'networkidle', timeout: 45000 })
  const toolCards = await page.locator('text=Şifre Kasası').count()
  if (toolCards < 1) issues.push('Ücretsiz araç kartı (Şifre Kasası) bulunamadı')

  return { ok: issues.length === 0, name: 'cms-nav-cards', detail: issues.join(' | ') || undefined }
}

async function runResponsiveSmoke(page) {
  const issues = []
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForSelector('header img[alt="Woontegra"]', { timeout: 12000 }).catch(() => {})
    await page.waitForTimeout(300)
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')
      const navLogo = header?.querySelector('img[alt="Woontegra"]')
      const headerOverflow = header ? header.scrollWidth > header.clientWidth + 2 : false
      const footerOverflow = footer ? footer.scrollWidth > footer.clientWidth + 2 : false
      const pageOverflow = doc.scrollWidth > doc.clientWidth + 2
      const logoHeight = navLogo ? navLogo.getBoundingClientRect().height : 0
      const menuVisible = header
        ? header.querySelector('nav')?.getBoundingClientRect().width > 0 ||
          header.querySelector('button[aria-label="Menü"]') !== null
        : false
      return { pageOverflow, headerOverflow, footerOverflow, logoHeight, menuVisible }
    })
    if (overflow.pageOverflow) issues.push(`${vp.name}: sayfa yatay taşma`)
    if (overflow.headerOverflow) issues.push(`${vp.name}: header taşma`)
    if (overflow.footerOverflow) issues.push(`${vp.name}: footer taşma`)
    if (!overflow.menuVisible) issues.push(`${vp.name}: header menü/hamburger görünmüyor`)
    if (overflow.logoHeight < 8) issues.push(`${vp.name}: navbar logo yüksekliği yok`)
  }
  return { ok: issues.length === 0, name: 'responsive-layout', detail: issues.join(' | ') || undefined }
}

async function runLegalResponsiveSmoke(page) {
  const issues = []
  const legalPaths = [
    '/cerez-politikasi',
    '/kvkk-aydinlatma-metni',
    '/gizlilik-politikasi',
    '/acik-riza-metni',
    '/kullanim-sartlari',
  ]
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    for (const path of legalPaths) {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement
        const tableWrap = document.querySelector('.overflow-x-auto')
        return {
          pageOverflow: doc.scrollWidth > doc.clientWidth + 2,
          hasTableWrap: Boolean(tableWrap),
        }
      })
      if (overflow.pageOverflow) issues.push(`${vp.name} ${path}: sayfa taşma`)
    }
  }
  return { ok: issues.length === 0, name: 'legal-responsive', detail: issues.join(' | ') || undefined }
}

async function runCookiePolicySmoke(page) {
  const issues = []
  await page.goto(`${BASE_URL}/cerez-politikasi`, { waitUntil: 'networkidle', timeout: 45000 })
  const bodyText = await page.locator('body').innerText()
  const hasCookieTable = bodyText.includes('Çerez adı') && bodyText.includes('Saklama süresi')
  const hasEmptyState = bodyText.includes('Çerez listesi henüz oluşturulmadı')
  if (!hasCookieTable && !hasEmptyState) issues.push('Çerez envanteri bölümü görünmüyor')

  const cookiesApi = await fetch(`${API_URL}/api/public/cookies`, { headers: withSmokeHeaders() })
  if (!cookiesApi.ok) {
    issues.push(`GET /api/public/cookies HTTP ${cookiesApi.status}`)
  } else {
    const payload = await cookiesApi.json()
    const cookieCount = Array.isArray(payload?.cookies) ? payload.cookies.length : 0
    if (cookieCount > 0) {
      await page.waitForFunction(
        () => document.body.innerText.includes('Çerez adı') || document.body.innerText.includes('Çerez listesi henüz'),
        { timeout: 12000 },
      ).catch(() => issues.push('Çerez envanteri sayfada yüklenmedi'))
      const tableWrap = page.locator('.overflow-x-auto').first()
      if ((await tableWrap.count()) === 0) {
        issues.push('Çerez verisi varken tablo scroll sarmalayıcısı yok')
      }
    }
  }

  return { ok: issues.length === 0, name: 'cookie-policy-table', detail: issues.join(' | ') || undefined }
}

async function runBlogSmoke(page) {
  const issues = []

  const blogApi = await fetch(`${API_URL}/api/page-content/blogPosts`, { headers: withSmokeHeaders() })
  if (!blogApi.ok) {
    issues.push(`GET /api/page-content/blogPosts HTTP ${blogApi.status}`)
    return { ok: false, name: 'blog-cms', detail: issues.join(' | ') }
  }

  const payload = await blogApi.json()
  const posts = Array.isArray(payload?.data?.posts) ? payload.data.posts : []
  const published = posts.filter((p) => p.active !== false && p.status === 'published' && p.slug)
  const drafts = posts.filter((p) => p.status === 'draft')

  await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle', timeout: 45000 })
  const listText = await page.locator('body').innerText()
  if (!listText.includes('Blog')) issues.push('Blog liste başlığı görünmüyor')

  const draftTitles = drafts.map((d) => d.title).filter(Boolean)
  for (const title of draftTitles) {
    if (listText.includes(title)) issues.push(`Taslak yazı listede görünüyor: ${title}`)
  }
  if (!draftTitles.length && listText.includes('Taslak İçerik Yönetimi Rehberi')) {
    issues.push('Varsayılan taslak yazı listede görünüyor')
  }

  const hasEmptyState = listText.includes('Henüz yayınlanmış yazı yok')
  const detailLink = page.locator('a[href^="/blog/"]').first()
  const hasCards = (await detailLink.count()) > 0

  if (published.length > 0) {
    const sample = published[0]
    await page.goto(`${BASE_URL}/blog/${sample.slug}`, { waitUntil: 'networkidle', timeout: 45000 })
    const detailText = await page.locator('body').innerText()
    if (!detailText.includes(sample.title)) issues.push(`Detay sayfasında başlık yok: ${sample.slug}`)
    if (detailText.includes('Yazı bulunamadı')) issues.push(`Published yazı bulunamadı: ${sample.slug}`)
  } else if (hasCards) {
    const href = await detailLink.getAttribute('href')
    if (href) {
      await page.goto(`${BASE_URL}${href}`, { waitUntil: 'networkidle', timeout: 45000 })
      const detailText = await page.locator('body').innerText()
      if (detailText.includes('Yazı bulunamadı')) issues.push(`Blog detay açılamadı: ${href}`)
    }
  } else if (!hasEmptyState) {
    issues.push('Blog listesi boş ve boş durum mesajı görünmüyor')
  }

  const draftSlug = drafts[0]?.slug || 'taslak-icerik-yonetimi-rehberi'
  await page.goto(`${BASE_URL}/blog/${draftSlug}`, { waitUntil: 'networkidle', timeout: 45000 })
  const draftDetail = await page.locator('body').innerText()
  if (!draftDetail.includes('Yazı bulunamadı')) {
    issues.push(`Taslak yazı public detayda görünüyor: ${draftSlug}`)
  }

  const badSrcs = await page.$$eval('img[src]', (imgs) =>
    imgs.map((img) => img.getAttribute('src')).filter((src) => !src || src.includes('undefined') || src.includes('null')),
  )
  for (const src of badSrcs) {
    if (isBadImageUrl(src)) issues.push(`Blog detay geçersiz img: ${src}`)
  }

  return { ok: issues.length === 0, name: 'blog-cms', detail: issues.join(' | ') || undefined }
}

async function runBlogResponsiveSmoke(page) {
  const issues = []
  const blogApi = await fetch(`${API_URL}/api/page-content/blogPosts`, { headers: withSmokeHeaders() })
  let detailPath = '/blog'
  if (blogApi.ok) {
    const payload = await blogApi.json()
    const published = (payload?.data?.posts ?? []).find((p) => p.active !== false && p.status === 'published' && p.slug)
    if (published?.slug) detailPath = `/blog/${published.slug}`
  }

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    for (const path of ['/blog', detailPath]) {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2)
      if (overflow) issues.push(`${vp.name} ${path}: sayfa taşma`)
    }
  }
  return { ok: issues.length === 0, name: 'blog-responsive', detail: issues.join(' | ') || undefined }
}

async function runScrollToTopSmoke(page) {
  const issues = []
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle', timeout: 45000 })
  await page.evaluate(() => {
    document.body.style.minHeight = '3000px'
    window.scrollTo(0, 1500)
  })
  await page.waitForTimeout(200)
  const before = await page.evaluate(() => window.scrollY)
  if (before < 200) issues.push(`Test öncesi scroll konumu yeterli değil: ${before}`)

  await page.goto(`${BASE_URL}/hakkimizda`, { waitUntil: 'networkidle', timeout: 45000 })
  await page.waitForTimeout(400)
  const after = await page.evaluate(() => window.scrollY)
  if (after > 80) issues.push(`Route değişiminde scroll üstte değil: ${after}`)

  return { ok: issues.length === 0, name: 'scroll-to-top', detail: issues.join(' | ') || undefined }
}

async function runSiteLogoSmoke(page) {
  const issues = []
  const imageFailures = []

  let settingsLogo = '/logo.svg'
  let settingsNavbarHeight = 42
  let settingsFooterHeight = 28
  const settingsApi = await fetch(`${API_URL}/api/settings`, { headers: withSmokeHeaders() })
  if (settingsApi.ok) {
    const data = await settingsApi.json()
    settingsLogo = (data.logo || '/logo.svg').trim()
    settingsNavbarHeight = Number(data.navbarLogoHeight) || 42
    settingsFooterHeight = Number(data.footerLogoHeight) || 28
    if (!settingsLogo) issues.push('settings.logo boş')
    if (!data.navbarLogoHeight) issues.push('settings.navbarLogoHeight boş')
    if (!data.footerLogoHeight) issues.push('settings.footerLogoHeight boş')
    if (!data.mobileLogoHeight) issues.push('settings.mobileLogoHeight boş')
  } else {
    issues.push(`GET /api/settings HTTP ${settingsApi.status}`)
  }

  page.on('response', (response) => {
    if (response.request().resourceType() === 'image' && response.status() >= 400) {
      imageFailures.push(`${response.status()} ${response.url()}`)
    }
  })

  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 45000 })
  await page.waitForSelector('header img[alt="Woontegra"]', { timeout: 15000 }).catch(() => {})

  const navImg = page.locator('header img[alt="Woontegra"]').first()
  const footImg = page.locator('footer img[alt="Woontegra"]').first()

  for (const [label, locator] of [
    ['Navbar', navImg],
    ['Footer', footImg],
  ]) {
    if ((await locator.count()) === 0) {
      issues.push(`${label} logo img yok`)
      continue
    }
    const src = (await locator.getAttribute('src')) || ''
    if (!src.trim()) issues.push(`${label} logo src boş`)
    if (src.includes('/assets/woontegra-logo') || src.includes('woontegra-logo-')) {
      issues.push(`${label} bundle logo kullanıyor: ${src}`)
    }
    const logoPath = settingsLogo.split('?')[0]
    if (src && !src.includes(logoPath)) {
      issues.push(`${label} logo src settings.logo ile uyumsuz: ${src} (beklenen path: ${logoPath})`)
    }
    const box = await locator.boundingBox().catch(() => null)
    if (!box || box.height < 8) {
      issues.push(`${label} logo height boş veya çok küçük`)
    }
  }

  const navBox = await navImg.boundingBox().catch(() => null)
  if (navBox && Math.abs(navBox.height - settingsNavbarHeight) > 6) {
    issues.push(`Navbar logo yüksekliği beklenenden farklı: ${Math.round(navBox.height)}px (api: ${settingsNavbarHeight}px)`)
  }
  const footBox = await footImg.boundingBox().catch(() => null)
  if (footBox && Math.abs(footBox.height - settingsFooterHeight) > 6) {
    issues.push(`Footer logo yüksekliği beklenenden farklı: ${Math.round(footBox.height)}px (api: ${settingsFooterHeight}px)`)
  }

  if (imageFailures.length) issues.push(...imageFailures.map((e) => `Görsel: ${e}`))

  return {
    ok: issues.length === 0,
    name: 'site-logo-unified',
    detail: issues.join(' | ') || `settings.logo=${settingsLogo}`,
  }
}

async function runCompanyInfoPublicSmoke(page) {
  const issues = []

  const companyApi = await fetch(`${API_URL}/api/page-content/legalCompanyInfo`, { headers: withSmokeHeaders() })
  let phone = '0532 317 17 55'
  let email = 'info@woontegra.com'
  if (companyApi.ok) {
    const payload = await companyApi.json()
    phone = payload?.data?.phone?.trim() || phone
    email = payload?.data?.email?.trim() || email
  }

  await page.goto(`${BASE_URL}/kvkk-aydinlatma-metni`, { waitUntil: 'networkidle', timeout: 45000 })
  const kvkkText = await page.locator('body').innerText()
  if (!kvkkText.includes('Unvan')) issues.push('KVKK unvan satırı yok')
  if (!kvkkText.includes(phone)) issues.push(`KVKK telefon görünmüyor: ${phone}`)
  if (!kvkkText.includes(email)) issues.push(`KVKK e-posta görünmüyor: ${email}`)
  if (kvkkText.includes('Lorem ipsum') || kvkkText.includes('örnek@')) {
    issues.push('KVKK placeholder metin tespit edildi')
  }

  await page.goto(`${BASE_URL}/iletisim`, { waitUntil: 'networkidle', timeout: 45000 })
  const contactText = await page.locator('body').innerText()
  if (!contactText.includes(email)) issues.push('İletişim e-posta görünmüyor')
  if (!contactText.includes(phone)) issues.push('İletişim telefon görünmüyor')

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  const footerText = await page.locator('footer').innerText()
  if (!footerText.includes(email)) issues.push('Footer e-posta görünmüyor')

  return { ok: issues.length === 0, name: 'company-info-public', detail: issues.join(' | ') || undefined }
}

async function runLegalFooterLinksSmoke(page) {
  const issues = []
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  for (const href of [
    '/kvkk-aydinlatma-metni',
    '/gizlilik-politikasi',
    '/cerez-politikasi',
    '/acik-riza-metni',
    '/kullanim-sartlari',
  ]) {
    const link = page.locator(`footer a[href="${href}"]`).first()
    if ((await link.count()) === 0) issues.push(`Footer link eksik: ${href}`)
  }
  return { ok: issues.length === 0, name: 'footer-legal-links', detail: issues.join(' | ') || undefined }
}

async function runConsentBannerSmoke(context) {
  const issues = []
  const testPages = [
    { path: '/', label: 'Ana sayfa' },
    { path: '/kvkk-aydinlatma-metni', label: 'Yasal sayfa' },
  ]
  const bannerViewports = VIEWPORTS.filter((vp) =>
    ['mobile-390', 'tablet-768', 'laptop-1200', 'desktop-1440'].includes(vp.name),
  )

  for (const vp of bannerViewports) {
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.removeItem('woontegra_cookie_consent')
    })
    await page.setViewportSize({ width: vp.width, height: vp.height })

    for (const testPage of testPages) {
      await page.goto(`${BASE_URL}${testPage.path}`, { waitUntil: 'networkidle', timeout: 45000 })
      const banner = page.locator('[data-testid="cookie-consent-banner"]')
      if ((await banner.count()) === 0) {
        issues.push(`${vp.name} ${testPage.label}: banner yok`)
        continue
      }

      const metrics = await banner.evaluate((el) => {
        const style = getComputedStyle(el)
        const title = el.querySelector('h2')
        const titleStyle = title ? getComputedStyle(title) : null
        const bg = style.backgroundColor
        const opacity = Number.parseFloat(style.opacity || '1')
        const hasBlur = style.backdropFilter && style.backdropFilter !== 'none'
        const isWhiteBg =
          bg === 'rgb(255, 255, 255)' || bg.includes('255, 255, 255')
        return {
          bg,
          opacity,
          hasBlur,
          isWhiteBg,
          titleColor: titleStyle?.color ?? '',
          titleVisible: title ? title.getBoundingClientRect().height > 0 : false,
        }
      })

      if (metrics.hasBlur) issues.push(`${vp.name} ${testPage.label}: banner blur kullanıyor`)
      if (!metrics.isWhiteBg || metrics.opacity < 0.98) {
        issues.push(`${vp.name} ${testPage.label}: banner opak beyaz değil (${metrics.bg})`)
      }
      if (!metrics.titleVisible) issues.push(`${vp.name} ${testPage.label}: başlık görünmüyor`)
      if (!metrics.titleColor.includes('2, 6, 23') && !metrics.titleColor.includes('15, 23, 42')) {
        issues.push(`${vp.name} ${testPage.label}: başlık kontrastı zayıf (${metrics.titleColor})`)
      }

      const box = await banner.boundingBox()
      if (!box || box.height < 72) issues.push(`${vp.name} ${testPage.label}: banner çok küçük`)
      if (box && box.width > vp.width) issues.push(`${vp.name} ${testPage.label}: banner taşıyor`)
    }

    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 45000 })
    for (const label of ['Tümünü Kabul Et', 'Tümünü Reddet', 'Tercihleri Yönet']) {
      const btn = page.getByRole('button', { name: label })
      if ((await btn.count()) === 0) issues.push(`${vp.name}: "${label}" butonu yok`)
    }
    const policyLink = page.locator('a[href="/cerez-politikasi"]').filter({ hasText: 'Çerez Politikası' })
    if ((await policyLink.count()) === 0) issues.push(`${vp.name}: Çerez Politikası linki yok`)

    await page.close()
  }

  const modalPage = await context.newPage()
  await modalPage.addInitScript(() => localStorage.removeItem('woontegra_cookie_consent'))
  await modalPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 45000 })
  await modalPage.getByRole('button', { name: 'Tercihleri Yönet' }).click()
  const modal = modalPage.locator('[data-testid="cookie-preferences-modal"]')
  if ((await modal.count()) === 0) issues.push('Tercihleri Yönet modalı açılmıyor')
  else {
    const dialogBg = await modalPage
      .locator('[role="dialog"]')
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor)
    if (dialogBg !== 'rgb(255, 255, 255)') {
      issues.push(`Modal arka plan opak beyaz değil: ${dialogBg}`)
    }
  }
  await modalPage.getByRole('button', { name: 'Tercihleri Kaydet' }).click()
  if ((await modalPage.locator('[data-testid="cookie-consent-banner"]').count()) > 0) {
    issues.push('Kaydet sonrası banner kapanmıyor')
  }
  await modalPage.close()

  return { ok: issues.length === 0, name: 'consent-banner-ui', detail: issues.join(' | ') || undefined }
}

const LEGACY_META_PIXEL_ID = '351069957242160'

function urlHasGaMeasurementId(url, measurementId) {
  if (!url || !measurementId) return false
  if (url.includes(measurementId)) return true
  try {
    const parsed = new URL(url)
    const tid = parsed.searchParams.get('tid') || parsed.searchParams.get('id') || ''
    return tid === measurementId
  } catch {
    return false
  }
}

async function runGaTrackingSmoke(context) {
  const issues = []

  let expectedGa = ''
  const trackingApi = await fetch(`${API_URL}/api/settings/tracking`, { headers: withSmokeHeaders() })
  if (trackingApi.ok) {
    const data = await trackingApi.json()
    expectedGa = String(data.googleAnalyticsId ?? '').trim()
    if (!expectedGa) issues.push('tracking API googleAnalyticsId boş')
  } else {
    issues.push(`GET /api/settings/tracking HTTP ${trackingApi.status}`)
  }

  if (!expectedGa) {
    return { ok: false, name: 'ga-measurement-id', detail: issues.join(' | ') || 'googleAnalyticsId yok' }
  }

  const page = await context.newPage()
  const gaRequests = []

  page.on('request', (req) => {
    const url = req.url()
    const postData = req.postData() || ''
    if (url.includes('googletagmanager.com/gtag/js')) {
      gaRequests.push(url)
    }
    if (url.includes('/g/collect') || postData.includes('en=') || postData.includes('tid=')) {
      gaRequests.push(postData ? `${url}?${postData}` : url)
    }
  })

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.evaluate(() => localStorage.removeItem('woontegra_cookie_consent'))
  await page.reload({ waitUntil: 'networkidle', timeout: 45000 })

  const rejectBtn = page.getByRole('button', { name: 'Tümünü Reddet' })
  if ((await rejectBtn.count()) === 0) issues.push('Çerez banner Reddet butonu yok')
  else await rejectBtn.click()
  await page.waitForTimeout(2500)

  const rejectGtag = gaRequests.filter((url) => url.includes('googletagmanager.com/gtag/js'))
  const rejectCollect = gaRequests.filter((url) => url.includes('/g/collect'))
  if (rejectGtag.length > 0) issues.push(`Analytics reddedilince gtag/js yüklendi: ${rejectGtag.length}`)
  if (rejectCollect.length > 0) issues.push(`Analytics reddedilince g/collect gitti: ${rejectCollect.length}`)

  gaRequests.length = 0

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.evaluate(() => {
    localStorage.removeItem('woontegra_cookie_consent')
    localStorage.setItem('woontegra_ga_debug', '1')
  })
  await page.reload({ waitUntil: 'networkidle', timeout: 45000 })
  const acceptBtn = page.getByRole('button', { name: 'Tümünü Kabul Et' })
  if ((await acceptBtn.count()) === 0) issues.push('Çerez banner Kabul butonu yok')
  else await acceptBtn.click()
  await page.waitForTimeout(1500)
  await page.reload({ waitUntil: 'networkidle', timeout: 45000 })
  await page.waitForTimeout(5000)

  const acceptGtag = gaRequests.filter((url) => url.includes('googletagmanager.com/gtag/js'))
  const acceptCollect = gaRequests.filter((url) => url.includes('/g/collect'))

  const gtagHasExpected = acceptGtag.some((url) => url.includes(expectedGa))
  const resourceUrls = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((entry) => entry.name),
  )
  const resourceCollect = resourceUrls.filter((url) => url.includes('/g/collect'))
  const collectHasExpected =
    acceptCollect.some((url) => urlHasGaMeasurementId(url, expectedGa)) ||
    resourceCollect.some((url) => urlHasGaMeasurementId(url, expectedGa))

  const gaState = await page.evaluate(() => ({
    measurementId: String(window.__woontegraGaMeasurementId ?? ''),
    hasGtagScript: Boolean(document.getElementById('woontegra-gtag-js')),
    hasGtag: typeof window.gtag === 'function',
    gtagSrc: document.getElementById('woontegra-gtag-js')?.getAttribute('src') || '',
  }))

  if (!gtagHasExpected) issues.push(`Kabul sonrası gtag/js?id=${expectedGa} yok`)
  if (!gaState.hasGtagScript) issues.push('Kabul sonrası woontegra-gtag-js script yok')
  if (!gaState.gtagSrc.includes(expectedGa)) {
    issues.push(`gtag/js src beklenen ID içermiyor: ${gaState.gtagSrc || 'yok'}`)
  }
  if (!collectHasExpected) {
    issues.push(
      `Kabul sonrası g/collect tid=${expectedGa} yok (req=${acceptCollect.length}, perf=${resourceCollect.length})`,
    )
  }
  if (gaState.measurementId && gaState.measurementId !== expectedGa) {
    issues.push(`Aktif GA ID uyuşmuyor: ${gaState.measurementId} (beklenen ${expectedGa})`)
  }
  if (!gaState.measurementId) issues.push('window.__woontegraGaMeasurementId boş')

  const manualResult = await page.evaluate(() => {
    if (typeof window.__woontegraSendGaManualTestEvent !== 'function') {
      return { sent: false, inDataLayer: false }
    }
    const sent = window.__woontegraSendGaManualTestEvent()
    const inDataLayer = (window.dataLayer || []).some((entry) => {
      try {
        return JSON.stringify(entry).includes('manual_test_event')
      } catch {
        return false
      }
    })
    return { sent, inDataLayer }
  })
  if (!manualResult.sent) issues.push('manual_test_event gönderilemedi')
  if (!manualResult.inDataLayer) issues.push('manual_test_event dataLayer kuyruğunda yok')

  await page.close()

  return {
    ok: issues.length === 0,
    name: 'ga-measurement-id',
    detail:
      issues.join(' | ') ||
      `API=${expectedGa}, gtag=${gtagHasExpected ? 'ok' : 'yok'}, collect=${collectHasExpected ? 'ok' : 'yok'}`,
  }
}

async function runMetaPixelTrackingSmoke(context) {
  const issues = []

  let expectedPixel = ''
  const trackingApi = await fetch(`${API_URL}/api/settings/tracking`, { headers: withSmokeHeaders() })
  if (trackingApi.ok) {
    const data = await trackingApi.json()
    expectedPixel = String(data.metaPixelId ?? '').trim()
    if (!expectedPixel) issues.push('tracking API metaPixelId boş')
  } else {
    issues.push(`GET /api/settings/tracking HTTP ${trackingApi.status}`)
  }

  if (!expectedPixel) {
    return { ok: false, name: 'meta-pixel-id', detail: issues.join(' | ') || 'metaPixelId yok' }
  }

  const page = await context.newPage()
  const metaRequests = []

  page.on('request', (req) => {
    const url = req.url()
    if (
      url.includes('fbevents.js') ||
      url.includes('connect.facebook.net') ||
      url.includes('facebook.com/tr')
    ) {
      metaRequests.push(url)
    }
  })

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.evaluate(() => localStorage.removeItem('woontegra_cookie_consent'))
  await page.reload({ waitUntil: 'networkidle', timeout: 45000 })
  await page.evaluate(() => {
    localStorage.setItem(
      'woontegra_cookie_consent',
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        updatedAt: new Date().toISOString(),
      }),
    )
  })
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const rejectMeta = metaRequests.length
  if (rejectMeta > 0) issues.push(`Marketing reddedilince Meta isteği: ${rejectMeta}`)

  metaRequests.length = 0

  await page.evaluate(() => {
    localStorage.setItem(
      'woontegra_cookie_consent',
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        updatedAt: new Date().toISOString(),
      }),
    )
  })
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(4000)

  const pixelState = await page.evaluate(
    ({ expected, legacy }) => {
      const resourceUrls = performance.getEntriesByType('resource').map((entry) => entry.name)
      const fbUrls = [
        ...resourceUrls,
        ...Array.from(document.querySelectorAll('script[src*="facebook"]')).map((node) => node.src),
      ]
      const hasLegacy = fbUrls.some((url) => url.includes(legacy))
      const hasExpected = fbUrls.some((url) => url.includes(expected))
      const hasScript = Boolean(document.getElementById('woontegra-meta-pixel'))
      const hasFbq = typeof window.fbq === 'function'
      const initFromQueue = (() => {
        const queue = window.fbq?.queue
        if (!Array.isArray(queue)) return ''
        const initCall = queue.find((args) => Array.isArray(args) && args[0] === 'init')
        return initCall ? String(initCall[1] ?? '') : ''
      })()
      const initFromWindow = String(window.__woontegraMetaPixelId ?? '')
      return { hasLegacy, hasExpected, hasScript, hasFbq, initFromQueue, initFromWindow, fbUrls }
    },
    { expected: expectedPixel, legacy: LEGACY_META_PIXEL_ID },
  )

  const hasLegacy =
    metaRequests.some((url) => url.includes(LEGACY_META_PIXEL_ID)) || pixelState.hasLegacy
  const hasExpected =
    metaRequests.some((url) => url.includes(expectedPixel)) || pixelState.hasExpected

  if (hasLegacy) issues.push(`Eski pixel ID tespit edildi: ${LEGACY_META_PIXEL_ID}`)
  if (pixelState.initFromQueue === LEGACY_META_PIXEL_ID) {
    issues.push(`fbq init eski pixel ID kullanıyor: ${LEGACY_META_PIXEL_ID}`)
  }
  const activePixel = pixelState.initFromWindow || pixelState.initFromQueue
  if (activePixel === LEGACY_META_PIXEL_ID) {
    issues.push(`Aktif pixel eski ID: ${LEGACY_META_PIXEL_ID}`)
  }
  if (activePixel && activePixel !== expectedPixel) {
    issues.push(`Aktif pixel beklenen ID ile uyuşmuyor: ${activePixel}`)
  }
  if (!pixelState.hasScript) {
    issues.push('Marketing kabul sonrası Meta pixel script yüklenmedi')
  }
  if (pixelState.hasScript && !pixelState.hasFbq) {
    issues.push('fbevents yüklendi ama fbq hazır değil')
  }
  if (!activePixel || activePixel !== expectedPixel) {
    issues.push(`Marketing kabul sonrası beklenen pixel yok: ${expectedPixel}`)
  }

  await page.close()

  return {
    ok: issues.length === 0,
    name: 'meta-pixel-id',
    detail:
      issues.join(' | ') ||
      `tracking API=${expectedPixel}, network=${hasExpected ? 'ok' : 'fbq'}, rejectMeta=${rejectMeta}`,
  }
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

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.evaluate(() => localStorage.removeItem('woontegra_cookie_consent'))
  await page.reload({ waitUntil: 'networkidle', timeout: 45000 })
  await page.evaluate(() => {
    localStorage.setItem(
      'woontegra_cookie_consent',
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        updatedAt: new Date().toISOString(),
      }),
    )
  })
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const rejectGa = gaRequests.length
  const rejectMeta = metaScripts.length

  gaRequests.length = 0
  metaScripts.length = 0

  await page.evaluate(() => {
    localStorage.setItem(
      'woontegra_cookie_consent',
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        updatedAt: new Date().toISOString(),
      }),
    )
  })
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)

  const acceptGa = gaRequests.length
  const acceptMeta = metaScripts.length

  const issues = []
  if (rejectGa > 0) issues.push('Reddet sonrası GA isteği gitti')
  if (rejectMeta > 0) issues.push('Reddet sonrası Meta script yüklendi')

  await page.close()

  return {
    ok: issues.length === 0,
    name: 'consent-gating',
    detail: issues.length
      ? issues.join(' | ')
      : `Reddet GA=${rejectGa} Meta=${rejectMeta}; Kabul GA=${acceptGa} Meta=${acceptMeta} (GA/Meta ID yoksa 0 normal)`,
  }
}

async function main() {
  await assertServerUp(BASE_URL)
  const { chromium } = loadPlaywright()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ extraHTTPHeaders: withSmokeHeaders() })
  const page = await context.newPage()

  const results = []
  for (const route of PUBLIC_ROUTES) {
    results.push(await runRouteSmoke(page, route))
  }

  for (const route of SERVICE_DETAIL_ROUTES) {
    const detailPage = await context.newPage()
    results.push(await runServiceDetailSmoke(detailPage, route))
    await detailPage.close()
  }

  results.push(await runCmsSmoke(page))
  results.push(await runCookiePolicySmoke(page))
  results.push(await runLegalFooterLinksSmoke(page))
  results.push(await runScrollToTopSmoke(page))
  results.push(await runSiteLogoSmoke(page))
  results.push(await runConsentBannerSmoke(context))
  results.push(await runCompanyInfoPublicSmoke(page))
  results.push(await runBlogSmoke(page))

  if (process.env.SMOKE_RESPONSIVE === '1') {
    results.push(await runResponsiveSmoke(page))
    results.push(await runLegalResponsiveSmoke(page))
    results.push(await runBlogResponsiveSmoke(page))
    results.push(await runServiceResponsiveSmoke(page))
  }

  if (process.env.SMOKE_CONSENT === '1') {
    results.push(await runConsentSmoke(context))
    results.push(await runGaTrackingSmoke(context))
    results.push(await runMetaPixelTrackingSmoke(context))
  }

  await browser.close()
  const code = printSummary('Public Site Smoke', results)
  process.exit(code)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
