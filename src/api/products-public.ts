import axios from 'axios'
import { getApiUrl } from '../config/api'
import type { ProductType } from './products-admin'

export type PublicProductListItem = {
  id: string
  name: string
  slug: string
  productType: ProductType
  shortDescription: string
  price: number
  compareAtPrice: number | null
  currency: string
  isFeatured: boolean
  sortOrder: number
  version: string | null
  purchaseEnabled: boolean
  licenseMonths: number
  coverImage: string | null
  category: { id: string; name: string; slug: string } | null
}

export type PublicProductGalleryImage = {
  id: string
  url: string
  sortOrder: number
}

export type PublicProductDetail = PublicProductListItem & {
  description: string
  seoTitle: string | null
  seoDescription: string | null
  galleryImages: PublicProductGalleryImage[]
  featureBullets: string
}

export type CartPreviewRow = {
  id: string
  name: string
  slug: string
  productType: ProductType
  price: number
  currency: string
  coverImage: string | null
  hasDownload: boolean
  /** Sepet satırı `productId` slug iken önizleme eşlemesi için (id + slug + istemci anahtarları). */
  matchKeys?: string[]
}

export type PublicProductCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const apiRoot = getApiUrl().endsWith('/api') ? getApiUrl() : `${getApiUrl()}/api`

/** allowAbsoluteUrls: false → baseURL ile göreli path her zaman birleşir (VITE_API_URL=/api vb.). */
const pub = axios.create({ baseURL: apiRoot, allowAbsoluteUrls: false })

function assertPublicPayload<T>(res: { data?: { success?: boolean; data?: T } }, label: string): T {
  const payload = res.data
  if (!payload?.success || payload.data === undefined || payload.data === null) {
    throw new Error(`${label}: geçersiz API yanıtı`)
  }
  return payload.data
}

export const productsPublicApi = {
  async list(): Promise<PublicProductListItem[]> {
    const res = await pub.get<{ success: boolean; data: PublicProductListItem[] }>('products')
    return assertPublicPayload(res, 'products.list')
  },

  async getBySlug(slug: string): Promise<PublicProductDetail> {
    const path = `products/${encodeURIComponent(slug)}`
    const res = await pub.get<{ success: boolean; data: PublicProductDetail }>(path)
    return assertPublicPayload(res, 'products.getBySlug')
  },

  async cartPreview(productIds: string[]): Promise<CartPreviewRow[]> {
    const res = await pub.post<{ success: boolean; data: CartPreviewRow[] }>('products/cart-preview', { productIds })
    return assertPublicPayload(res, 'products.cartPreview')
  },
}

export const productCategoriesPublicApi = {
  async list(): Promise<PublicProductCategory[]> {
    const res = await pub.get<{ success: boolean; data: PublicProductCategory[] }>('product-categories')
    return assertPublicPayload(res, 'productCategories.list')
  },

  async listProductsByCategorySlug(slug: string): Promise<PublicProductListItem[]> {
    const path = `product-categories/${encodeURIComponent(slug)}/products`
    const res = await pub.get<{ success: boolean; data: PublicProductListItem[] }>(path)
    return assertPublicPayload(res, 'productCategories.listProductsByCategorySlug')
  },
}

export type PublicNavMenuItem = {
  id: string
  label: string
  href: string
  resolvedUrl: string
  openInNewTab: boolean
  sortOrder: number
  children: PublicNavMenuItem[]
}

export const navigationMenuPublicApi = {
  async list(): Promise<PublicNavMenuItem[]> {
    const res = await pub.get<{ success: boolean; data: PublicNavMenuItem[] }>('navigation-menu')
    return assertPublicPayload(res, 'navigationMenu.list')
  },
}
