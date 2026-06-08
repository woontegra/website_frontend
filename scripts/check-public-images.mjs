import { existsSync, readFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
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

function detectFormat(buffer) {
  if (buffer.length < 4) return 'invalid'
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'jpeg'
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return 'png'
  if (buffer.toString('utf8', 0, Math.min(80, buffer.length)).includes('<svg')) return 'svg'
  if (buffer.toString('utf8', 0, Math.min(40, buffer.length)).startsWith('data:image')) return 'stub-text'
  return 'unknown'
}

function validateAsset(filePath, label) {
  if (!existsSync(filePath)) return `${label}: dosya yok (${filePath})`
  const buffer = readFileSync(filePath)
  const format = detectFormat(buffer)
  const ext = extname(filePath).toLowerCase()
  if (format === 'stub-text') {
    return `${label}: geçersiz stub dosya (içerik data:image metni, gerçek görsel değil)`
  }
  if ((ext === '.jpg' || ext === '.jpeg') && format !== 'jpeg') {
    return `${label}: .jpg/.jpeg uzantılı ama JPEG değil (format: ${format})`
  }
  if (ext === '.png' && format !== 'png') {
    return `${label}: .png uzantılı ama PNG değil (format: ${format})`
  }
  if (ext === '.svg' && format !== 'svg') {
    return `${label}: .svg uzantılı ama SVG değil`
  }
  return null
}

const frontendImagesSource = readFileSync(join(rootDir, 'src', 'data', 'frontendImages.ts'), 'utf8')
const assetImportPattern = /from\s+['"](\.\.\/assets\/[^'"]+)['"]/g
const assetImports = new Set()
for (const match of frontendImagesSource.matchAll(assetImportPattern)) {
  assetImports.add(match[1])
}

const errors = []

const headerLogoPath = join(rootDir, 'src', 'assets', 'logos', 'woontegra-logo.png')
const headerLogoError = validateAsset(headerLogoPath, 'Header logosu (src/assets/logos/woontegra-logo.png)')
if (headerLogoError) errors.push(headerLogoError)

const sifreKasasiShotPath = join(rootDir, 'src', 'assets', 'images', 'woontegra-sifre-kasasi-ekran.png')
const sifreKasasiShotError = validateAsset(
  sifreKasasiShotPath,
  'Şifre Kasası ekran görüntüsü (src/assets/images/woontegra-sifre-kasasi-ekran.png)',
)
if (sifreKasasiShotError) errors.push(sifreKasasiShotError)

for (const relImport of assetImports) {
  const filePath = join(rootDir, 'src', relImport.replace(/^\.\.\//, ''))
  const label = `frontend asset ${relImport}`
  const err = validateAsset(filePath, label)
  if (err) errors.push(err)
}

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

console.log(
  `Görsel dosyaları hazır: header woontegra-logo.png, ${assetImports.size} frontend asset, ${paths.size} public path doğrulandı.`,
)
