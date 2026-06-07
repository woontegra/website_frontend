/**
 * public/images dosya bütünlüğü denetimi.
 * Kullanım: node scripts/check-image-integrity.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(rootDir, 'public', 'images')
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function detectFormat(buffer) {
  if (buffer.length < 12) return 'unknown'
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpeg'
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'png'
  }
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp'
  }
  if (buffer.toString('ascii', 0, 3) === 'GIF') return 'gif'
  if (buffer.toString('utf8', 0, Math.min(80, buffer.length)).includes('<!DOCTYPE')) return 'html'
  if (buffer.toString('utf8', 0, Math.min(80, buffer.length)).includes('<html')) return 'html'
  if (buffer.toString('utf8', 0, Math.min(20, buffer.length)).startsWith('version ')) return 'git-lfs-pointer'
  if (buffer.toString('utf8', 0, Math.min(40, buffer.length)).startsWith('data:image/svg+xml')) return 'svg-data-uri-text'
  return 'unknown'
}

function extToExpected(ext) {
  const e = ext.toLowerCase()
  if (e === '.jpg' || e === '.jpeg') return 'jpeg'
  if (e === '.png') return 'png'
  if (e === '.webp') return 'webp'
  return 'unknown'
}

function walkImages(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walkImages(full))
    else if (IMAGE_EXT.has(extname(entry.name).toLowerCase())) files.push(full)
  }
  return files
}

function collectReferencedPaths() {
  const sources = [
    join(rootDir, 'src', 'data', 'siteImages.ts'),
    join(rootDir, 'src', 'data', 'publicImageCatalog.ts'),
    join(rootDir, 'src', 'data', 'publicImages.ts'),
    join(rootDir, 'src', 'data', 'allPagesData.ts'),
    join(rootDir, 'src', 'data', 'defaultHomeData.ts'),
  ]
  const pattern = /['"](\/images\/[^'"]+)['"]/g
  const paths = new Map()
  for (const filePath of sources) {
    if (!existsSync(filePath)) continue
    const source = readFileSync(filePath, 'utf8')
    for (const match of source.matchAll(pattern)) {
      paths.set(match[1], (paths.get(match[1]) ?? 0) + 1)
    }
  }
  return paths
}

const files = walkImages(imagesDir)
const results = []
const byRelPath = new Map()

for (const filePath of files) {
  const rel = '/' + relative(join(rootDir, 'public'), filePath).replace(/\\/g, '/')
  const stat = statSync(filePath)
  const ext = extname(filePath).toLowerCase()
  const buffer = readFileSync(filePath)
  const detected = detectFormat(buffer)
  const expected = extToExpected(ext)
  const formatMatch = detected === expected
  const readable = ['jpeg', 'png', 'webp'].includes(detected) && buffer.length > 1024
  const issues = []

  if (stat.size === 0) issues.push('zero-bytes')
  if (stat.size > 0 && stat.size < 1024) issues.push('suspiciously-small')
  if (!readable) issues.push('not-readable-image')
  if (!formatMatch && detected !== 'unknown') issues.push(`format-mismatch:${detected}-not-${expected}`)
  if (detected === 'html') issues.push('html-not-image')
  if (detected === 'git-lfs-pointer') issues.push('git-lfs-pointer')
  if (detected === 'svg-data-uri-text') issues.push('svg-data-uri-saved-as-image')
  if (detected === 'unknown') issues.push('unknown-format')

  const row = {
    rel,
    file: relative(imagesDir, filePath).replace(/\\/g, '/'),
    bytes: stat.size,
    ext: ext.slice(1),
    detected,
    formatMatch,
    readable,
    healthy: readable && formatMatch,
    issues,
  }
  results.push(row)
  byRelPath.set(rel, row)
}

const healthy = results.filter((r) => r.healthy)
const broken = results.filter((r) => !r.healthy)
const formatMismatches = results.filter((r) => r.issues.some((i) => i.startsWith('format-mismatch')))

const referenced = collectReferencedPaths()
const refReport = []
for (const [path, count] of referenced) {
  const relFile = path.replace(/^\/images\//, '')
  const diskPath = join(imagesDir, ...relFile.split('/'))
  const row = byRelPath.get(path)
  refReport.push({
    path,
    refs: count,
    exists: existsSync(diskPath),
    healthy: row?.healthy ?? false,
    bytes: row?.bytes ?? null,
    detected: row?.detected ?? null,
    issues: row?.issues ?? (existsSync(diskPath) ? [] : ['missing-file']),
  })
}

const brokenRefs = refReport.filter((r) => !r.healthy || !r.exists)
const healthyList = healthy.map((r) => `${r.rel} (${r.bytes} B, ${r.detected})`)
const brokenList = broken.map(
  (r) => `${r.rel} — ${r.bytes} B, detected=${r.detected}, issues=[${r.issues.join(', ')}]`,
)

console.log('=== Woontegra Görsel Bütünlük Raporu ===\n')
console.log(`Kontrol edilen: ${results.length} dosya`)
console.log(`Sağlam: ${healthy.length}`)
console.log(`Bozuk/şüpheli: ${broken.length}`)
console.log(`Uzantı-format uyuşmazlığı: ${formatMismatches.length}`)
console.log(`Kodda referans verilen path: ${referenced.size}`)
console.log(`Referans → bozuk/eksik: ${brokenRefs.length}`)

console.log('\n--- SAĞLAM DOSYALAR ---')
for (const line of healthyList) console.log(`  ✓ ${line}`)

console.log('\n--- BOZUK / AÇILAMAYAN DOSYALAR ---')
for (const line of brokenList) console.log(`  ✗ ${line}`)

if (formatMismatches.length) {
  console.log('\n--- UZANTI-FORMAT UYUŞMAZLIĞI ---')
  for (const r of formatMismatches) {
    console.log(`  ! ${r.rel}: uzantı .${r.ext}, gerçek format ${r.detected}`)
  }
}

console.log('\n--- EKSİK DOSYA (kodda var, diskte yok) ---')
for (const r of refReport.filter((x) => !x.exists)) {
  console.log(`  ? ${r.path}`)
}

console.log('\n--- PANEL/KOD PATH → BOZUK DOSYA ---')
for (const r of brokenRefs) {
  console.log(`  → ${r.path} (${r.refs} ref) — ${r.exists ? r.issues.join(', ') : 'missing-file'}`)
}

console.log('\n--- SAĞLAM ALTERNATİF ÖNERİLERİ ---')
const suggestions = {
  '/images/service-3.jpg': ['/images/service-2.jpg', '/images/yazilim.png', '/images/hero-dashboard.jpg'],
  '/images/ana-sayfa-hero.jpg': ['/images/hero-dashboard.jpg', '/images/about-hero.png'],
  '/images/yazilim-dashboard.jpg': ['/images/yazilim.png', '/images/hero-dashboard.jpg'],
  '/images/e-ticaret-sistemi.jpg': ['/images/e-ticaret.jpeg'],
  '/images/web-tasarim-mockup.jpg': ['/images/web-tasarim.png'],
  '/images/cozumler-sistem.jpg': ['/images/hero-dashboard.jpg', '/images/yazilim.png'],
  '/images/woontegra-sifre-kasasi-ekran.png': ['/images/hero-dashboard.jpg'],
}
for (const r of brokenRefs) {
  const alts = (suggestions[r.path] ?? healthy.map((h) => h.rel).slice(0, 3)).filter((p) => byRelPath.get(p)?.healthy)
  if (alts.length) console.log(`  ${r.path} → öneri: ${alts.join(', ')}`)
}

if (broken.length > 0 || brokenRefs.some((r) => !r.exists)) {
  process.exit(1)
}
