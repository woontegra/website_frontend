import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck } from 'lucide-react'
import { CheckoutLegalModal } from '../components/checkout/CheckoutLegalModal'
import { CheckoutLegalPreviewBody } from '../components/checkout/CheckoutLegalPreviewBody'
import { CheckoutElectronicMessageBody, CheckoutMarketingConsentBody } from '../components/checkout/CheckoutLegalDocumentBodies'
import type { LegalDocType } from '../api/legal-documents-public'
import { buildCheckoutLegalPreviewVariables } from '../lib/buildCheckoutLegalPreviewVars'
import { checkoutLegalConsentsOk, resolveOrderLegalConsentFlags } from '../lib/orderLegalRequirements'
import { isWebBasedCheckoutProduct } from '../lib/checkoutProductLabels'
import { productsPublicApi, type CartPreviewRow } from '../api/products-public'
import { ordersPublicApi } from '../api/orders-public'
import { paymentsPublicApi, type BankTransferDisplayDto } from '../api/payments-public'
import { formatIbanDisplay } from '../lib/bankTransferTypes'
import { customersApi } from '../api/customers-api'
import { readCart, clearCart, writeCart, alignCartLinesToCanonicalProductIds, type CartLine } from '../lib/cartStorage'
import { mergeCartWithPreview } from '../lib/cartMerge'
import { productPricePeriodSuffix } from '../lib/formatProductPrice'
import { formatMoneyAmount } from '../lib/formatMoney'
import { getCustomerToken, isCustomerToken } from '../lib/customerAuth'
import { isMuvekkilKasaSaasProduct, SAAS_LOGIN_REQUIRED_MESSAGE } from '../lib/muvekkilKasaSaasProduct'
import { MediaThumb } from '../components/ui/MediaThumb'
import { TURKEY_PROVINCES, districtsForProvince } from '../data/turkeyLocation'

const emptyForm = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  billingType: '' as '' | 'Bireysel' | 'Kurumsal',
  companyName: '',
  taxOffice: '',
  taxNumber: '',
  deliveryCity: '',
  deliveryDistrict: '',
  deliveryLine: '',
}

const inputCls =
  'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20'
const labelCls = 'block text-sm font-medium text-slate-700'
const cardCls = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7'

export function CheckoutPage() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<CartLine[]>(() => readCart())
  const [preview, setPreview] = useState<CartPreviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [iframeToken, setIframeToken] = useState<string | null>(null)
  const [orderNo, setOrderNo] = useState<string | null>(null)

  const [acceptPre, setAcceptPre] = useState(false)
  const [acceptDistance, setAcceptDistance] = useState(false)
  const [acceptKvkk, setAcceptKvkk] = useState(false)
  const [acceptSoftwareLicense, setAcceptSoftwareLicense] = useState(false)
  const [acceptSaasSubscription, setAcceptSaasSubscription] = useState(false)
  const [acceptDigitalProductWaiver, setAcceptDigitalProductWaiver] = useState(false)
  const [acceptDigitalServiceWaiver, setAcceptDigitalServiceWaiver] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [explicit, setExplicit] = useState(false)

  const [loggedIn, setLoggedIn] = useState(false)
  type Addr = {
    id: string
    title: string
    fullName: string
    phone: string | null
    city: string
    district: string | null
    addressLine: string
    postalCode: string | null
    taxOffice: string | null
    taxNumber: string | null
    companyName: string | null
  }
  const [addresses, setAddresses] = useState<Addr[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [saveAddressAfterOrder, setSaveAddressAfterOrder] = useState(false)

  type CheckoutPaymentMethod = 'CARD' | 'BANK_TRANSFER'
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('CARD')
  const [bankDisplay, setBankDisplay] = useState<BankTransferDisplayDto | null>(null)

  type CheckoutLegalModalId =
    | 'PRE_INFO'
    | 'DISTANCE'
    | 'KVKK'
    | 'SOFTWARE_LICENSE'
    | 'SAAS_SUBSCRIPTION'
    | 'DIGITAL_PRODUCT_WAIVER'
    | 'DIGITAL_SERVICE_WAIVER'
    | 'COMMERCIAL'
    | 'MARKETING'
  const [legalModal, setLegalModal] = useState<CheckoutLegalModalId | null>(null)

  const districtOptions = useMemo(() => districtsForProvince(form.deliveryCity), [form.deliveryCity])
  const cityInList = !form.deliveryCity || TURKEY_PROVINCES.includes(form.deliveryCity)
  const citySelectValue = cityInList ? form.deliveryCity : form.deliveryCity ? '__custom__' : ''

  useEffect(() => {
    const sync = () => setLines(readCart())
    sync()
    window.addEventListener('woontegra-cart', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('woontegra-cart', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    const t = getCustomerToken()
    if (!t || !isCustomerToken(t)) {
      setLoggedIn(false)
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const me = await customersApi.getMe()
        const addr = (await customersApi.listAddresses()) as Addr[]
        if (cancelled) return
        setLoggedIn(true)
        setAddresses(addr)
        setForm((f) => ({
          ...f,
          customerName: me.name,
          customerEmail: me.email,
          customerPhone: me.phone ?? f.customerPhone,
        }))
      } catch {
        if (!cancelled) setLoggedIn(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const productIds = useMemo(() => lines.map((l) => l.productId), [lines])

  useEffect(() => {
    if (productIds.length === 0) {
      setPreview([])
      setLoading(false)
      return
    }
    let cancelled = false
    void (async () => {
      try {
        setLoading(true)
        const data = await productsPublicApi.cartPreview(productIds)
        if (!cancelled) {
          setLines((prev) => {
            const aligned = alignCartLinesToCanonicalProductIds(prev, data)
            const changed = aligned.some((l, i) => l.productId !== prev[i]?.productId)
            if (changed) {
              writeCart(aligned)
              Promise.resolve().then(() => window.dispatchEvent(new Event('woontegra-cart')))
              return aligned
            }
            return prev
          })
          setPreview(data)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('Güncel ürün bilgisi alınamadı; kayıtlı sepet bilgileriyle devam edebilirsiniz.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [productIds.join(',')])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const d = await paymentsPublicApi.getBankTransferDisplay()
        if (!cancelled) setBankDisplay(d)
      } catch {
        if (!cancelled) setBankDisplay({ bankTransferEnabled: false, configured: false })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const havaleConfigured = bankDisplay?.bankTransferEnabled === true

  useEffect(() => {
    if (!havaleConfigured && paymentMethod === 'BANK_TRANSFER') {
      setPaymentMethod('CARD')
    }
  }, [havaleConfigured, paymentMethod])

  const merged = useMemo(() => mergeCartWithPreview(lines, preview), [lines, preview])

  const cartHasMkSaas = useMemo(
    () => merged.some((m) => isMuvekkilKasaSaasProduct({ slug: m.slug })),
    [merged],
  )
  const saasLoginRequired = cartHasMkSaas && !loggedIn

  const legalFlags = useMemo(
    () => resolveOrderLegalConsentFlags(merged.map((m) => m.productType)),
    [merged],
  )

  const grand = merged.reduce((s, m) => s + m.lineTotal, 0)
  const currency = merged[0]?.currency || lines[0]?.snapshot?.currency || 'TRY'
  const legalOk = checkoutLegalConsentsOk(legalFlags, {
    pre: acceptPre,
    distance: acceptDistance,
    kvkk: acceptKvkk,
    softwareLicense: acceptSoftwareLicense,
    saasSubscription: acceptSaasSubscription,
    digitalProductWaiver: acceptDigitalProductWaiver,
    digitalServiceWaiver: acceptDigitalServiceWaiver,
  })

  const openLegalModal = (e: React.MouseEvent, id: CheckoutLegalModalId) => {
    e.preventDefault()
    e.stopPropagation()
    setLegalModal(id)
  }

  const legalModalTitle: Record<CheckoutLegalModalId, string> = {
    PRE_INFO: 'Ön Bilgilendirme Formu',
    DISTANCE: 'Mesafeli Satış Sözleşmesi',
    KVKK: 'KVKK Aydınlatma Metni',
    SOFTWARE_LICENSE: 'Yazılım Lisans ve Kullanım Sözleşmesi',
    SAAS_SUBSCRIPTION: 'Woontegra SaaS Abonelik ve Kullanım Sözleşmesi',
    DIGITAL_PRODUCT_WAIVER: 'Dijital Ürün Teslim ve Cayma Hakkı İstisnası',
    DIGITAL_SERVICE_WAIVER: 'Dijital Hizmet Aktivasyon ve Cayma Hakkı İstisnası',
    COMMERCIAL: 'Elektronik Ticari İleti Bilgilendirmesi',
    MARKETING: 'Pazarlama Amaçlı Açık Rıza Metni',
  }

  const legalPreviewVariables = useMemo(
    () =>
      buildCheckoutLegalPreviewVariables({
        form: {
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          billingType: form.billingType,
          companyName: form.companyName,
          taxOffice: form.taxOffice,
          taxNumber: form.taxNumber,
          deliveryCity: form.deliveryCity,
          deliveryDistrict: form.deliveryDistrict,
          deliveryLine: form.deliveryLine,
        },
        merged,
        grand,
        currency,
      }),
    [
      form.customerName,
      form.customerEmail,
      form.customerPhone,
      form.billingType,
      form.companyName,
      form.taxOffice,
      form.taxNumber,
      form.deliveryCity,
      form.deliveryDistrict,
      form.deliveryLine,
      merged,
      grand,
      currency,
    ],
  )

  const legalModalPreviewConfig: Partial<
    Record<CheckoutLegalModalId, { type: LegalDocType; variant?: 'DOWNLOAD' | 'SAAS' }>
  > = {
    PRE_INFO: { type: 'PRE_INFORMATION' },
    DISTANCE: { type: 'DISTANCE_SALES' },
    KVKK: { type: 'KVKK_CLARIFICATION' },
    SOFTWARE_LICENSE: { type: 'SOFTWARE_LICENSE' },
    SAAS_SUBSCRIPTION: { type: 'SAAS_SUBSCRIPTION' },
    DIGITAL_PRODUCT_WAIVER: { type: 'DIGITAL_IMMEDIATE_DELIVERY_WAIVER', variant: 'DOWNLOAD' },
    DIGITAL_SERVICE_WAIVER: { type: 'DIGITAL_IMMEDIATE_DELIVERY_WAIVER', variant: 'SAAS' },
  }

  const setDeliveryCity = (city: string) => {
    setForm((f) => {
      const next = { ...f, deliveryCity: city }
      const opts = districtsForProvince(city)
      if (opts && f.deliveryDistrict && !opts.includes(f.deliveryDistrict)) {
        next.deliveryDistrict = ''
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (lines.length === 0) return
    if (!legalOk) {
      setError('Yasal onayları tamamlamanız gerekir.')
      return
    }
    if (saasLoginRequired) {
      setError(SAAS_LOGIN_REQUIRED_MESSAGE)
      return
    }
    if (paymentMethod === 'BANK_TRANSFER' && !havaleConfigured) {
      setError('Havale/EFT ödeme yöntemi şu anda kullanılamıyor.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const created = await ordersPublicApi.create({
        items: merged.map((m) => ({ productId: m.id, quantity: m.quantity })),
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim() || undefined,
        billingType: form.billingType.trim() || undefined,
        companyName: form.companyName.trim() || undefined,
        taxOffice: form.taxOffice.trim() || undefined,
        taxNumber: form.taxNumber.trim() || undefined,
        deliveryCity: form.deliveryCity.trim() || undefined,
        deliveryDistrict: form.deliveryDistrict.trim() || undefined,
        deliveryLine: form.deliveryLine.trim() || undefined,
        acceptPreInfo: acceptPre,
        acceptDistanceSales: acceptDistance,
        acceptKvkk: acceptKvkk,
        acceptSoftwareLicense: legalFlags.needsSoftwareLicense ? acceptSoftwareLicense : undefined,
        acceptSaasSubscription: legalFlags.needsSaasSubscription ? acceptSaasSubscription : undefined,
        acceptDigitalProductWaiver: legalFlags.needsDigitalProductWaiver ? acceptDigitalProductWaiver : undefined,
        acceptDigitalServiceWaiver: legalFlags.needsDigitalServiceWaiver ? acceptDigitalServiceWaiver : undefined,
        marketingConsent: marketing,
        explicitConsent: explicit,
        paymentMethod: paymentMethod === 'BANK_TRANSFER' ? 'BANK_TRANSFER' : 'PAYTR',
      })
      if (
        loggedIn &&
        saveAddressAfterOrder &&
        getCustomerToken() &&
        isCustomerToken(getCustomerToken()!) &&
        form.deliveryLine.trim() &&
        form.deliveryCity.trim()
      ) {
        try {
          await customersApi.createAddress({
            title: 'Kayıtlı adres',
            fullName: form.customerName.trim(),
            phone: form.customerPhone.trim() || undefined,
            city: form.deliveryCity.trim(),
            district: form.deliveryDistrict.trim() || undefined,
            addressLine: form.deliveryLine.trim(),
            postalCode: undefined,
            taxOffice: form.taxOffice.trim() || undefined,
            taxNumber: form.taxNumber.trim() || undefined,
            companyName: form.companyName.trim() || undefined,
            isDefault: addresses.length === 0,
          })
        } catch {
          /* opsiyonel */
        }
      }
      sessionStorage.setItem('woontegra_last_order_email', form.customerEmail.trim().toLowerCase())
      setLegalModal(null)

      if (paymentMethod === 'BANK_TRANSFER' || created.paymentProvider === 'BANK_TRANSFER') {
        clearCart()
        window.dispatchEvent(new Event('woontegra-cart'))
        navigate(`/siparis-basarili/${encodeURIComponent(created.orderNo)}`)
        return
      }

      setOrderNo(created.orderNo)
      const token = await ordersPublicApi.startPaytr(created.orderNo)
      setIframeToken(token)
      clearCart()
      window.dispatchEvent(new Event('woontegra-cart'))
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(msg || 'Sipariş veya ödeme başlatılamadı.')
    } finally {
      setSubmitting(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-700">Sepetiniz boş.</p>
        <Link to="/sepet" className="mt-6 inline-block font-semibold text-accent-blue hover:underline">
          Sepete dön
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="border-b border-slate-200/90 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Ödeme</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {iframeToken
            ? 'Kart bilgilerinizi aşağıdaki güvenli ödeme penceresinde girin. İşlem tamamlandığında sipariş onay sayfasına yönlendirilirsiniz.'
            : 'Bilgilerinizi kontrol edin, yasal onayları tamamlayın ve güvenli ödeme adımına geçin.'}
        </p>
      </header>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </div>
      )}

      {saasLoginRequired ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">
          {SAAS_LOGIN_REQUIRED_MESSAGE}{' '}
          <Link to={`/giris?return=${encodeURIComponent('/checkout')}`} className="font-semibold text-accent-blue underline">
            Giriş yapın
          </Link>
        </div>
      ) : null}

      {!iframeToken ? (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start lg:gap-10">
          <form id="woo-checkout-form" onSubmit={handleSubmit} className="min-w-0 space-y-6">
            <section className={cardCls}>
              <h2 className="text-lg font-semibold text-slate-900">Müşteri bilgileri</h2>
              {!loggedIn && (
                <p className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  Hesabınız var mı?{' '}
                  <Link to={`/giris?return=${encodeURIComponent('/checkout')}`} className="font-semibold text-accent-blue underline">
                    Giriş yapın
                  </Link>{' '}
                  veya{' '}
                  <Link to="/kayit" className="font-semibold text-accent-blue underline">
                    üye olun
                  </Link>
                  . Üye olmadan da devam edebilirsiniz.
                </p>
              )}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="co-name" className={labelCls}>
                    Ad soyad <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="co-name"
                    required
                    className={`${inputCls} mt-1.5`}
                    value={form.customerName}
                    onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-email" className={labelCls}>
                    E-posta <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="co-email"
                    required
                    type="email"
                    className={`${inputCls} mt-1.5`}
                    value={form.customerEmail}
                    onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-phone" className={labelCls}>
                    Telefon
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    className={`${inputCls} mt-1.5`}
                    value={form.customerPhone}
                    onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                  />
                </div>
              </div>
            </section>

            <section className={cardCls}>
              <h2 className="text-lg font-semibold text-slate-900">Ödeme yöntemi</h2>
              <p className="mt-1 text-sm text-slate-500">Kart ile anında ödeme veya şirket hesabınızdan Havale/EFT.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label
                  className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition hover:border-emerald-300 ${
                    paymentMethod === 'CARD' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-200 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-payment"
                    className="sr-only"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                  />
                  <span className="text-sm font-bold text-slate-900">Kredi Kartı / Banka Kartı</span>
                  <span className="mt-2 text-sm leading-snug text-slate-600">PayTR ile güvenli ödeme</span>
                </label>
                <label
                  className={`relative flex flex-col rounded-2xl border-2 p-4 transition ${
                    !havaleConfigured ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-60' : 'hover:border-sky-300'
                  } ${
                    paymentMethod === 'BANK_TRANSFER' && havaleConfigured
                      ? 'border-sky-600 bg-sky-50/60 shadow-sm'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-payment"
                    className="sr-only"
                    disabled={!havaleConfigured}
                    checked={paymentMethod === 'BANK_TRANSFER'}
                    onChange={() => havaleConfigured && setPaymentMethod('BANK_TRANSFER')}
                  />
                  <span className="text-sm font-bold text-slate-900">Havale / EFT</span>
                  <span className="mt-2 text-sm leading-snug text-slate-600">
                    {havaleConfigured
                      ? 'Banka hesabına ödeme yaptıktan sonra siparişiniz ödeme onayı bekler.'
                      : 'Havale/EFT ödeme yöntemi şu anda kullanılamıyor.'}
                  </span>
                </label>
              </div>

              {paymentMethod === 'BANK_TRANSFER' && havaleConfigured ? (
                <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50/70 px-4 py-4 sm:px-5">
                  <h3 className="text-base font-bold text-sky-950">Havale/EFT bilgileri</h3>
                  <p className="mt-2 text-xs leading-relaxed text-sky-950/90 sm:text-sm">
                    Havale/EFT yaparken açıklama alanına sipariş numaranızı yazınız. Ödemeniz kontrol edildikten sonra siparişiniz onaylanacaktır.
                  </p>
                  <dl className="mt-4 space-y-2 rounded-xl border border-sky-100 bg-white/90 px-3 py-3 text-sm text-slate-800">
                    {bankDisplay?.bankName ? (
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-semibold text-slate-700">Banka</dt>
                        <dd>{bankDisplay.bankName}</dd>
                      </div>
                    ) : null}
                    {bankDisplay?.accountHolder ? (
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-semibold text-slate-700">Alıcı</dt>
                        <dd>{bankDisplay.accountHolder}</dd>
                      </div>
                    ) : null}
                    {bankDisplay?.iban ? (
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-semibold text-slate-700">IBAN</dt>
                        <dd className="break-all font-mono text-xs sm:text-sm">{formatIbanDisplay(bankDisplay.iban)}</dd>
                      </div>
                    ) : null}
                    {bankDisplay?.branchName ? (
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-semibold text-slate-700">Şube</dt>
                        <dd>{bankDisplay.branchName}</dd>
                      </div>
                    ) : null}
                    {bankDisplay?.accountNumber ? (
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-semibold text-slate-700">Hesap no</dt>
                        <dd className="font-mono text-xs">{bankDisplay.accountNumber}</dd>
                      </div>
                    ) : null}
                    <div className="mt-2 border-t border-sky-100 pt-2">
                      <p className="text-xs font-semibold text-slate-700">Açıklama</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        Sipariş numaranız oluşturulduktan sonra ekranda gösterilecektir.
                      </p>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs leading-relaxed text-sky-900/85">
                    Siparişinizi tamamladıktan sonra ödeme açıklaması olarak sipariş numaranızı yazmanız gerekecektir.
                  </p>
                </div>
              ) : null}
            </section>

            <section className={cardCls}>
              <h2 className="text-lg font-semibold text-slate-900">Fatura bilgileri</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="co-billing-type" className={labelCls}>
                    Fatura tipi
                  </label>
                  <select
                    id="co-billing-type"
                    className={`${inputCls} mt-1.5`}
                    value={form.billingType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        billingType: e.target.value as typeof f.billingType,
                      }))
                    }
                  >
                    <option value="">Seçiniz</option>
                    <option value="Bireysel">Bireysel</option>
                    <option value="Kurumsal">Kurumsal</option>
                  </select>
                </div>
                {form.billingType === 'Kurumsal' ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="co-company" className={labelCls}>
                        Şirket adı
                      </label>
                      <input
                        id="co-company"
                        className={`${inputCls} mt-1.5`}
                        value={form.companyName}
                        onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="co-tax-office" className={labelCls}>
                        Vergi dairesi
                      </label>
                      <input
                        id="co-tax-office"
                        className={`${inputCls} mt-1.5`}
                        value={form.taxOffice}
                        onChange={(e) => setForm((f) => ({ ...f, taxOffice: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="co-tax-no" className={labelCls}>
                        Vergi numarası
                      </label>
                      <input
                        id="co-tax-no"
                        className={`${inputCls} mt-1.5`}
                        value={form.taxNumber}
                        onChange={(e) => setForm((f) => ({ ...f, taxNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : null}
                {form.billingType === 'Bireysel' ? (
                  <div>
                    <label htmlFor="co-tckn" className={labelCls}>
                      T.C. kimlik no <span className="font-normal text-slate-500">(isteğe bağlı)</span>
                    </label>
                    <input
                      id="co-tckn"
                      inputMode="numeric"
                      className={`${inputCls} mt-1.5`}
                      value={form.billingType === 'Bireysel' ? form.taxNumber : ''}
                      onChange={(e) => setForm((f) => ({ ...f, taxNumber: e.target.value }))}
                    />
                  </div>
                ) : null}
              </div>
            </section>

            <section className={cardCls}>
              <h2 className="text-lg font-semibold text-slate-900">Adres bilgileri</h2>
              <p className="mt-1 text-sm text-slate-500">Dijital ürün teslimatı için fatura ve kayıtlı adres kullanılır.</p>
              {loggedIn && addresses.length > 0 && (
                <div className="mt-5">
                  <label htmlFor="co-saved-addr" className={labelCls}>
                    Kayıtlı adreslerimden seç
                  </label>
                  <select
                    id="co-saved-addr"
                    className={`${inputCls} mt-1.5`}
                    value={selectedAddressId}
                    onChange={(e) => {
                      const id = e.target.value
                      setSelectedAddressId(id)
                      const a = addresses.find((x) => x.id === id)
                      if (a) {
                        setForm((f) => ({
                          ...f,
                          customerName: a.fullName,
                          customerPhone: a.phone ?? f.customerPhone,
                          companyName: a.companyName ?? '',
                          taxOffice: a.taxOffice ?? '',
                          taxNumber: a.taxNumber ?? '',
                          deliveryCity: a.city,
                          deliveryDistrict: a.district ?? '',
                          deliveryLine: a.addressLine,
                        }))
                      }
                    }}
                  >
                    <option value="">— Manuel doldur —</option>
                    {addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title} — {a.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-city" className={labelCls}>
                    İl
                  </label>
                  <select
                    id="co-city"
                    className={`${inputCls} mt-1.5`}
                    value={citySelectValue}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === '__custom__') {
                        setForm((f) => ({ ...f, deliveryCity: '', deliveryDistrict: '' }))
                      } else if (v === '') {
                        setForm((f) => ({ ...f, deliveryCity: '', deliveryDistrict: '' }))
                      } else {
                        setDeliveryCity(v)
                      }
                    }}
                  >
                    <option value="">Seçiniz</option>
                    {TURKEY_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="__custom__">Liste dışı (elle yaz)</option>
                  </select>
                  {!cityInList && form.deliveryCity ? (
                    <input
                      className={`${inputCls} mt-2`}
                      value={form.deliveryCity}
                      onChange={(e) => setForm((f) => ({ ...f, deliveryCity: e.target.value, deliveryDistrict: '' }))}
                      aria-label="İl (elle)"
                    />
                  ) : citySelectValue === '__custom__' ? (
                    <input
                      className={`${inputCls} mt-2`}
                      value={form.deliveryCity}
                      onChange={(e) => setForm((f) => ({ ...f, deliveryCity: e.target.value, deliveryDistrict: '' }))}
                      placeholder="İl adı"
                      aria-label="İl (elle)"
                    />
                  ) : null}
                </div>
                <div>
                  <label htmlFor="co-district" className={labelCls}>
                    İlçe
                  </label>
                  {districtOptions ? (
                    <select
                      id="co-district"
                      className={`${inputCls} mt-1.5`}
                      value={districtOptions.includes(form.deliveryDistrict) ? form.deliveryDistrict : ''}
                      onChange={(e) => setForm((f) => ({ ...f, deliveryDistrict: e.target.value }))}
                    >
                      <option value="">Seçiniz</option>
                      {districtOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="co-district"
                      className={`${inputCls} mt-1.5`}
                      value={form.deliveryDistrict}
                      onChange={(e) => setForm((f) => ({ ...f, deliveryDistrict: e.target.value }))}
                    />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-line" className={labelCls}>
                    Açık adres
                  </label>
                  <textarea
                    id="co-line"
                    rows={3}
                    className={`${inputCls} mt-1.5 min-h-[5.5rem] resize-y py-2.5`}
                    value={form.deliveryLine}
                    onChange={(e) => setForm((f) => ({ ...f, deliveryLine: e.target.value }))}
                  />
                </div>
                {loggedIn ? (
                  <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      checked={saveAddressAfterOrder}
                      onChange={(e) => setSaveAddressAfterOrder(e.target.checked)}
                    />
                    <span className="text-sm leading-snug text-slate-700">
                      Bu adresi hesabıma kaydet <span className="text-slate-500">(il ve açık adres dolu olmalı)</span>
                    </span>
                  </label>
                ) : null}
              </div>
            </section>

            <section className={cardCls}>
              <h2 className="text-lg font-semibold text-slate-900">Yasal onaylar</h2>
              <ul className="mt-6 space-y-4 text-sm text-slate-700">
                <li className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <input
                    id="a1"
                    type="checkbox"
                    checked={acceptPre}
                    onChange={(e) => setAcceptPre(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="min-w-0 leading-snug">
                    <button
                      type="button"
                      className="font-semibold text-accent-blue underline decoration-accent-blue/30 hover:text-accent-blue/90"
                      onClick={(e) => openLegalModal(e, 'PRE_INFO')}
                    >
                      Ön Bilgilendirme Formu
                    </button>
                    <label htmlFor="a1" className="cursor-pointer">
                      ’nu okudum ve onaylıyorum. <span className="text-red-600">*</span>
                    </label>
                  </div>
                </li>
                <li className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <input
                    id="a2"
                    type="checkbox"
                    checked={acceptDistance}
                    onChange={(e) => setAcceptDistance(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="min-w-0 leading-snug">
                    <button
                      type="button"
                      className="font-semibold text-accent-blue underline decoration-accent-blue/30 hover:text-accent-blue/90"
                      onClick={(e) => openLegalModal(e, 'DISTANCE')}
                    >
                      Mesafeli Satış Sözleşmesi
                    </button>
                    <label htmlFor="a2" className="cursor-pointer">
                      ’ni okudum ve onaylıyorum. <span className="text-red-600">*</span>
                    </label>
                  </div>
                </li>
                <li className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <input
                    id="a3"
                    type="checkbox"
                    checked={acceptKvkk}
                    onChange={(e) => setAcceptKvkk(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="min-w-0 leading-snug">
                    <button
                      type="button"
                      className="font-semibold text-accent-blue underline decoration-accent-blue/30 hover:text-accent-blue/90"
                      onClick={(e) => openLegalModal(e, 'KVKK')}
                    >
                      KVKK Aydınlatma Metni
                    </button>
                    <label htmlFor="a3" className="cursor-pointer">
                      ’ni okudum. <span className="text-red-600">*</span>
                    </label>
                  </div>
                </li>
                {legalFlags.needsSoftwareLicense ? (
                  <li className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                    <input
                      id="a-sw"
                      type="checkbox"
                      checked={acceptSoftwareLicense}
                      onChange={(e) => setAcceptSoftwareLicense(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="min-w-0 leading-snug">
                      <button
                        type="button"
                        className="font-semibold text-accent-blue underline decoration-accent-blue/30 hover:text-accent-blue/90"
                        onClick={(e) => openLegalModal(e, 'SOFTWARE_LICENSE')}
                      >
                        Yazılım Lisans ve Kullanım Sözleşmesi
                      </button>
                      <label htmlFor="a-sw" className="cursor-pointer">
                        ’ni okudum ve onaylıyorum. <span className="text-red-600">*</span>
                      </label>
                    </div>
                  </li>
                ) : null}
                {legalFlags.needsSaasSubscription ? (
                  <li className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                    <input
                      id="a-saas"
                      type="checkbox"
                      checked={acceptSaasSubscription}
                      onChange={(e) => setAcceptSaasSubscription(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="min-w-0 leading-snug">
                      <button
                        type="button"
                        className="font-semibold text-accent-blue underline decoration-accent-blue/30 hover:text-accent-blue/90"
                        onClick={(e) => openLegalModal(e, 'SAAS_SUBSCRIPTION')}
                      >
                        Woontegra SaaS Abonelik ve Kullanım Sözleşmesi
                      </button>
                      <label htmlFor="a-saas" className="cursor-pointer">
                        ’ni okudum ve onaylıyorum. <span className="text-red-600">*</span>
                      </label>
                    </div>
                  </li>
                ) : null}
                {legalFlags.needsDigitalProductWaiver ? (
                  <li className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                    <input
                      id="a-dpw"
                      type="checkbox"
                      checked={acceptDigitalProductWaiver}
                      onChange={(e) => setAcceptDigitalProductWaiver(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="a-dpw" className="min-w-0 cursor-pointer leading-snug">
                      Dijital ürünün/kurulum dosyasının ödeme sonrası tarafıma sunulmasını ve bu kapsamda cayma hakkı istisnası hakkında bilgilendirildiğimi kabul
                      ediyorum. (
                      <button
                        type="button"
                        className="font-semibold text-accent-blue underline decoration-accent-blue/30 hover:text-accent-blue/90"
                        onClick={(e) => openLegalModal(e, 'DIGITAL_PRODUCT_WAIVER')}
                      >
                        metin
                      </button>
                      ) <span className="text-red-600">*</span>
                    </label>
                  </li>
                ) : null}
                {legalFlags.needsDigitalServiceWaiver ? (
                  <li className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                    <input
                      id="a-dsw"
                      type="checkbox"
                      checked={acceptDigitalServiceWaiver}
                      onChange={(e) => setAcceptDigitalServiceWaiver(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="a-dsw" className="min-w-0 cursor-pointer leading-snug">
                      Aboneliğimin ödeme sonrası hemen aktif edilmesini, dijital hizmetin ifasına başlanmasını ve bu kapsamda cayma hakkı istisnası hakkında
                      bilgilendirildiğimi kabul ediyorum. (
                      <button
                        type="button"
                        className="font-semibold text-accent-blue underline decoration-accent-blue/30 hover:text-accent-blue/90"
                        onClick={(e) => openLegalModal(e, 'DIGITAL_SERVICE_WAIVER')}
                      >
                        metin
                      </button>
                      ) <span className="text-red-600">*</span>
                    </label>
                  </li>
                ) : null}
                <li className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <input
                    id="a4"
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="a4" className="min-w-0 cursor-pointer leading-snug">
                    Kampanya ve duyurular için elektronik ileti almak istiyorum. (
                    <button
                      type="button"
                      className="text-accent-blue underline decoration-accent-blue/30 hover:text-accent-blue/90"
                      onClick={(e) => openLegalModal(e, 'COMMERCIAL')}
                    >
                      bilgi
                    </button>
                    )
                  </label>
                </li>
                <li className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <input
                    id="a5"
                    type="checkbox"
                    checked={explicit}
                    onChange={(e) => setExplicit(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="a5" className="min-w-0 cursor-pointer leading-snug">
                    Kişisel verilerimin pazarlama amacıyla işlenmesine açık rıza veriyorum. (
                    <button
                      type="button"
                      className="text-accent-blue underline decoration-accent-blue/30 hover:text-accent-blue/90"
                      onClick={(e) => openLegalModal(e, 'MARKETING')}
                    >
                      metin
                    </button>
                    )
                  </label>
                </li>
              </ul>
            </section>
          </form>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-24">
            <div className={cardCls}>
              <h2 className="text-lg font-semibold text-slate-900">Sipariş özeti</h2>
              {loading && preview.length === 0 ? (
                <p className="mt-6 text-sm text-slate-600">Güncel fiyat bilgisi yükleniyor…</p>
              ) : null}
              {merged.length > 0 && (
                <>
                  <ul className="mt-6 divide-y divide-slate-100">
                    {merged.map((m) => (
                      <li key={m.id} className="flex gap-4 py-4 first:pt-0">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                          {m.coverImage ? (
                            <MediaThumb url={m.coverImage} fileType="IMAGE" className="h-full w-full min-h-[4rem]" alt="" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">Ürün</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 font-medium leading-snug text-slate-900">{m.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {isWebBasedCheckoutProduct(m.productType) ? (
                              <>
                                Kullanım süresi: {m.quantity} yıl · Birim fiyat: {formatMoneyAmount(m.price, m.currency)}
                                {productPricePeriodSuffix(m.productType)}
                              </>
                            ) : (
                              <>
                                Adet: {m.quantity} · Birim fiyat: {formatMoneyAmount(m.price, m.currency)}
                                {productPricePeriodSuffix(m.productType)}
                              </>
                            )}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">Ara toplam: {formatMoneyAmount(m.lineTotal, m.currency)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Ara toplam</span>
                      <span className="font-medium text-slate-900">{formatMoneyAmount(grand, currency)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900">
                      <span>Toplam</span>
                      <span>{formatMoneyAmount(grand, currency)}</span>
                    </div>
                  </div>
                  {paymentMethod === 'CARD' ? (
                    <>
                      <div className="mt-5 flex gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-3 text-xs leading-relaxed text-emerald-950">
                        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
                        <span>
                          Ödeme onayından sonra sipariş özeti e-postanıza gönderilir. Masaüstü ürünlerde indirme bağlantısı;
                          web tabanlı programlarda erişim bilgileri e-posta ile paylaşılır.
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2 text-xs text-slate-500">
                        <Lock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                        <span>256 bit SSL ile şifreli bağlantı; kart bilgileriniz bizde saklanmaz.</span>
                      </div>
                    </>
                  ) : (
                    <p className="mt-5 rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-3 text-xs leading-relaxed text-sky-950">
                      Siparişiniz ödeme onayı sonrası işleme alınır.
                    </p>
                  )}
                </>
              )}
              <div className="mt-6 border-t border-slate-200 pt-6">
                <button
                  type="submit"
                  form="woo-checkout-form"
                  disabled={submitting || !legalOk || saasLoginRequired}
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'İşleniyor…' : paymentMethod === 'CARD' ? 'Güvenli ödeme ile devam et' : 'Siparişi oluştur'}
                </button>
                {paymentMethod === 'CARD' ? (
                  <p className="mt-3 text-center text-xs text-slate-500">Ödeme PayTR güvenli ödeme altyapısı ile alınır.</p>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <section className={`${cardCls} max-w-none`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Güvenli ödeme</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">PayTR ile ödeme</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Sipariş numaranız: <span className="font-mono font-semibold text-slate-900">{orderNo}</span>. Ödeme onayından sonra
              sipariş özeti ve indirme bağlantıları e-posta adresinize gönderilir.
            </p>
            <p className="mt-2 text-xs text-slate-500">Ödeme formu PayTR altyapısında açılır; kart bilgileriniz bizde saklanmaz.</p>
          </section>
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <iframe
              title="PayTR Ödeme"
              src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
              className="block min-h-[70dvh] w-full border-0 sm:min-h-[900px]"
              allow="payment *"
            />
          </div>
        </div>
      )}

      {legalModal ? (
        <CheckoutLegalModal
          open
          title={legalModalTitle[legalModal]}
          showReadAndClose={
            legalModal === 'PRE_INFO' ||
            legalModal === 'DISTANCE' ||
            legalModal === 'KVKK' ||
            legalModal === 'SOFTWARE_LICENSE' ||
            legalModal === 'SAAS_SUBSCRIPTION' ||
            legalModal === 'DIGITAL_PRODUCT_WAIVER' ||
            legalModal === 'DIGITAL_SERVICE_WAIVER'
          }
          onClose={() => setLegalModal(null)}
        >
          {legalModalPreviewConfig[legalModal] ? (
            <CheckoutLegalPreviewBody
              type={legalModalPreviewConfig[legalModal]!.type}
              variant={legalModalPreviewConfig[legalModal]!.variant}
              variables={legalPreviewVariables}
            />
          ) : null}
          {legalModal === 'COMMERCIAL' ? <CheckoutElectronicMessageBody /> : null}
          {legalModal === 'MARKETING' ? <CheckoutMarketingConsentBody /> : null}
        </CheckoutLegalModal>
      ) : null}
    </div>
  )
}
