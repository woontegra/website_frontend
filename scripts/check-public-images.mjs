import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicImagesDir = join(rootDir, 'public', 'images')

const sources = [
  join(rootDir, 'src', 'data', 'siteImages.ts'),
  join(rootDir, 'src', 'data', 'publicImageCatalog.ts'),
  join(rootDir, 'src', 'data', 'publicImages.ts'),
]

const pathPattern = /['"](\/images\/[^'"]+)['"]/g
const paths = new Set()

for (const filePath of sources) {
  const source = readFileSync(filePath, 'utf8')
  for (const match of source.matchAll(pathPattern)) {
    paths.add(match[1])
  }
}

const errors = []

for (const imagePath of paths) {
  const relativePath = imagePath.replace(/^\/images\//, '')
  const filePath = join(publicImagesDir, ...relativePath.split('/'))

  if (!existsSync(filePath)) {
    errors.push(`Eksik görsel: public/images/${relativePath} (kodda: ${imagePath})`)
  }
}

if (errors.length > 0) {
  console.error('Görsel dosya kontrolü başarısız:\n')
  errors.forEach((error, index) => {
    console.error(`${index + 1}. ${error}\n`)
  })
  process.exit(1)
}

console.log(`Görsel dosyaları hazır: ${paths.size} path doğrulandı.`)
