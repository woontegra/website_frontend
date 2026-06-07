import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const commits = execSync('git rev-list --all -- public/images', { cwd: root, encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean)

const broken = [
  'ana-sayfa-hero.jpg',
  'bilirkisi-hesap-ekran.jpg',
  'cozumler-sistem.jpg',
  'cta-bg.jpg',
  'datca-tropikal-urunler.jpg',
  'dijital-danismanlik.jpg',
  'e-ticaret-sistemi.jpg',
  'hakkimizda-hero.jpg',
  'marka-bilirkisi.jpg',
  'marka-datca.jpg',
  'marka-mercan.jpg',
  'marka-optimoon.jpg',
  'marka-patent-belge.jpg',
  'mercan-danismanlik.jpg',
  'optimoon-urunler.jpg',
  'oyun-sahne.jpg',
  'saas-dashboard.jpg',
  'service-1.jpg',
  'service-2.jpg',
  'service-3.jpg',
  'service-3.jpeg',
  'web-tasarim-mockup.jpg',
  'woontegra-sifre-kasasi-ekran.png',
  'yazilim-dashboard.jpg',
  'blog/api-tasarimi.jpg',
  'blog/dijital-donusum.jpg',
  'blog/dijital-pazarlama.jpg',
  'blog/e-ticaret-optimizasyon.jpg',
  'blog/marka-tescil.jpg',
  'blog/saas-rehber.jpg',
  'blog/varsayilan.jpg',
  'blog/web-teknolojileri.jpg',
]

function detect(buf) {
  if (buf.length < 12) return 'tiny'
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpeg'
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'png'
  if (buf.toString('utf8', 0, 20).startsWith('data:image/svg')) return 'svg-text'
  return 'other'
}

const report = []

for (const rel of broken) {
  let best = null
  for (const commit of commits) {
    try {
      const buf = execSync(`git show ${commit}:public/images/${rel}`, { cwd: root, encoding: 'buffer', stdio: ['pipe', 'pipe', 'pipe'] })
      const fmt = detect(buf)
      const healthy = buf.length > 1024 && (fmt === 'jpeg' || fmt === 'png')
      if (healthy && (!best || buf.length > best.size)) {
        best = { commit, size: buf.length, fmt }
      }
    } catch {
      /* missing in commit */
    }
  }
  report.push({ rel, best })
}

console.log('=== Git geçmişi taraması (sağlam binary) ===\n')
for (const row of report) {
  if (row.best) {
    console.log(`✓ ${row.rel} → commit ${row.best.commit.slice(0, 7)} (${row.best.size} B, ${row.best.fmt})`)
  } else {
    console.log(`✗ ${row.rel} → Git geçmişinde sağlam binary YOK`)
  }
}

const restorable = report.filter((r) => r.best)
console.log(`\nGeri yüklenebilir: ${restorable.length}/${report.length}`)
