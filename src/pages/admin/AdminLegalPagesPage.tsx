import { AdminLegalPagesEditor } from '../../components/admin/AdminLegalPagesEditor'

export function AdminLegalPagesPage() {
  return (
    <div>
      <h1 className="page-title mb-2">Yasal Sayfalar</h1>
      <p className="mb-4 text-sm text-slate-600">
        KVKK, Gizlilik, Çerez, Açık Rıza ve Kullanım Şartları metin bölümlerini düzenleyin.
      </p>
      <AdminLegalPagesEditor />
    </div>
  )
}
