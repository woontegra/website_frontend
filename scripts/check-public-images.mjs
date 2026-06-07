import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicImagesDir = join(rootDir, 'public', 'images')
const assetsDir = join(rootDir, 'src', 'assets')

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

const frontendImagesSource = readFileSync(join(rootDir, 'src', 'data', 'frontendImages.ts'), 'utf8')
const assetImportPattern = /from\s+['"](\.\.\/assets\/[^'"]+)['"]/g
const assetImports = new Set()
for (const match of frontendImagesSource.matchAll(assetImportPattern)) {
  assetImports.add(match[1])
}

const errors = []

for (const relImport of assetImports) {
  const assetPath = join(rootDir, 'src', 'data', relImport.replace(/^\.\.\//, '../').replace(/\//g, '/'))
  const resolved = join(rootDir, 'src', 'data', '..', relImport.replace(/^\.\.\//, ''))
  const filePath = join(rootDir, 'src', relImport.replace(/^\.\.\//, ''))
  if (!existsSync(filePath)) {
    errors.push(`Eksik frontend asset: src/${relImport.replace(/^\.\.\//, '')}`)
  }
}

for (const imagePath of paths) {
  const relativePath = imagePath.replace(/^\/images\//, '')
  const filePath = join(publicImagesDir, ...relativePath.split('/'))

  if (!existsSync(filePath)) {
    errors.push(`Eksik görsel: public/images/${relativePath} (kodda: ${imagePath})`)
  }
}

if (!existsSync(join(assetsDir, 'logos', 'woontegra-logo.svg'))) {
  errors.push('Eksik header logosu: src/assets/logos/woontegra-logo.svg')
}

if (errors.length > 0) {
  console.error('Görsel dosya kontrolü başarısız:\n')
  errors.forEach((error, index) => {
    console.error(`${index + 1}. ${error}\n`)
  })
  process.exit(1)
}

console.log(
  `Görsel dosyaları hazır: ${paths.size} public path, ${assetImports.size} frontend asset doğrulandı.`,
)
