import { apiClient } from './client'

export type ProductType = 'DOWNLOAD' | 'SAAS' | 'SERVICE'

export type AdminProductCategoryBrief = {
  id: string
  name: string
  slug: string
}

export type AdminProductMediaBrief = {
  id: string
  url: string
  fileType: string
  originalName: string
  fileSize: number
}

export type AdminProductGalleryImage = {
  id: string
  sortOrder: number
  mediaId: string
  url: string
  fileType: string
  originalName: string
  fileSize: number
}

export type AdminProduct = {
  id: string
  name: string
  slug: string
  productType: ProductType
  shortDescription: string
  description: string
  price: number
  compareAtPrice: number | null
  currency: string
  isActive: boolean
  purchaseEnabled: boolean
  licenseMonths: number
  licenseRequired: boolean
  licenseAppCode: string | null
  licenseDays: number | null
  licenseMaxDevices: number | null
  featureBullets: string
  isFeatured: boolean
  sortOrder: number
  version: string | null
  coverImage: string | null
  downloadUrl: string | null
  categoryId: string | null
  category: AdminProductCategoryBrief | null
  seoTitle: string | null
  seoDescription: string | null
  coverImageMediaId: string | null
  downloadMediaId: string | null
  coverMedia: { id: string; url: string; fileType: string } | null
  downloadMedia: AdminProductMediaBrief | null
  galleryImages: AdminProductGalleryImage[]
  createdAt: string
  updatedAt: string
  /** DOWNLOAD + aktif + satın alınabilir; teslimat linki eksik veya kullanılamıyor */
  deliveryLinkMissing: boolean
}

export type AdminProductInput = {
  name: string
  slug: string
  productType: ProductType
  shortDescription: string
  description: string
  price: number
  compareAtPrice: number | null
  currency: string
  isActive: boolean
  purchaseEnabled: boolean
  licenseMonths: number
  licenseRequired: boolean
  licenseAppCode: string | null
  licenseDays: number | null
  licenseMaxDevices: number | null
  featureBullets: string
  isFeatured: boolean
  sortOrder: number
  version: string
  coverImage?: string
  downloadUrl?: string
  categoryId?: string | null
  seoTitle?: string
  seoDescription?: string
  coverImageMediaId?: string | null
  downloadMediaId?: string | null
  /** Seçim sırası = sortOrder; boş dizi galeriyi temizler */
  galleryMediaIds?: string[]
}

export type AdminProductListParams = {
  search?: string
  isActive?: 'true' | 'false' | 'all'
  categoryId?: string
  productType?: ProductType
}

export const productsAdminApi = {
  async list(params?: AdminProductListParams): Promise<AdminProduct[]> {
    const res = await apiClient.get<{ success: boolean; data: AdminProduct[] }>('/admin/products', { params })
    return res.data.data
  },

  async getById(id: string): Promise<AdminProduct> {
    const res = await apiClient.get<{ success: boolean; data: AdminProduct }>(`/admin/products/${id}`)
    return res.data.data
  },

  async create(payload: AdminProductInput): Promise<AdminProduct> {
    const res = await apiClient.post<{ success: boolean; data: AdminProduct }>('/admin/products', payload)
    return res.data.data
  },

  async update(id: string, payload: Partial<AdminProductInput>): Promise<AdminProduct> {
    const res = await apiClient.patch<{ success: boolean; data: AdminProduct }>(`/admin/products/${id}`, payload)
    return res.data.data
  },

  /** Sunucu ürünü pasife alır (hard delete yok). */
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/admin/products/${id}`)
  },
}
