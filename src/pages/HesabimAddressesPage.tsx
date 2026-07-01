import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { customersApi } from '../api/customers-api'
import { TURKEY_PROVINCES, districtsForProvince } from '../data/turkeyLocation'

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
  isDefault: boolean
}

const empty = {
  title: '',
  fullName: '',
  phone: '',
  city: '',
  district: '',
  addressLine: '',
  postalCode: '',
  taxOffice: '',
  taxNumber: '',
  companyName: '',
  isDefault: false,
}

const inputCls =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20'

function Field({
  id,
  label,
  children,
  className = '',
}: {
  id?: string
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      {id ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : (
        <span className="block text-sm font-medium text-slate-700">{label}</span>
      )}
      {children}
    </div>
  )
}

function AddressFormFields({
  form,
  setForm,
  setCity,
  districtOptions,
  cityInList,
}: {
  form: typeof empty
  setForm: React.Dispatch<React.SetStateAction<typeof empty>>
  setCity: (city: string) => void
  districtOptions: readonly string[] | null
  cityInList: boolean
}) {
  return (
    <div className="grid max-h-[65vh] gap-5 overflow-y-auto pr-1 sm:grid-cols-2">
      <Field id="addr-title" label="Adres başlığı">
        <input id="addr-title" className={inputCls} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
      </Field>
      <Field id="addr-fullname" label="Ad soyad">
        <input id="addr-fullname" className={inputCls} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} required autoComplete="name" />
      </Field>
      <Field id="addr-phone" label="Telefon">
        <input id="addr-phone" type="tel" className={inputCls} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} autoComplete="tel" />
      </Field>
      <Field id="addr-province" label="İl">
        <select id="addr-province" className={inputCls} value={form.city} onChange={(e) => setCity(e.target.value)} required>
          <option value="" disabled>
            İl seçin
          </option>
          {TURKEY_PROVINCES.map((il) => (
            <option key={il} value={il}>
              {il}
            </option>
          ))}
          {form.city && !cityInList ? <option value={form.city}>{form.city}</option> : null}
        </select>
      </Field>
      <Field id="addr-district" label="İlçe">
        {districtOptions ? (
          <select id="addr-district" className={inputCls} value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} disabled={!form.city}>
            <option value="">İlçe seçin (opsiyonel)</option>
            {districtOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        ) : (
          <input id="addr-district" className={inputCls} value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} />
        )}
      </Field>
      <Field id="addr-postal" label="Posta kodu">
        <input id="addr-postal" className={inputCls} value={form.postalCode} onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))} inputMode="numeric" />
      </Field>
      <Field id="addr-tax-office" label="Vergi dairesi">
        <input id="addr-tax-office" className={inputCls} value={form.taxOffice} onChange={(e) => setForm((f) => ({ ...f, taxOffice: e.target.value }))} />
      </Field>
      <Field id="addr-tax-no" label="Vergi numarası">
        <input id="addr-tax-no" className={inputCls} value={form.taxNumber} onChange={(e) => setForm((f) => ({ ...f, taxNumber: e.target.value }))} />
      </Field>
      <Field id="addr-company" label="Şirket adı" className="sm:col-span-2">
        <input id="addr-company" className={inputCls} value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} />
      </Field>
      <Field id="addr-line" label="Açık adres" className="sm:col-span-2">
        <textarea
          id="addr-line"
          className={`${inputCls} min-h-[110px] resize-y`}
          value={form.addressLine}
          onChange={(e) => setForm((f) => ({ ...f, addressLine: e.target.value }))}
          required
          autoComplete="street-address"
        />
      </Field>
      <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-700 sm:col-span-2">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} />
        Varsayılan adres olarak kaydet
      </label>
    </div>
  )
}

export function HesabimAddressesPage() {
  const [rows, setRows] = useState<Addr[]>([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const districtOptions = useMemo(() => districtsForProvince(form.city), [form.city])
  const cityInList = !form.city || TURKEY_PROVINCES.includes(form.city)

  const load = async () => {
    const data = (await customersApi.listAddresses()) as Addr[]
    setRows(data)
  }

  useEffect(() => {
    void load().catch(() => setError('Adresler yüklenemedi.'))
  }, [])

  const setCity = (city: string) => {
    setForm((f) => {
      const next = { ...f, city }
      const opts = districtsForProvince(city)
      if (opts && f.district && !opts.includes(f.district)) {
        next.district = ''
      }
      return next
    })
  }

  const openNew = () => {
    setEditingId(null)
    setForm(empty)
    setModalOpen(true)
    setError(null)
  }

  const startEdit = (a: Addr) => {
    setEditingId(a.id)
    setForm({
      title: a.title,
      fullName: a.fullName,
      phone: a.phone ?? '',
      city: a.city,
      district: a.district ?? '',
      addressLine: a.addressLine,
      postalCode: a.postalCode ?? '',
      taxOffice: a.taxOffice ?? '',
      taxNumber: a.taxNumber ?? '',
      companyName: a.companyName ?? '',
      isDefault: a.isDefault,
    })
    setModalOpen(true)
    setError(null)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm(empty)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (editingId) {
        await customersApi.patchAddress(editingId, { ...form, isDefault: form.isDefault })
      } else {
        await customersApi.createAddress({ ...form })
      }
      closeModal()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız')
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await customersApi.deleteAddress(deleteId)
      setDeleteId(null)
      await load()
    } catch {
      setError('Adres silinemedi.')
      setDeleteId(null)
    }
  }

  const setDefault = async (id: string) => {
    await customersApi.patchAddress(id, { isDefault: true })
    await load()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Adreslerim</h2>
          <p className="mt-1 text-sm text-slate-600">Teslimat ve fatura için kayıtlı adreslerinizi yönetin.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Yeni adres ekle
        </button>
      </div>

      {error && !modalOpen && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">
          <p className="text-base font-semibold text-slate-900">Kayıtlı adresiniz bulunmuyor.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">Checkout sürecinde veya buradan yeni adres ekleyebilirsiniz.</p>
          <button
            type="button"
            onClick={openNew}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
          >
            Yeni adres ekle
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {rows.map((a) => (
            <li key={a.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-base font-bold text-slate-900">{a.title}</p>
                  {a.isDefault ? (
                    <span className="mt-1 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-900">Varsayılan adres</span>
                  ) : null}
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{a.fullName}</p>
              {a.phone ? <p className="mt-1 text-sm text-slate-600">{a.phone}</p> : null}
              <p className="mt-2 text-sm text-slate-600">
                {a.city}
                {a.district ? ` / ${a.district}` : ''}
              </p>
              <p className="mt-2 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{a.addressLine}</p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {!a.isDefault ? (
                  <button type="button" className="text-sm font-semibold text-emerald-700 hover:underline" onClick={() => void setDefault(a.id)}>
                    Varsayılan yap
                  </button>
                ) : null}
                <button type="button" className="text-sm font-semibold text-slate-800 hover:underline" onClick={() => startEdit(a)}>
                  Düzenle
                </button>
                <button type="button" className="text-sm font-semibold text-red-700 hover:underline" onClick={() => setDeleteId(a.id)}>
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Adresi düzenle' : 'Yeni adres'}</h3>
              <p className="mt-0.5 text-sm text-slate-600">Bilgilerinizi eksiksiz doldurun; kayıt sonrası istediğiniz zaman güncelleyebilirsiniz.</p>
            </div>
            <form onSubmit={save} className="flex flex-col gap-5 px-5 py-5 sm:px-6">
              {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
              <AddressFormFields form={form} setForm={setForm} setCity={setCity} districtOptions={districtOptions} cityInList={cityInList} />
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button type="submit" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
                  Kaydet
                </button>
                <button type="button" className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50" onClick={closeModal}>
                  Vazgeç
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteId ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-labelledby="del-addr-title">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 id="del-addr-title" className="text-lg font-bold text-slate-900">
              Adresi sil
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">Bu adresi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button type="button" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50" onClick={() => setDeleteId(null)}>
                Vazgeç
              </button>
              <button type="button" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700" onClick={() => void confirmDelete()}>
                Sil
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
