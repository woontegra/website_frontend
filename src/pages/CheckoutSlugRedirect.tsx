import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productsPublicApi } from '../api/products-public'
import { addToCart, type CartSnapshot } from '../lib/cartStorage'

/** Eski /checkout/:slug bağlantıları: ürünü sepete ekleyip /checkout’a yönlendirir. */
export function CheckoutSlugRedirect() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!slug) {
      navigate('/checkout', { replace: true })
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const p = await productsPublicApi.getBySlug(slug)
        if (
          !cancelled &&
          (p.productType === 'DOWNLOAD' ||
            ((p.productType === 'SAAS' || p.productType === 'SERVICE') && p.purchaseEnabled !== false))
        ) {
          const snapshot: CartSnapshot = {
            name: p.name,
            slug: p.slug,
            price: p.price,
            currency: p.currency,
            productType: p.productType,
            coverImage: p.coverImage,
            licenseDurationMonths: p.licenseMonths,
          }
          addToCart(p.id, 1, { snapshot })
        }
      } catch {
        /* ürün yoksa yine checkout’a git */
      } finally {
        if (!cancelled) navigate('/checkout', { replace: true })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, navigate])

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center text-slate-600">
      <p>Ödeme sayfasına yönlendiriliyorsunuz…</p>
    </div>
  )
}
