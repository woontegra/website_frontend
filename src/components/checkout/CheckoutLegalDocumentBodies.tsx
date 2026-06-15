import type { ReactNode } from 'react'
import type { LegalCompanyInfo } from '../../data/legalCompanyInfo'
import type { MergedCartRow } from '../../lib/cartMerge'
import { formatMoneyAmount } from '../../lib/formatMoney'
import { productPricePeriodSuffix } from '../../lib/formatProductPrice'
import { checkoutProductKindLabel, isWebBasedCheckoutProduct } from '../../lib/checkoutProductLabels'

export type CheckoutLegalFormFields = {
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryCity: string
  deliveryDistrict: string
  deliveryLine: string
}

function displayWebsite(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

function hasBuyerDetails(f: CheckoutLegalFormFields): boolean {
  return Boolean(
    f.customerName.trim() ||
      f.customerEmail.trim() ||
      f.customerPhone.trim() ||
      f.deliveryLine.trim() ||
      f.deliveryCity.trim(),
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 scroll-mt-4 border-b border-slate-200 pb-2 text-base font-bold text-slate-900 first:mt-0">{children}</h3>
}

function MutedP({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-slate-700">{children}</p>
}

function ProductTable({ rows }: { rows: MergedCartRow[] }) {
  if (rows.length === 0) {
    return <p className="mt-2 text-sm text-slate-600">Sepet satırı bulunmuyor.</p>
  }
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <th className="px-3 py-2">Ürün adı</th>
            <th className="px-3 py-2">Ürün tipi</th>
            <th className="px-3 py-2">Adet / süre</th>
            <th className="px-3 py-2 text-right">Birim fiyat</th>
            <th className="px-3 py-2 text-right">Satır toplamı</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => {
            const web = isWebBasedCheckoutProduct(m.productType)
            const qtyLabel = web ? `${m.quantity} yıl kullanım` : `${m.quantity} adet`
            return (
              <tr key={m.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-2.5 font-medium text-slate-900">{m.name}</td>
                <td className="px-3 py-2.5 text-slate-700">{checkoutProductKindLabel(m.productType)}</td>
                <td className="px-3 py-2.5 text-slate-700">{qtyLabel}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-800">
                  {formatMoneyAmount(m.price, m.currency)}
                  <span className="text-xs font-normal text-slate-500">{productPricePeriodSuffix(m.productType)}</span>
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-slate-900">{formatMoneyAmount(m.lineTotal, m.currency)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function PriceBlock({
  grand,
  currency,
  paymentMethodLabel,
  paymentProcessNote,
}: {
  grand: number
  currency: string
  paymentMethodLabel: string
  paymentProcessNote: string
}) {
  const subtotal = grand
  const discount = 0
  return (
    <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm">
      <div className="flex justify-between tabular-nums text-slate-700">
        <span>Ara toplam</span>
        <span className="font-medium text-slate-900">{formatMoneyAmount(subtotal, currency)}</span>
      </div>
      {discount > 0 ? (
        <div className="flex justify-between tabular-nums text-emerald-800">
          <span>İndirim</span>
          <span>−{formatMoneyAmount(discount, currency)}</span>
        </div>
      ) : null}
      <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold tabular-nums text-slate-900">
        <span>Genel toplam</span>
        <span>{formatMoneyAmount(grand, currency)}</span>
      </div>
      <p className="pt-1 text-xs leading-relaxed text-slate-600">
        Ödeme yöntemi: {paymentMethodLabel}. {paymentProcessNote}
      </p>
    </div>
  )
}

export function CheckoutPreInformationBody({
  company,
  form,
  merged,
  grand,
  currency,
  paymentMethodLabel,
  paymentProcessNote,
}: {
  company: LegalCompanyInfo
  form: CheckoutLegalFormFields
  merged: MergedCartRow[]
  grand: number
  currency: string
  paymentMethodLabel: string
  paymentProcessNote: string
}) {
  const sellerAddr = [company.address?.trim(), [company.district, company.city].filter(Boolean).join(' / ')].filter(Boolean).join(' — ')
  const hasAddr = Boolean(company.address?.trim())

  return (
    <article className="text-sm leading-relaxed text-slate-800">
      <p className="rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2 text-slate-600">
        Bu metin, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği çerçevesinde sunulan ön bilgilendirme özetidir. Siparişiniz,
        ödeme adımında verdiğiniz bilgiler ve sepetinizdeki ürünler esas alınarak oluşturulur.
      </p>

      <SectionTitle>1. Satıcı bilgileri</SectionTitle>
      <ul className="mt-3 list-none space-y-2 text-slate-700">
        <li>
          <span className="font-semibold text-slate-900">Ticaret unvanı: </span>
          {company.companyName}
        </li>
        <li>
          <span className="font-semibold text-slate-900">E-posta: </span>
          <a href={`mailto:${company.email}`} className="text-emerald-700 underline decoration-emerald-700/30 hover:text-emerald-800">
            {company.email}
          </a>
        </li>
        <li>
          <span className="font-semibold text-slate-900">Web sitesi: </span>
          {displayWebsite(company.website || 'https://woontegra.com')}
        </li>
        <li>
          <span className="font-semibold text-slate-900">Adres: </span>
          {hasAddr ? (
            <span>{sellerAddr}</span>
          ) : (
            <span className="text-slate-600">Satıcı adres bilgisi sipariş ve fatura bilgilerinde yer alır.</span>
          )}
        </li>
      </ul>

      <SectionTitle>2. Alıcı bilgileri</SectionTitle>
      {hasBuyerDetails(form) ? (
        <ul className="mt-3 list-none space-y-2 text-slate-700">
          {form.customerName.trim() ? (
            <li>
              <span className="font-semibold text-slate-900">Ad ve soyad: </span>
              {form.customerName.trim()}
            </li>
          ) : null}
          {form.customerEmail.trim() ? (
            <li>
              <span className="font-semibold text-slate-900">E-posta: </span>
              {form.customerEmail.trim()}
            </li>
          ) : null}
          {form.customerPhone.trim() ? (
            <li>
              <span className="font-semibold text-slate-900">Telefon: </span>
              {form.customerPhone.trim()}
            </li>
          ) : null}
          {(form.deliveryLine.trim() || form.deliveryCity.trim()) && (
            <li>
              <span className="font-semibold text-slate-900">Teslimat / iletişim adresi: </span>
              {[form.deliveryLine.trim(), [form.deliveryDistrict, form.deliveryCity].filter(Boolean).join(' / ')].filter(Boolean).join(' — ')}
            </li>
          )}
        </ul>
      ) : (
        <MutedP>Alıcı bilgileri, ödeme formunda doldurulan bilgiler esas alınarak oluşturulur.</MutedP>
      )}

      <SectionTitle>3. Ürün / hizmet bilgileri</SectionTitle>
      <ProductTable rows={merged} />

      <SectionTitle>4. Fiyat ve ödeme bilgileri</SectionTitle>
      <PriceBlock
        grand={grand}
        currency={currency}
        paymentMethodLabel={paymentMethodLabel}
        paymentProcessNote={paymentProcessNote}
      />

      <SectionTitle>5. Teslimat / erişim bilgileri</SectionTitle>
      <MutedP>
        <strong className="text-slate-900">Masaüstü programlar:</strong> Ödeme onayınızın ardından indirme ve kuruluma yönelik yönergeler ile gerekli bağlantılar,
        kayıtlı e-posta adresinize iletilir.
      </MutedP>
      <MutedP>
        <strong className="text-slate-900">Web tabanlı programlar:</strong> Kullanım hesabınız Woontegra tarafından oluşturulur; giriş ve kullanıma ilişkin bilgiler
        ödeme onayından sonra e-posta ile paylaşılır.
      </MutedP>

      <SectionTitle>6. Cayma hakkı bilgilendirmesi</SectionTitle>
      <MutedP>
        Dijital içerik, yazılım lisansı ve web tabanlı hizmetlerde; hizmetin ifasına başlanması, lisans/erişim bilgilerinin oluşturulması veya dijital teslimatın
        yapılması sonrasında cayma hakkının kullanımına ilişkin sınırlamalar uygulanabilir. Ayrıntılı düzenlemeler mesafeli satış sözleşmesi ve ilgili mevzuatta yer
        alır.
      </MutedP>

      <SectionTitle>7. Uyuşmazlık ve başvuru</SectionTitle>
      <MutedP>
        Tüketici işlemlerinde, ilgili mevzuat kapsamında tüketici hakem heyetlerine ve tüketici mahkemelerine başvurma imkânınız saklıdır.
      </MutedP>
    </article>
  )
}

export function CheckoutDistanceSalesBody({
  company,
  form,
  merged,
  grand,
  currency,
  paymentMethodLabel,
  paymentProviderLine,
  paymentProcessNote,
}: {
  company: LegalCompanyInfo
  form: CheckoutLegalFormFields
  merged: MergedCartRow[]
  grand: number
  currency: string
  paymentMethodLabel: string
  paymentProviderLine: string
  paymentProcessNote: string
}) {
  const buyerLabel = hasBuyerDetails(form)
    ? [form.customerName.trim(), form.customerEmail.trim()].filter(Boolean).join(' — ') || 'Ödeme formunda belirtilen alıcı'
    : 'Ödeme formunda belirtilen alıcı'

  return (
    <article className="text-sm leading-relaxed text-slate-800">
      <p className="rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2 text-slate-600">
        İşbu sözleşme metni, mesafeli satışa ilişkin temel hususları özetler; sipariş ve ödeme onayı ile birlikte tarafların iradesi doğrultusunda uygulanır.
      </p>

      <SectionTitle>1. Taraflar</SectionTitle>
      <MutedP>
        <strong className="text-slate-900">Satıcı:</strong> {company.companyName}
      </MutedP>
      <MutedP>
        <strong className="text-slate-900">Alıcı:</strong> {buyerLabel}
      </MutedP>

      <SectionTitle>2. Sözleşmenin konusu</SectionTitle>
      <MutedP>
        İşbu sözleşmenin konusu; alıcının Woontegra üzerinden satın aldığı masaüstü yazılım, web tabanlı program ve/veya dijital hizmete ilişkin satış, bedel, ödeme,
        teslim/erişim ve tarafların hak ve yükümlülüklerinin düzenlenmesidir.
      </MutedP>

      <SectionTitle>3. Ürün / hizmet bilgileri</SectionTitle>
      <ProductTable rows={merged} />

      <SectionTitle>4. Fiyat ve ödeme</SectionTitle>
      <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">Toplam ödeme tutarı: </span>
          <span className="tabular-nums font-bold text-slate-900">{formatMoneyAmount(grand, currency)}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-900">Ödeme yöntemi: </span>
          {paymentMethodLabel}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Ödeme altyapısı / kanal: </span>
          {paymentProviderLine}
        </p>
        <p className="text-xs leading-relaxed text-slate-600">{paymentProcessNote}</p>
      </div>

      <SectionTitle>5. Teslimat ve kullanım</SectionTitle>
      <MutedP>
        <strong className="text-slate-900">Masaüstü ürünler:</strong> İndirme ve kuruluma ilişkin bilgiler ödeme onayından sonra e-posta ile iletilir.
      </MutedP>
      <MutedP>
        <strong className="text-slate-900">Web tabanlı ürünler:</strong> Kullanım hesabı Woontegra tarafından açılır; giriş bilgileri ödeme onayından sonra e-posta
        ile gönderilir.
      </MutedP>

      <SectionTitle>6. Cayma hakkı</SectionTitle>
      <MutedP>
        Dijital ürün, yazılım lisansı ve web tabanlı hizmet satışlarında cayma hakkına ilişkin düzenlemeler ilgili mevzuata tabidir. Teslimatın/erişimin sağlanması
        veya lisans/erişim bilgilerinin oluşturulması gibi aşamalardan sonra cayma hakkının kullanımına ilişkin sınırlamalar söz konusu olabilir; ayrıntılar mevzuat
        ve işbu özet metinle sınırlı olmayan hükümler çerçevesinde değerlendirilir.
      </MutedP>

      <SectionTitle>7. Alıcının yükümlülükleri</SectionTitle>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
        <li>Ödeme ve iletişim bilgilerinin doğru ve güncel olmasından sorumludur.</li>
        <li>Erişim bilgilerinin gizliliğini ve güvenliğini sağlamakla yükümlüdür.</li>
        <li>Yazılım veya hizmeti hukuka ve lisans koşullarına aykırı şekilde kullanmamalıdır.</li>
      </ul>

      <SectionTitle>8. Satıcının yükümlülükleri</SectionTitle>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
        <li>Ödeme onayı sonrasında ürün/hizmete erişim ve kullanım için gerekli bilgileri iletmek.</li>
        <li>Destek kanalları üzerinden makul ölçüde teknik destek sağlamak.</li>
        <li>Siparişe ilişkin kayıtları sisteminde tutmak.</li>
      </ul>

      <SectionTitle>9. Uyuşmazlıkların çözümü</SectionTitle>
      <MutedP>
        Uyuşmazlıklarda ilgili mevzuat uyarınca tüketici hakem heyetleri ve tüketici mahkemeleri yetkilidir.
      </MutedP>
    </article>
  )
}

export function CheckoutElectronicMessageBody() {
  return (
    <article className="prose prose-slate max-w-none text-sm leading-relaxed prose-p:text-slate-700">
      <p>
        Onay vermeniz halinde; kampanya, duyuru, ürün güncellemesi, bakım bildirimi ve benzeri ticari elektronik iletiler e-posta, kısa mesaj (SMS), anlık bildirim
        veya WhatsApp gibi kanallar üzerinden tarafınıza iletilebilir.
      </p>
      <p>Bu onay tamamen isteğe bağlıdır; vermemeniz halinde zorunlu sipariş ve hesap bilgilendirmeleriniz etkilenmez.</p>
      <p>İleti tercihlerinizi dilediğiniz zaman güncelleyebilir veya abonelikten çıkabilirsiniz.</p>
    </article>
  )
}

export function CheckoutMarketingConsentBody() {
  return (
    <article className="prose prose-slate max-w-none text-sm leading-relaxed prose-p:text-slate-700">
      <p>
        Bu kapsamda kişisel verileriniz; kampanya, tanıtım, pazarlama, müşteri memnuniyeti ölçümü ve ürün bilgilendirme amaçlarıyla işlenebilir. Bu işleme yönelik
        açık rızanız serbesttir.
      </p>
      <p>Bu onayı vermemeniz, zorunlu sözleşme ve sipariş süreçlerinden yararlanmanızı engellemez.</p>
      <p>Kişisel verilerinizin hukuki sebepleri ve haklarınıza ilişkin ayrıntılar için KVKK Aydınlatma Metni’ne başvurabilirsiniz.</p>
    </article>
  )
}
