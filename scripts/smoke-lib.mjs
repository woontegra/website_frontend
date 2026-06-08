import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

export const BASE_URL = (process.env.SMOKE_BASE_URL || process.env.BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '')
export const API_URL = (process.env.SMOKE_API_URL || process.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

/** Backend yalnızca NODE_ENV !== production && SMOKE_TEST_MODE=true iken bypass uygular */
export const SMOKE_TEST_HEADERS = { 'x-smoke-test': 'true' }

export function withSmokeHeaders(headers = {}) {
  return { ...SMOKE_TEST_HEADERS, ...headers }
}

export function loadPlaywright() {
  const candidates = [
    join(scriptDir, '../../backend/node_modules/playwright'),
    join(scriptDir, '../node_modules/playwright'),
  ]
  for (const candidate of candidates) {
    try {
      return require(candidate)
    } catch {
      // try next
    }
  }
  throw new Error('Playwright bulunamadı. backend klasöründe npm install çalıştırın.')
}

export async function assertServerUp(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    return res.ok || res.status === 404
  } catch (err) {
    throw new Error(`${url} erişilemiyor. Önce "npm run preview" veya "npm run dev" başlatın. (${err.message})`)
  }
}

export function isCriticalConsoleMessage(text) {
  const lower = text.toLowerCase()
  if (lower.includes('favicon')) return false
  if (lower.includes('devtools')) return false
  if (lower.includes('vite')) return false
  if (lower.includes('download the react devtools')) return false
  if (lower.includes('failed to load resource') && lower.includes('favicon')) return false
  if (lower.includes('failed to load resource') && lower.includes('err_failed')) return false
  if (lower.includes('net::err_failed')) return false
  if (lower.includes('networkerror')) return false
  return (
    lower.includes('uncaught') ||
    lower.includes('typeerror') ||
    lower.includes('referenceerror') ||
    lower.includes('syntaxerror') ||
    lower.includes('chunk load') ||
    lower.includes('hydration') ||
    (lower.includes('failed to load resource') && !lower.includes('analytics'))
  )
}

export function isBadImageUrl(url) {
  if (!url || url === 'undefined' || url === 'null') return true
  const u = url.trim()
  if (!u || u === 'about:blank' || u.startsWith('data:')) return false
  return u.includes('undefined') || u.includes('null')
}

export function printSummary(title, results) {
  const failed = results.filter((r) => !r.ok)
  console.log(`\n=== ${title} ===`)
  for (const r of results) {
    const mark = r.ok ? '✓' : '✗'
    console.log(`${mark} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`)
  }
  console.log(`\nToplam: ${results.length}, Başarılı: ${results.length - failed.length}, Başarısız: ${failed.length}`)
  return failed.length === 0 ? 0 : 1
}

export const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'laptop-1200', width: 1200, height: 900 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'wide-1920', width: 1920, height: 1080 },
]
