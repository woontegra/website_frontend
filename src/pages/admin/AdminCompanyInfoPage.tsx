import { AdminCompanyInfoEditor } from '../../components/admin/AdminCompanyInfoEditor'

export function AdminCompanyInfoPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="page-title mb-2">Firma Bilgileri</h1>
      <p className="mb-6 text-sm text-slate-600">
        Telefon, e-posta, adres ve yasal bilgileri tek yerden yönetin. KVKK, Gizlilik Politikası, İletişim sayfası ve
        footer bu bilgileri otomatik kullanır.
      </p>
      <AdminCompanyInfoEditor />
    </div>
  )
}
