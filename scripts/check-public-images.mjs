import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const siteImagesPath = join(rootDir, 'src', 'data', 'siteImages.ts')
const publicImagesDir = join(rootDir, 'public', 'images')

const source = readFileSync(siteImagesPath, 'utf8')
const pathPattern = /['"](\/images\/[^'"]+)['"]/g
const paths = [...new Set([...source.matchAll(pathPattern)].map((match) => match[1]))]

const errors = []

for (const imagePath of paths) {
  const relativePath = imagePath.replace(/^\/images\//, '')
  const filePath = join(publicImagesDir, ...relativePath.split('/'))

  if (!existsSync(filePath)) {
    const keyMatch = source
      .split('\n')
      .find((line) => line.includes(imagePath))
      ?.trim()
      .split(':')[0]
      ?.trim()

    errors.push(
      `Eksik görsel dosyası:\n  public/images/${relativePath}\n  ${keyMatch ? `${keyMatch} tarafından kullanılıyor.` : `siteImages içinde tanımlı (${imagePath}).`}`,
    )
  }
}

if (errors.length > 0) {
  console.error('Görsel dosya kontrolü başarısız:\n')
  errors.forEach((error, index) => {
    console.error(`${index + 1}. ${error}\n`)
  })
  process.exit(1)
}

console.log(`Görsel dosyaları hazır: ${paths.length} kritik görsel doğrulandı.`)
