import { Link } from 'react-router-dom'

export function BlogPostsManageNotice() {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
      <p>Blog yazıları artık <strong>Blog Yazıları</strong> bölümünden yönetilir. Bu sayfada yalnızca hero ve CTA alanları düzenlenir.</p>
      <Link
        to="/admin/blog-yazilari"
        className="mt-2 inline-flex font-semibold text-emerald-700 underline-offset-4 hover:underline"
      >
        Blog Yazılarını Yönet →
      </Link>
    </div>
  )
}
