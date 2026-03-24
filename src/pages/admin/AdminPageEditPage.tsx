import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi, adminPagesWriteApi } from '../../api/cms'
import { Editor, Frame, Element, useEditor } from '@craftjs/core'
import { Container } from '../../components/builder/Container'
import { Hero } from '../../components/builder/Hero'
import { Text } from '../../components/builder/Text'
import { Image } from '../../components/builder/Image'
import { Services } from '../../components/builder/Services'
import { Contact } from '../../components/builder/Contact'
import { CTA } from '../../components/builder/CTA'
import { Brands } from '../../components/builder/Brands'
import { Toolbox } from '../../components/builder/Toolbox'
import { SettingsPanel } from '../../components/builder/SettingsPanel'
import { Topbar } from '../../components/builder/Topbar'

// Default content for empty pages
const getDefaultContent = () => {
  return JSON.stringify({
    ROOT: {
      type: { resolvedName: 'Container' },
      isCanvas: true,
      props: {},
      displayName: 'Container',
      custom: {},
      hidden: false,
      nodes: ['hero-1'],
      linkedNodes: {},
    },
    'hero-1': {
      type: { resolvedName: 'Hero' },
      isCanvas: false,
      props: {
        title: 'Hoş Geldiniz',
        subtitle: 'Modern çözümlerle geleceği inşa ediyoruz',
        buttonText: 'Başlayın',
        buttonLink: '#',
        backgroundImage: '',
      },
      displayName: 'Hero',
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {},
    },
  })
}

const EditorContent = ({ content, title, slug, status, onSave, onTitleChange, onSlugChange, onStatusChange, msg }: any) => {
  const { query } = useEditor()
  const [initialContent, setInitialContent] = useState<string>('')
  const [isHtmlContent, setIsHtmlContent] = useState(false)
  const [showHtmlPreview, setShowHtmlPreview] = useState(false)

  useEffect(() => {
    console.log('EditorContent mounted, content:', content ? 'exists' : 'empty')
    
    if (content && content.trim()) {
      // Check if content is valid JSON
      if (content.trim().startsWith('{')) {
        try {
          JSON.parse(content)
          setInitialContent(content)
          setIsHtmlContent(false)
        } catch (e) {
          console.error('Invalid JSON, using default:', e)
          setInitialContent(getDefaultContent())
          setIsHtmlContent(false)
        }
      } else {
        // HTML content - go directly to builder mode for editing
        console.log('HTML content detected, converting to builder mode')
        setIsHtmlContent(true)
        setShowHtmlPreview(false)
        setInitialContent(getDefaultContent())
      }
    } else {
      // Empty content - use default
      setInitialContent(getDefaultContent())
      setIsHtmlContent(false)
    }
  }, [content])

  const handleSave = () => {
    const json = query.serialize()
    onSave(json)
  }

  if (!initialContent) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Editor hazırlanıyor...</p>
        </div>
      </div>
    )
  }

  // HTML PREVIEW MODE
  if (isHtmlContent && showHtmlPreview) {
    return (
      <div className="fixed inset-0 flex flex-col bg-white">
        <div className="bg-slate-900 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/sayfalar" className="text-sm font-medium text-white hover:text-gray-300">
              ← Sayfalar
            </Link>
            <div className="h-6 w-px bg-slate-700" />
            <h1 className="text-lg font-bold text-white">{title || 'Sayfa Önizleme'}</h1>
          </div>
          <div className="flex items-center gap-4">
            {msg && <p className="text-sm text-green-400 font-medium">{msg}</p>}
            <button
              onClick={() => setShowHtmlPreview(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
            >
              Builder Moduna Geç
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900">HTML Sayfa Önizleme</p>
              <p className="text-xs text-amber-700 mt-1">
                Bu sayfa HTML formatında. Aşağıda gerçek görünümünü görüyorsunuz. 
                Builder ile düzenlemek için "Builder Moduna Geç" butonuna tıklayın.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-gray-100 p-4">
          <iframe
            src={`/${slug}`}
            className="w-full h-full bg-white rounded-xl shadow-2xl border-2 border-gray-300"
            title="Sayfa Önizleme"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      <div className="bg-slate-900 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/sayfalar" className="text-sm font-medium text-white hover:text-gray-300">
            ← Sayfalar
          </Link>
          <div className="h-6 w-px bg-slate-700" />
          <h1 className="text-lg font-bold text-white">{title || 'Sayfa Düzenle'}</h1>
        </div>
        <div className="flex items-center gap-4">
          {msg && <p className="text-sm text-green-400 font-medium">{msg}</p>}
          {isHtmlContent && (
            <button
              onClick={() => setShowHtmlPreview(true)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 font-medium transition-colors text-sm"
            >
              📄 Orijinal Sayfayı Gör
            </button>
          )}
        </div>
      </div>

      {isHtmlContent && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="flex items-center gap-2 text-amber-900">
            <span className="text-lg">⚠️</span>
            <p className="text-sm font-medium">
              Bu sayfa HTML formatında. Builder ile düzenleyebilirsiniz. 
              Kaydettiğinizde builder formatına dönüşecek (eski HTML kaybolacak).
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              placeholder="Sayfa Başlığı"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-green-500"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <div className="w-64">
            <input
              placeholder="slug"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:border-green-500"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-green-500"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Toolbox />
        <div className="flex-1 overflow-auto bg-gray-100">
          <Topbar
            onSave={handleSave}
            onPreview={() => window.open(`/${slug}`, '_blank')}
          />
          <div className="p-8">
            <Frame data={initialContent}>
              <Element is={Container} canvas />
            </Frame>
          </div>
        </div>
        <SettingsPanel />
      </div>
    </div>
  )
}

type PageData = {
  id: string
  title: string
  slug: string
  content: string
  status: string
}

export function AdminPageEditPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const navigate = useNavigate()
  const isNew = pageId === 'yeni'
  
  console.log('AdminPageEditPage render, pageId:', pageId, 'isNew:', isNew)

  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('published')

  const load = useCallback(() => {
    if (!pageId || isNew) return
    setLoading(true)
    adminApi<PageData>(`/pages/${pageId}`).then((r) => {
      if (r.success && r.data) {
        const p = r.data
        setTitle(p.title)
        setSlug(p.slug)
        setContent(p.content ?? '')
        setStatus(p.status === 'draft' ? 'draft' : 'published')
        setMsg('')
      } else setMsg(r.message ?? 'Yüklenemedi')
      setLoading(false)
    })
  }, [pageId, isNew])

  useEffect(() => {
    if (isNew) {
      setLoading(false)
      return
    }
    load()
  }, [load, isNew])

  const save = async (builderJson: string) => {
    if (!title.trim() || !slug.trim()) {
      setMsg('Başlık ve slug gerekli')
      return
    }
    setMsg('')
    if (isNew) {
      const r = await adminPagesWriteApi<{ id: string }>('', {
        method: 'POST',
        body: JSON.stringify({
          slug: slug.trim(),
          title: title.trim(),
          content: builderJson,
          status,
        }),
      })
      if (r.success && r.data) {
        navigate(`/admin/sayfalar/${(r.data as { id: string }).id}`, { replace: true })
      } else setMsg(r.message ?? 'Kayıt hatası')
      return
    }
    const r = await adminPagesWriteApi(`/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify({
        slug: slug.trim(),
        title: title.trim(),
        content: builderJson,
        status,
      }),
    })
    if (r.success) setMsg('Kaydedildi ✓')
    else setMsg(r.message ?? 'Kayıt hatası')
  }

  if (loading) {
    console.log('Loading state active')
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Sayfa yükleniyor...</p>
        </div>
      </div>
    )
  }

  console.log('Rendering Editor with content:', content ? 'exists' : 'empty')
  
  return (
    <Editor
      resolver={{
        Container,
        Hero,
        Text,
        Image,
        Services,
        Contact,
        CTA,
        Brands,
      }}
    >
      <EditorContent
        content={content}
        title={title}
        slug={slug}
        status={status}
        msg={msg}
        onSave={save}
        onTitleChange={setTitle}
        onSlugChange={setSlug}
        onStatusChange={(val: string) => setStatus(val as 'draft' | 'published')}
      />
    </Editor>
  )
}
