import {
  API_URL,
  BASE_URL,
  assertServerUp,
  isCriticalConsoleMessage,
  loadPlaywright,
  printSummary,
  withSmokeHeaders,
} from './smoke-lib.mjs'

const ADMIN_EMAIL = process.env.SMOKE_ADMIN_EMAIL || process.env.ADMIN_SEED_EMAIL || 'info@woontegra.com'
const ADMIN_PASSWORD = process.env.SMOKE_ADMIN_PASSWORD || process.env.ADMIN_SEED_PASSWORD || 'Admin123!'

const ADMIN_ROUTES = [
  '/admin',
  '/admin/icerik-duzenle',
  '/admin/menuler',
  '/admin/footer',
  '/admin/hizmet-kartlari',
  '/admin/cozum-kartlari',
  '/admin/ucretsiz-arac-kartlari',
  '/admin/blog-yazilari',
  '/admin/yasal-sayfalar',
  '/admin/firma-bilgileri',
  '/admin/ayarlar',
  '/admin/mesajlar',
  '/admin/teklifler',
]

const PUBLIC_API_ENDPOINTS = ['/api/health']
const CMS_API_ENDPOINTS = [
  '/api/page-content/menuItems',
  '/api/page-content/footerGroups',
  '/api/page-content/serviceCards',
  '/api/page-content/solutionCards',
  '/api/page-content/freeToolCards',
  '/api/page-content/legalCompanyInfo',
  '/api/page-content/legalKvkkPage',
  '/api/page-content/legalPrivacyPage',
  '/api/page-content/legalCookiePage',
  '/api/page-content/legalConsentPage',
  '/api/page-content/legalTermsPage',
  '/api/page-content/blogPosts',
]

async function loginAdmin(page, token) {
  await page.goto(`${BASE_URL}/admin/giris`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.evaluate((jwt) => {
    localStorage.setItem('woontegra_token', jwt)
  }, token)
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle', timeout: 45000 })
  if (page.url().includes('/admin/giris')) {
    throw new Error('Token ile admin oturumu açılamadı')
  }
}

async function runAdminRouteSmoke(page, path) {
  const consoleErrors = []
  page.on('console', (msg) => {
    const text = msg.text()
    if (msg.type() !== 'error') return
    if (text.includes('Failed to fetch')) return
    if (isCriticalConsoleMessage(text)) consoleErrors.push(text)
  })

  const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle', timeout: 45000 })
  const onLogin = page.url().includes('/admin/giris')
  const issues = []
  if (onLogin) issues.push('Login sayfasına yönlendi')
  if (!response || response.status() >= 400) issues.push(`HTTP ${response?.status() ?? 'no-response'}`)
  if (consoleErrors.length) issues.push(...consoleErrors.map((e) => `Console: ${e.slice(0, 160)}`))

  return { ok: issues.length === 0, name: path, detail: issues.join(' | ') || undefined }
}

async function fetchWithRetry(url, init = {}, retries = 3) {
  const requestInit = {
    ...init,
    headers: withSmokeHeaders(init.headers),
    signal: AbortSignal.timeout(10000),
  }
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const res = await fetch(url, requestInit)
    if (res.status !== 429) return res
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)))
  }
  return fetch(url, requestInit)
}

async function runApiSmoke(token) {
  const results = []
  for (const endpoint of PUBLIC_API_ENDPOINTS) {
    try {
      const res = await fetchWithRetry(`${API_URL}${endpoint}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      results.push({
        ok: res.ok,
        name: `GET ${endpoint}`,
        detail: res.ok ? undefined : `HTTP ${res.status}`,
      })
    } catch (err) {
      results.push({ ok: false, name: `GET ${endpoint}`, detail: err.message })
    }
  }
  return results
}

async function runBrandLogoSettingsSmoke(page) {
  const issues = []
  await page.goto(`${BASE_URL}/admin/ayarlar`, { waitUntil: 'networkidle', timeout: 45000 })
  const bodyText = await page.locator('main').innerText()
  if (!bodyText.includes('Marka & Görsel')) issues.push('Marka & Görsel bölümü yok')
  if (!bodyText.includes('Site Logosu')) issues.push('Site Logosu alanı yok')
  if (!bodyText.includes('Navbar ve footer')) issues.push('Logo hint metni yok')
  if (!bodyText.includes('Navbar Logo Yüksekliği')) issues.push('Navbar Logo Yüksekliği alanı yok')
  if (!bodyText.includes('Footer Logo Yüksekliği')) issues.push('Footer Logo Yüksekliği alanı yok')
  if (!bodyText.includes('Mobil Logo Yüksekliği')) issues.push('Mobil Logo Yüksekliği alanı yok')
  if (!bodyText.includes('Genişlik otomatik korunur')) issues.push('Logo boyut açıklama metni yok')

  for (const id of ['navbarLogoHeight', 'footerLogoHeight', 'mobileLogoHeight']) {
    const input = page.locator(`input#${id}`)
    if ((await input.count()) === 0) issues.push(`${id} input render olmuyor`)
    else {
      const value = await input.inputValue()
      if (!value.trim()) issues.push(`${id} değeri boş`)
    }
  }

  const logoPathEl = page.locator('p.font-mono').filter({ hasText: /\/logo\.(svg|png|jpg|jpeg|webp)/i }).first()
  if ((await logoPathEl.count()) === 0) {
    issues.push('settings.logo path görünmüyor')
  } else {
    const pathText = (await logoPathEl.textContent())?.trim() || ''
    if (!pathText.startsWith('/logo.')) issues.push(`Beklenmeyen logo path: ${pathText}`)
  }

  const previewImg = page.locator('img[alt="Site Logosu"]').first()
  if ((await previewImg.count()) === 0) issues.push('Logo önizleme img yok')
  else {
    const src = (await previewImg.getAttribute('src')) || ''
    if (!src.trim()) issues.push('Logo önizleme src boş')
    if (src.includes('/assets/woontegra-logo')) issues.push(`Admin preview bundle logo: ${src}`)
  }

  return { ok: issues.length === 0, name: 'brand-logo-settings', detail: issues.join(' | ') || undefined }
}

async function runCompanyInfoSmoke(page) {
  const issues = []
  await page.goto(`${BASE_URL}/admin/firma-bilgileri`, { waitUntil: 'networkidle', timeout: 45000 })
  const bodyText = await page.locator('main').innerText()
  if (!bodyText.includes('Firma Bilgileri')) issues.push('Sayfa başlığı görünmüyor')
  if (!bodyText.includes('Telefon')) issues.push('Telefon alanı yok')
  if (!bodyText.includes('E-posta')) issues.push('E-posta alanı yok')
  if (!bodyText.includes('Adres')) issues.push('Adres alanı yok')
  if (!bodyText.includes('Firma Bilgilerini Kaydet')) issues.push('Kaydet butonu yok')
  return { ok: issues.length === 0, name: 'company-info-page', detail: issues.join(' | ') || undefined }
}

async function runLegalPagesEditorSmoke(page) {
  const issues = []
  await page.goto(`${BASE_URL}/admin/yasal-sayfalar`, { waitUntil: 'networkidle', timeout: 45000 })
  const bodyText = await page.locator('main').innerText()

  for (const tab of ['KVKK Aydınlatma', 'Gizlilik Politikası', 'Çerez Politikası']) {
    if (!bodyText.includes(tab)) issues.push(`Sekme yok: ${tab}`)
  }

  if (!bodyText.includes('Bölümler')) issues.push('Bölüm listesi başlığı yok')
  if (!bodyText.includes('Bölüm Ekle')) issues.push('Bölüm Ekle butonu yok')
  if (!bodyText.includes('Düzenlemek için soldan bir bölüm seçin')) {
    issues.push('Seçili bölüm boş durum mesajı yok')
  }
  if (!bodyText.includes('Sayfa Ayarları')) issues.push('Sayfa Ayarları kartı yok')

  const saveBtn = page.getByRole('button', { name: /^Kaydet$/ })
  const previewLink = page.locator('a:has-text("Önizle")').first()
  if ((await saveBtn.count()) === 0) issues.push('Kaydet butonu yok')
  if ((await previewLink.count()) === 0) issues.push('Önizle butonu yok')

  const companyLink = page.locator('a[href="/admin/firma-bilgileri"]')
  if ((await companyLink.count()) === 0) issues.push('Firma Bilgileri yönlendirme linki yok')

  const sectionBodyAreas = await page.locator('textarea[rows="8"]').count()
  if (sectionBodyAreas > 1) issues.push(`Birden fazla bölüm gövdesi açık: ${sectionBodyAreas}`)

  const firstSection = page.locator('aside ul li button').first()
  if ((await firstSection.count()) > 0) {
    await firstSection.click()
    await page.waitForTimeout(300)
    const editorText = await page.locator('main').innerText()
    if (!editorText.includes('Bölüm Düzenle')) {
      issues.push('Seçili bölüm editörü açılmadı')
    }
    const afterSelect = await page.locator('textarea[rows="8"]').count()
    const hasSpecialHint =
      editorText.includes('otomatik oluşturulur') || editorText.includes('otomatik beslenir')
    if (afterSelect > 1) issues.push(`Birden fazla bölüm gövdesi açık: ${afterSelect}`)
    if (afterSelect === 0 && !hasSpecialHint) {
      issues.push('Seçili bölüm editöründe içerik veya özel tür açıklaması yok')
    }
  }

  return {
    ok: issues.length === 0,
    name: 'legal-pages-editor',
    detail: issues.join(' | ') || undefined,
  }
}

async function runBlogContentEditSmoke(page) {
  const issues = []
  await page.goto(`${BASE_URL}/admin/icerik-duzenle`, { waitUntil: 'networkidle', timeout: 45000 })
  const blogButton = page.getByRole('button', { name: 'Blog', exact: true })
  if ((await blogButton.count()) === 0) {
    issues.push('İçerik Düzenle Blog sekmesi bulunamadı')
  } else {
    await blogButton.click()
    const notice = page.locator('a[href="/admin/blog-yazilari"]')
    try {
      await notice.waitFor({ state: 'visible', timeout: 10000 })
    } catch {
      issues.push('Blog yönetim linki/notu görünmüyor')
    }
    const bodyText = await page.locator('main').innerText()
    if (bodyText.includes('Blog Yazıları (') || bodyText.match(/Blog Yazıları\s*\n.*yazı/)) {
      issues.push('Eski blog post editörü hâlâ görünüyor')
    }
  }
  return { ok: issues.length === 0, name: 'blog-content-edit-notice', detail: issues.join(' | ') || undefined }
}

async function fetchAdminToken() {
  const res = await fetchWithRetry(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const data = await res.json()
  if (!res.ok || !data.success || !data.token) {
    throw new Error(`Admin login API başarısız: ${data.message || res.status}`)
  }
  return data.token
}

async function main() {
  await assertServerUp(BASE_URL)
  await assertServerUp(`${API_URL}/api/health`).catch(async () => {
    await assertServerUp(API_URL)
  })

  const results = []
  results.push(...(await runApiSmoke(null)))

  let token = null
  try {
    token = await fetchAdminToken()
    results.push({ ok: true, name: 'POST /api/auth/login', detail: undefined })
  } catch (err) {
    results.push({ ok: false, name: 'POST /api/auth/login', detail: err.message })
  }

  if (token) {
    const settingsRes = await fetchWithRetry(`${API_URL}/api/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.push({
      ok: settingsRes.ok,
      name: 'GET /api/settings (admin)',
      detail: settingsRes.ok ? undefined : `HTTP ${settingsRes.status}`,
    })

    for (const endpoint of CMS_API_ENDPOINTS) {
      const res = await fetchWithRetry(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      results.push({
        ok: res.ok,
        name: `GET ${endpoint}`,
        detail: res.ok ? undefined : `HTTP ${res.status}`,
      })
    }
  }

  const { chromium } = loadPlaywright()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ extraHTTPHeaders: withSmokeHeaders() })
  const page = await context.newPage()

  try {
    if (!token) throw new Error('API token alınamadığı için UI testi atlandı')
    await loginAdmin(page, token)
    results.push({ ok: true, name: 'Admin UI session', detail: undefined })
    for (const route of ADMIN_ROUTES) {
      results.push(await runAdminRouteSmoke(page, route))
    }
    results.push(await runBrandLogoSettingsSmoke(page))
    results.push(await runCompanyInfoSmoke(page))
    results.push(await runLegalPagesEditorSmoke(page))
    results.push(await runBlogContentEditSmoke(page))
  } catch (err) {
    results.push({ ok: false, name: 'Admin UI login', detail: err.message })
  }

  await browser.close()
  const code = printSummary('Admin Smoke', results)
  process.exit(code)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
