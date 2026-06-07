/**
 * @deprecated publicImageCatalog.ts kullanın.
 * Geriye dönük uyumluluk için re-export.
 */
import { PUBLIC_IMAGE_CATALOG } from './publicImageCatalog'

export const PUBLIC_IMAGE_OPTIONS = PUBLIC_IMAGE_CATALOG.map((item) => ({
  path: item.path,
  label: item.title,
}))

export const PUBLIC_IMAGE_PATHS = new Set(PUBLIC_IMAGE_CATALOG.map((item) => item.path))
