import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ordersAdminApi, type AdminOrderDetail } from '../../api/orders-admin'
import { AdminBankTransferConfirmModal } from '../../components/admin/AdminBankTransferConfirmModal'
import {
  OrderStatusBadge,
  PaymentMethodBadge,
  PaymentStatusBadge,
  showHavaleConfirmPaymentButton,
} from '../../components/admin/AdminOrderBadges'
import { AdminOrderEditModal, type AdminOrderEditableSnapshot } from '../../components/admin/AdminOrderEditModal'
import { isBankTransferLikeProvider, shouldShowHavaleApprovedBanner } from '../../lib/adminOrderHavaleUi'
import { formatMoneyAmount } from '../../lib/formatMoney'

function dash(v: string | null | undefined): string {
  const s = (v ?? '').toString().trim()
  return s.length ? s : '—'
}

function useToast() {
  const [toast, setToast] = useState<string | null>(null)
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(t)
  }, [toast])
  return { toast, setToast }
}

function billingAddressText(row: AdminOrderDetail): string {
  const parts = [
    row.customer.customerName,
    row.customer.companyName,
    row.customer.billingType,
    row.customer.taxOffice || row.customer.taxNumber
      ? [row.customer.taxOffice, row.customer.taxNumber].filter(Boolean).join(' / ')
      : null,
  ]
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean)
  return parts.length ? parts.join('\n') : '—'
}

function deliveryAddressText(_row: AdminOrderDetail): string {
  return '—'
}

export function AdminOrderDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [row, setRow] = useState<AdminOrderDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast, setToast } = useToast()

  const [bankModal, setBankModal] = useState(false)
  const [bankSubmitting, setBankSubmitting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [licenseBusyId, setLicenseBusyId] = useState<string | null>(null)

  const [shipCarrier, setShipCarrier] = useState('')
  const [shipTrack, setShipTrack] = useState('')
  const [shipStatus, setShipStatus] = useState('')
  const [shipSaving, setShipSaving] = useState(false)

  const [adminNoteLocal, setAdminNoteLocal] = useState('')
  const [adminNoteSaving, setAdminNoteSaving] = useState(false)

  const reload = useCallback(async () => {
    if (!id) return
    const d = await ordersAdminApi.getById(id)
    setRow(d)
    setShipCarrier(d.shippingCarrier ?? '')
    setShipTrack(d.shippingTrackingNumber ?? '')
    setShipStatus(d.shippingStatus ?? '')
    setAdminNoteLocal(d.adminNote ?? '')
  }, [id])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    void (async () => {
      try {
        setLoading(true)
        const d = await ordersAdminApi.getById(id)
        if (!cancelled) {
          setRow(d)
          setShipCarrier(d.shippingCarrier ?? '')
          setShipTrack(d.shippingTrackingNumber ?? '')
          setShipStatus(d.shippingStatus ?? '')
          setAdminNoteLocal(d.adminNote ?? '')
        }
      } catch (e) {
        console.error('[AdminOrderDetail] Sipariş yüklenemedi', e)
        if (!cancelled) setError('Sipariş bulunamadı veya yüklenemedi.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const showHavaleApprove = useMemo(() => {
    if (!row) return false
    return showHavaleConfirmPaymentButton(row)
  }, [row])

  const showHavaleApproved = useMemo(() => {
    if (!row) return false
    return shouldShowHavaleApprovedBanner(row)
  }, [row])

  const editableSnapshot = useMemo((): AdminOrderEditableSnapshot | null => {
    if (!row) return null
    return {
      id: row.id,
      status: row.status,
      paymentProvider: row.paymentProvider,
      paymentMethod: row.paymentMethod,
      paymentStatus: row.paymentStatus ?? null,
      hasPaytrTransactionRecord: row.paymentTransactions.length > 0,
      paytrTransactionStatus: row.paytrTransactionStatus ?? row.paymentTransactions[0]?.status ?? null,
      adminNote: row.adminNote ?? null,
      shippingCarrier: row.shippingCarrier ?? null,
      shippingTrackingNumber: row.shippingTrackingNumber ?? null,
      shippingStatus: row.shippingStatus ?? null,
    }
  }, [row])

  const timeline = useMemo(() => {
    if (!row) return []
    type Ev = { at: string; title: string; detail?: string }
    const ev: Ev[] = [{ at: row.createdAt, title: 'Sipariş oluşturuldu' }]
    const bank = isBankTransferLikeProvider(row.paymentProvider) || isBankTransferLikeProvider(row.paymentMethod)
    if (row.status === 'PENDING') {
      ev.push({
        at: row.createdAt,
        title: bank ? 'Havale/EFT — ödeme onayı bekleniyor' : 'Ödeme bekleniyor',
      })
    }
    if (row.paymentConfirmedAt) {
      ev.push({
        at: row.paymentConfirmedAt,
        title: 'Ödeme onaylandı',
        detail: dash(row.paymentConfirmedByEmail ?? row.paymentConfirmedById),
      })
    }
    if (row.paidAt && !row.paymentConfirmedAt) {
      ev.push({ at: row.paidAt, title: 'Ödeme tarihi işlendi' })
    }
    if ((row.shippingTrackingNumber ?? '').trim() || (row.shippingCarrier ?? '').trim()) {
      ev.push({ at: row.updatedAt, title: 'Kargo bilgisi güncellendi' })
    }
    if (row.updatedAt && row.updatedAt !== row.createdAt) {
      ev.push({ at: row.updatedAt, title: 'Kayıt güncellendi' })
    }
    const seen = new Set<string>()
    return ev
      .filter((e) => {
        const k = `${e.at}|${e.title}|${e.detail ?? ''}`
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
  }, [row])

  const fmt = (s: string | null) => (s ? new Date(s).toLocaleString('tr-TR') : '—')

  const submitBankApproval = async (payload: { paymentDate: string; bankNote: string; reference?: string }) => {
    if (!id) return
    setBankSubmitting(true)
    try {
      await ordersAdminApi.confirmBankPayment(id, payload)
      setBankModal(false)
      setToast('Havale/EFT ödemesi onaylandı.')
      await reload()
    } catch (e: unknown) {
      const ax = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response : undefined
      setToast(ax?.data?.message || 'Onay işlemi başarısız.')
    } finally {
      setBankSubmitting(false)
    }
  }

  const handleEditSave = async (payload: {
    status: string
    paymentTransactionStatus?: string
    adminNote: string | null
    shippingCarrier: string | null
    shippingTrackingNumber: string | null
    shippingStatus: string | null
  }) => {
    if (!id) return
    setEditSubmitting(true)
    try {
      await ordersAdminApi.update(id, {
        status: payload.status,
        paymentTransactionStatus: payload.paymentTransactionStatus,
        adminNote: payload.adminNote,
        shippingCarrier: payload.shippingCarrier,
        shippingTrackingNumber: payload.shippingTrackingNumber,
        shippingStatus: payload.shippingStatus,
      })
      setEditOpen(false)
      setToast('Sipariş güncellendi.')
      await reload()
    } catch (e: unknown) {
      const ax = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response : undefined
      setToast(ax?.data?.message || 'Kayıt başarısız.')
    } finally {
      setEditSubmitting(false)
    }
  }

  const saveShippingOnly = async () => {
    if (!id) return
    setShipSaving(true)
    try {
      await ordersAdminApi.update(id, {
        shippingCarrier: shipCarrier.trim() || null,
        shippingTrackingNumber: shipTrack.trim() || null,
        shippingStatus: shipStatus.trim() || null,
      })
      setToast('Kargo bilgileri kaydedildi.')
      await reload()
    } catch (e: unknown) {
      const ax = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response : undefined
      setToast(ax?.data?.message || 'Kayıt başarısız.')
    } finally {
      setShipSaving(false)
    }
  }

  const saveAdminNoteOnly = async () => {
    if (!id) return
    setAdminNoteSaving(true)
    try {
      await ordersAdminApi.update(id, { adminNote: adminNoteLocal.trim() || null })
      setToast('Admin notu kaydedildi.')
      await reload()
    } catch (e: unknown) {
      const ax = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response : undefined
      setToast(ax?.data?.message || 'Kayıt başarısız.')
    } finally {
      setAdminNoteSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setDeleteSubmitting(true)
    try {
      await ordersAdminApi.delete(id)
      setToast('Sipariş arşivlendi.')
      navigate('/admin/siparisler')
    } catch (e: unknown) {
      const ax = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response : undefined
      setToast(ax?.data?.message || 'Silme başarısız.')
    } finally {
      setDeleteSubmitting(false)
    }
  }

  const patchLicense = async (licenseId: string, body: { status?: 'ACTIVE' | 'DISABLED'; resetActivations?: boolean; maxDevices?: number }) => {
    if (!id) return
    setLicenseBusyId(licenseId)
    try {
      await ordersAdminApi.patchOrderLicense(id, licenseId, body)
      setToast('Lisans güncellendi.')
      await reload()
    } catch (e: unknown) {
      const ax = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response : undefined
      setToast(ax?.data?.message || 'Lisans işlemi başarısız.')
    } finally {
      setLicenseBusyId(null)
    }
  }

  const licenseStatusTr = (s: string) => {
    const k = s.toUpperCase()
    if (k === 'ACTIVE') return 'Aktif'
    if (k === 'DISABLED') return 'Pasif'
    if (k === 'EXPIRED') return 'Süresi doldu'
    if (k === 'REVOKED') return 'İptal'
    return s
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-600">Yükleniyor…</p>
      </div>
    )
  }

  if (error || !row) {
    return (
      <div className="p-6">
        <p className="text-red-800">{error ?? 'Bulunamadı'}</p>
        <Link to="/admin/siparisler" className="mt-4 inline-block text-accent-blue hover:underline">
          Listeye dön
        </Link>
      </div>
    )
  }

  const payRow = {
    status: row.status,
    paymentProvider: row.paymentProvider,
    paymentMethod: row.paymentMethod,
    paymentStatus: row.paymentStatus ?? null,
    paytrTransactionStatus: row.paytrTransactionStatus ?? row.paymentTransactions[0]?.status ?? null,
    paidAt: row.paidAt,
  }

  return (
    <div className="w-full min-w-0 max-w-none space-y-6">
      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[110] max-w-[min(92vw,24rem)] -translate-x-1/2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}

      {row.digitalDeliveryEmailAlert ? (
        <div
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
          role="alert"
        >
          {row.digitalDeliveryEmailAlert}
        </div>
      ) : null}

      <AdminBankTransferConfirmModal
        open={bankModal}
        onClose={() => !bankSubmitting && setBankModal(false)}
        submitting={bankSubmitting}
        onConfirm={submitBankApproval}
      />

      <AdminOrderEditModal
        open={editOpen}
        row={editableSnapshot}
        onClose={() => !editSubmitting && setEditOpen(false)}
        submitting={editSubmitting}
        onSave={handleEditSave}
      />

      {deleteOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Siparişi sil</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">Bu siparişi silmek istediğinize emin misiniz?</p>
            <p className="mt-2 font-mono text-xs text-slate-500">{row.orderNo}</p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => !deleteSubmitting && setDeleteOpen(false)}
                disabled={deleteSubmitting}
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 disabled:opacity-50"
                disabled={deleteSubmitting}
                onClick={() => void handleDelete()}
              >
                {deleteSubmitting ? 'Siliniyor…' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* A — Özet */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Sipariş {row.orderNo}</h1>
              <OrderStatusBadge status={row.status} />
              <PaymentMethodBadge row={row} />
              <PaymentStatusBadge row={payRow} />
            </div>
            <p className="text-sm text-slate-600">
              Oluşturulma: <span className="font-medium text-slate-900">{fmt(row.createdAt)}</span>
            </p>
            <p className="text-lg font-bold text-slate-900">{formatMoneyAmount(row.total, row.currency)}</p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap gap-2 lg:justify-end">
            <Link
              to="/admin/siparisler"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              ← Geri dön
            </Link>
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              onClick={() => setEditOpen(true)}
            >
              Düzenle
            </button>
            <button
              type="button"
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50"
              onClick={() => setDeleteOpen(true)}
            >
              Sil
            </button>
            {showHavaleApprove ? (
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 px-3 py-2 text-sm font-bold text-white shadow-md hover:opacity-95"
                onClick={() => setBankModal(true)}
              >
                Ödemeyi Onayla
              </button>
            ) : null}
          </div>
        </div>
        {showHavaleApproved ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-semibold text-emerald-950">
            Havale/EFT ödemesi onaylanmış görünüyor.
          </div>
        ) : null}
      </section>

      {/* B — Müşteri */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Müşteri bilgileri</h2>
        {row.registeredCustomer && (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-2 text-xs text-emerald-950">
            Kayıtlı hesap: <strong>{row.registeredCustomer.name}</strong> ({row.registeredCustomer.email})
          </div>
        )}
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ad soyad</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{dash(row.customer.customerName)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">E-posta</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{dash(row.customer.customerEmail)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telefon</dt>
            <dd className="mt-0.5 text-slate-800">{dash(row.customer.customerPhone)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fatura adresi</dt>
            <dd className="mt-1 whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50/80 p-3 text-slate-900">{billingAddressText(row)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Teslimat adresi</dt>
            <dd className="mt-1 whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50/80 p-3 text-slate-900">{deliveryAddressText(row)}</dd>
            <p className="mt-1 text-xs text-slate-500">
              Dijital ürün akışında ayrı teslimat adresi satırı saklanmıyorsa bu alan boş görünebilir.
            </p>
          </div>
        </dl>
      </section>

      {/* C — Ürünler */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Ürünler</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-100">
          <table className="min-w-[640px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-3 py-2">Ürün adı</th>
                <th className="px-3 py-2">Adet</th>
                <th className="px-3 py-2">Birim fiyat</th>
                <th className="px-3 py-2">Ara toplam</th>
              </tr>
            </thead>
            <tbody>
              {row.items.map((i) => (
                <tr key={i.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                  <td className="px-3 py-2 font-medium text-slate-900">{i.productName}</td>
                  <td className="px-3 py-2 tabular-nums">{i.quantity}</td>
                  <td className="px-3 py-2 tabular-nums">{formatMoneyAmount(i.unitPrice, row.currency)}</td>
                  <td className="px-3 py-2 font-semibold tabular-nums text-slate-900">{formatMoneyAmount(i.total, row.currency)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50/80 font-bold">
                <td colSpan={3} className="px-3 py-2 text-right text-slate-800">
                  Toplam
                </td>
                <td className="px-3 py-2 text-slate-900">{formatMoneyAmount(row.total, row.currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {row.licenses && row.licenses.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Lisanslar</h2>
          <p className="mt-1 text-xs text-slate-600">
            Masaüstü / indirilebilir ürün lisansları. Müşteri bilgisayar değiştirdiyse cihaz sıfırlama veya ek cihaz hakkı verebilirsiniz.
          </p>
          <div className="mt-4 space-y-6">
            {row.licenses.map((lic) => {
              const busy = licenseBusyId === lic.id
              return (
                <div key={lic.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <p className="font-mono text-sm font-bold tracking-tight text-slate-900">{lic.licenseKey}</p>
                      <p className="text-sm text-slate-800">
                        <span className="font-semibold">{lic.productName}</span>
                        <span className="text-slate-500"> · </span>
                        <span>{lic.customerEmail}</span>
                      </p>
                      <p className="text-xs text-slate-600">
                        Durum: <strong>{licenseStatusTr(lic.status)}</strong>
                        <span className="text-slate-400"> · </span>
                        Cihaz hakkı:{' '}
                        <strong>
                          {lic.activatedDevicesCount}/{lic.maxDevices}
                        </strong>
                        <span className="text-slate-400"> · </span>
                        Son doğrulama: {lic.lastValidatedAt ? fmt(lic.lastValidatedAt) : '—'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lic.status === 'ACTIVE' ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void patchLicense(lic.id, { status: 'DISABLED' })}
                          className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 shadow-sm hover:bg-amber-50 disabled:opacity-50"
                        >
                          Pasifleştir
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void patchLicense(lic.id, { status: 'ACTIVE' })}
                          className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 disabled:opacity-50"
                        >
                          Aktifleştir
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          if (!window.confirm('Bu lisansın tüm cihaz kayıtlarını silmek istediğinize emin misiniz?')) return
                          void patchLicense(lic.id, { resetActivations: true })
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cihazı sıfırla
                      </button>
                      <button
                        type="button"
                        disabled={busy || lic.maxDevices >= 50}
                        onClick={() => void patchLicense(lic.id, { maxDevices: lic.maxDevices + 1 })}
                        className="rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-xs font-bold text-sky-900 shadow-sm hover:bg-sky-50 disabled:opacity-50"
                      >
                        +1 cihaz hakkı
                      </button>
                    </div>
                  </div>
                  {lic.activations.length > 0 ? (
                    <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                      <table className="w-full min-w-[520px] text-left text-xs">
                        <thead className="bg-slate-100 font-bold uppercase tracking-wide text-slate-600">
                          <tr>
                            <th className="px-2 py-2">Cihaz özeti</th>
                            <th className="px-2 py-2">Platform</th>
                            <th className="px-2 py-2">İlk aktivasyon</th>
                            <th className="px-2 py-2">Son doğrulama</th>
                            <th className="px-2 py-2">Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lic.activations.map((a) => (
                            <tr key={a.id} className="border-t border-slate-100">
                              <td className="px-2 py-2 font-mono text-slate-800">
                                {a.deviceHashShort}
                                {a.deviceName ? <span className="ml-1 font-sans text-slate-600">({a.deviceName})</span> : null}
                              </td>
                              <td className="px-2 py-2 text-slate-700">{dash(a.platform)}</td>
                              <td className="px-2 py-2 tabular-nums text-slate-700">{fmt(a.firstActivatedAt)}</td>
                              <td className="px-2 py-2 tabular-nums text-slate-700">{a.lastValidatedAt ? fmt(a.lastValidatedAt) : '—'}</td>
                              <td className="px-2 py-2">{licenseStatusTr(a.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-slate-500">Henüz cihaz aktivasyonu yok.</p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* D — Ödeme */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Ödeme bilgileri</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ödeme yöntemi</dt>
            <dd className="mt-1">
              <PaymentMethodBadge row={row} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ödeme durumu</dt>
            <dd className="mt-1">
              <PaymentStatusBadge row={payRow} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ödeme tarihi</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{fmt(row.paidAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Havale ödeme tarihi (admin)</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{fmt(row.bankTransferPaymentDate)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Banka notu / açıklama</dt>
            <dd className="mt-1 whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50/80 p-3 text-slate-900">{dash(row.bankTransferAdminNote)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Referans numarası</dt>
            <dd className="mt-0.5 font-mono text-xs text-slate-900">{dash(row.bankTransferReference)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Onaylayan admin</dt>
            <dd className="mt-0.5 text-slate-900">{dash(row.paymentConfirmedByEmail ?? row.paymentConfirmedById)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Onay tarihi</dt>
            <dd className="mt-0.5 text-slate-900">{fmt(row.paymentConfirmedAt)}</dd>
          </div>
        </dl>
      </section>

      {/* E — Kargo */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Kargo bilgileri</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-800 sm:col-span-2">
            Kargo firması
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm"
              value={shipCarrier}
              onChange={(e) => setShipCarrier(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-800 sm:col-span-2">
            Takip numarası
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm"
              value={shipTrack}
              onChange={(e) => setShipTrack(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-800 sm:col-span-2">
            Kargo durumu
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm"
              value={shipStatus}
              onChange={(e) => setShipStatus(e.target.value)}
              placeholder="Örn. Dağıtımda"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={shipSaving}
            onClick={() => void saveShippingOnly()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:opacity-50"
          >
            {shipSaving ? 'Kaydediliyor…' : 'Kargo bilgisini kaydet'}
          </button>
        </div>
      </section>

      {/* F — Admin notu */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Admin notu</h2>
        <p className="mt-1 text-xs text-slate-500">Müşteri panelinde gösterilmez.</p>
        <textarea
          className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-inner"
          value={adminNoteLocal}
          onChange={(e) => setAdminNoteLocal(e.target.value)}
          placeholder="Operasyonel notlar…"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            disabled={adminNoteSaving}
            onClick={() => void saveAdminNoteOnly()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:opacity-50"
          >
            {adminNoteSaving ? 'Kaydediliyor…' : 'Notu kaydet'}
          </button>
        </div>
      </section>

      {/* G — Timeline */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">İşlem geçmişi</h2>
        <ol className="relative mt-4 space-y-0 border-l-2 border-slate-200 pl-6">
          {timeline.map((e, idx) => (
            <li key={`${e.at}-${idx}`} className="mb-6 last:mb-0">
              <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-accent-blue shadow" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{fmt(e.at)}</p>
              <p className="text-sm font-bold text-slate-900">{e.title}</p>
              {e.detail ? <p className="text-xs text-slate-600">{e.detail}</p> : null}
            </li>
          ))}
        </ol>
      </section>

      {/* Teknik / yasal */}
      <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <summary className="cursor-pointer text-base font-bold text-slate-900">Yasal kayıtlar ve teknik detay</summary>
        <div className="mt-4 space-y-6 text-sm">
          {import.meta.env.DEV && (
            <pre className="max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-200">
              {JSON.stringify(
                {
                  paymentMethod: row.paymentMethod ?? null,
                  paymentProvider: row.paymentProvider,
                  paymentStatus: row.paymentStatus ?? null,
                  paytrTransactionStatus: row.paytrTransactionStatus ?? null,
                  status: row.status,
                },
                null,
                2,
              )}
            </pre>
          )}
          <section>
            <h3 className="font-semibold text-slate-900">Yasal onaylar</h3>
            <dl className="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Ön bilgilendirme</dt>
                <dd>{fmt(row.preInfoAcceptedAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Mesafeli satış</dt>
                <dd>{fmt(row.distanceSalesAcceptedAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">KVKK</dt>
                <dd>{fmt(row.kvkkReadAt)}</dd>
              </div>
              {row.softwareLicenseAcceptedAt ? (
                <div>
                  <dt className="text-slate-500">Yazılım lisans sözleşmesi</dt>
                  <dd>{fmt(row.softwareLicenseAcceptedAt)}</dd>
                </div>
              ) : null}
              {row.saasSubscriptionAcceptedAt ? (
                <div>
                  <dt className="text-slate-500">SaaS abonelik sözleşmesi</dt>
                  <dd>{fmt(row.saasSubscriptionAcceptedAt)}</dd>
                </div>
              ) : null}
              {row.digitalProductWaiverAcceptedAt ? (
                <div>
                  <dt className="text-slate-500">Dijital ürün teslim / cayma istisnası</dt>
                  <dd>{fmt(row.digitalProductWaiverAcceptedAt)}</dd>
                </div>
              ) : null}
              {row.digitalServiceWaiverAcceptedAt ? (
                <div>
                  <dt className="text-slate-500">Dijital hizmet aktivasyon / cayma istisnası</dt>
                  <dd>{fmt(row.digitalServiceWaiverAcceptedAt)}</dd>
                </div>
              ) : null}
              {row.legalCartProductTypes ? (
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Sepet ürün tipleri</dt>
                  <dd>{row.legalCartProductTypes}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-slate-500">IP / User-Agent</dt>
                <dd className="break-all text-xs">{dash(row.acceptedIp)} / {dash(row.acceptedUserAgent)}</dd>
              </div>
            </dl>
          </section>
          {row.legalSnapshots.length > 0 ? (
            <section>
              <h3 className="font-semibold text-slate-900">Yasal metin snapshot’ları</h3>
              <ul className="mt-2 space-y-2">
                {row.legalSnapshots.map((s) => (
                  <li key={s.id} className="rounded-lg border border-slate-100">
                    <details>
                      <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
                        {s.title} <span className="font-normal text-slate-500">(v{s.version})</span>
                      </summary>
                      <pre className="max-h-48 overflow-auto whitespace-pre-wrap p-3 text-xs text-slate-800">{s.content}</pre>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {row.paymentTransactions.length > 0 ? (
            <section>
              <h3 className="font-semibold text-slate-900">PayTR işlem kayıtları</h3>
              <ul className="mt-2 space-y-2">
                {row.paymentTransactions.map((tx) => (
                  <li key={tx.id} className="rounded border border-slate-100 p-2 text-xs">
                    <div className="font-semibold">
                      {tx.status} — {tx.merchantOid}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </details>
    </div>
  )
}
