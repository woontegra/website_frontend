import { useState } from 'react'
import { Plus, Trash2, Star } from 'lucide-react'
import type { BlogPostsSectionData, BlogPost } from '../../../types/sections'

interface BlogPostsEditorProps {
  data: BlogPostsSectionData
  onChange: (data: BlogPostsSectionData) => void
}

export function BlogPostsEditor({ data, onChange }: BlogPostsEditorProps) {
  const [localData, setLocalData] = useState(data)

  const handleChange = (newData: BlogPostsSectionData) => {
    setLocalData(newData)
    onChange(newData)
  }

  const addPost = () => {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      slug: '',
      title: 'Yeni Blog Yazısı',
      excerpt: '',
      category: 'Yazılım',
      image: '/images/blog/default.jpg',
      date: new Date().toLocaleDateString('tr-TR'),
      featured: false,
    }
    handleChange({ ...localData, posts: [...localData.posts, newPost] })
  }

  const removePost = (id: string) => {
    handleChange({ ...localData, posts: localData.posts.filter(p => p.id !== id) })
  }

  const updatePost = (id: string, field: keyof BlogPost, value: string | boolean) => {
    handleChange({
      ...localData,
      posts: localData.posts.map(p => p.id === id ? { ...p, [field]: value } : p)
    })
  }

  const addCategory = () => {
    const newCategory = prompt('Yeni kategori adı:')
    if (newCategory && !localData.categories.includes(newCategory)) {
      handleChange({ ...localData, categories: [...localData.categories, newCategory] })
    }
  }

  const removeCategory = (category: string) => {
    handleChange({ ...localData, categories: localData.categories.filter(c => c !== category) })
  }

  return (
    <div className="compact-space-y">
      {/* Başlık ve Alt Başlık */}
      <div>
        <label className="label">Bölüm Başlığı</label>
        <input
          type="text"
          value={localData.title}
          onChange={(e) => handleChange({ ...localData, title: e.target.value })}
          className="input w-full"
        />
      </div>

      <div>
        <label className="label">Alt Başlık</label>
        <input
          type="text"
          value={localData.subtitle}
          onChange={(e) => handleChange({ ...localData, subtitle: e.target.value })}
          className="input w-full"
        />
      </div>

      {/* Kategoriler */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">Kategoriler</label>
          <button
            type="button"
            onClick={addCategory}
            className="btn-sm btn-secondary"
          >
            <Plus className="w-3 h-3 mr-1" />
            Kategori Ekle
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {localData.categories.map((category, index) => (
            <div key={index} className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm">
              <span>{category}</span>
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Yazıları */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0">Blog Yazıları ({localData.posts.length})</label>
          <button
            type="button"
            onClick={addPost}
            className="btn-sm btn-primary"
          >
            <Plus className="w-3 h-3 mr-1" />
            Yazı Ekle
          </button>
        </div>

        <div className="compact-space-y">
          {localData.posts.map((post, index) => (
            <div key={post.id} className="card bg-slate-50 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">#{index + 1}</span>
                  {post.featured && (
                    <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3" />
                      Öne Çıkan
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removePost(post.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label-sm">Başlık</label>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => updatePost(post.id, 'title', e.target.value)}
                    className="input-sm w-full"
                  />
                </div>

                <div>
                  <label className="label-sm">Slug (URL)</label>
                  <input
                    type="text"
                    value={post.slug}
                    onChange={(e) => updatePost(post.id, 'slug', e.target.value)}
                    className="input-sm w-full"
                    placeholder="ornek-blog-yazisi"
                  />
                </div>

                <div>
                  <label className="label-sm">Kategori</label>
                  <select
                    value={post.category}
                    onChange={(e) => updatePost(post.id, 'category', e.target.value)}
                    className="input-sm w-full"
                  >
                    {localData.categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="label-sm">Özet</label>
                  <textarea
                    value={post.excerpt}
                    onChange={(e) => updatePost(post.id, 'excerpt', e.target.value)}
                    rows={2}
                    className="input-sm w-full"
                  />
                </div>

                <div>
                  <label className="label-sm">Görsel URL</label>
                  <input
                    type="text"
                    value={post.image}
                    onChange={(e) => updatePost(post.id, 'image', e.target.value)}
                    className="input-sm w-full"
                    placeholder="/images/blog/..."
                  />
                </div>

                <div>
                  <label className="label-sm">Tarih</label>
                  <input
                    type="text"
                    value={post.date}
                    onChange={(e) => updatePost(post.id, 'date', e.target.value)}
                    className="input-sm w-full"
                    placeholder="15 Mart 2026"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={post.featured || false}
                      onChange={(e) => updatePost(post.id, 'featured', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Öne çıkan yazı olarak işaretle</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
