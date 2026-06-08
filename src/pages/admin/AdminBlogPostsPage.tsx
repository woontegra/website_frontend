import { AdminBlogPostsEditor } from '../../components/admin/AdminBlogPostsEditor'

export function AdminBlogPostsPage() {
  return (
    <div>
      <h1 className="page-title mb-2">Blog Yazıları</h1>
      <p className="mb-6 text-sm text-slate-600">
        Blog yazılarını ekleyin, düzenleyin ve yayın durumunu yönetin. Sayfa hero alanı İçerik Düzenle &gt; Blog
        bölümünden yönetilmeye devam eder.
      </p>
      <AdminBlogPostsEditor />
    </div>
  )
}
