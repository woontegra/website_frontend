import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(rootDir, 'public')
const errors = []

const sitemapPath = join(publicDir, 'sitemap.xml')
const robotsPath = join(publicDir, 'robots.txt')

if (!existsSync(sitemapPath)) {
  errors.push('public/sitemap.xml bulunamadı')
}

if (!existsSync(robotsPath)) {
  errors.push('public/robots.txt bulunamadı')
}

if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, 'utf8')

  if (!sitemap.includes('https://woontegra.com/ucretsiz-araclar/sifre-kasasi')) {
    errors.push('sitemap.xml içinde şifre kasası URL’si yok')
  }

  if (!sitemap.includes('<urlset')) {
    errors.push('sitemap.xml geçerli bir urlset içermiyor')
  }
}

if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8')

  if (!robots.includes('Sitemap: https://woontegra.com/sitemap.xml')) {
    errors.push('robots.txt içinde sitemap referansı yok')
  }
}

if (errors.length > 0) {
  console.error('SEO dosya kontrolü başarısız:')
  errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}

console.log('SEO dosyaları hazır: sitemap.xml ve robots.txt')
