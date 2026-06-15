import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, ExternalLink } from 'lucide-react'
import { customersApi } from '../api/customers-api'
import { MediaThumb } from '../components/ui/MediaThumb'
import { addToCart } from '../lib/cartStorage'
import { formatMoneyAmount } from '../lib/formatMoney'

type Fav = { id: string; productId: string; name: string; slug: string; price: number; currency: string; coverImage: string | null }

export function HesabimFavoritesPage() {
  const [rows, setRows] = useState<Fav[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const load = async () => {
    const data = (await customersApi.listFavorites()) as Fav[]
    setRows(data)
  }

  useEffect(() => {
    void load()
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(t)
  }, [toast])

  const remove = async (productId: string) => {
    await customersApi.removeFavorite(productId)
    await load()
  }

  const addCart = (f: Fav) => {
    addToCart(f.productId, 1, {
      snapshot: {
        name: f.name,
        slug: f.slug,
        price: f.price,
        currency: f.currency,
        productType: 'DOWNLOAD',
        coverImage: f.coverImage,
      },
    })
    setToast('Ürün sepete eklendi.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Favorilerim</h2>
        <p className="mt-1 text-sm text-slate-600">Beğendiğiniz ürünleri sepete ekleyin veya mağazada inceleyin.</p>
      </div>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 w-[min(100%-2rem,22rem)] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-900 shadow-lg">
          {toast}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">
          <Heart className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
          <p className="mt-4 text-base font-semibold text-slate-900">Favori ürününüz bulunmuyor.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">Ürün sayfalarındaki kalp simgesi ile favorilerinize ekleyebilirsiniz.</p>
          <Link
            to="/urunler"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
          >
            Ürünleri keşfet
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((f) => (
            <li key={f.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                {f.coverImage ? (
                  <MediaThumb url={f.coverImage} fileType="IMAGE" className="h-full w-full min-h-[12rem] rounded-none border-0 object-cover" alt="" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">Görsel yok</div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-slate-900">{f.name}</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{formatMoneyAmount(f.price, f.currency)}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => addCart(f)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    <ShoppingCart className="h-4 w-4" aria-hidden />
                    Sepete ekle
                  </button>
                  <Link
                    to={`/urun/${f.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    Ürünü incele
                  </Link>
                  <button type="button" className="text-sm font-semibold text-red-700 hover:underline" onClick={() => void remove(f.productId)}>
                    Favorilerden çıkar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
