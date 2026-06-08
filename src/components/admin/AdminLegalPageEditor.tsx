import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronsDownUp,
  ChevronsUpDown,
  Plus,
  Trash2,
} from 'lucide-react'
import { fetchLegalPageContent, saveLegalPageContent } from '../../api/legalPageContent'
import {
  mergeLegalPageContent,
  type LegalPageContent,
  type LegalPageDefinition,
  type LegalPageSection,
  type LegalSectionKind,
} from '../../data/legalPageContent'

export type AdminLegalPageEditorHandle = {
  save: () => Promise<boolean>
  previewPath: string
  saving: boolean
}

const KIND_OPTIONS: { value: LegalSectionKind; label: string; short: string }[] = [
  { value: 'default', label: 'Metin bölümü', short: 'Metin' },
  { value: 'company-details', label: 'Şirket bilgileri tablosu', short: 'Şirket tablosu' },
  { value: 'cookie-preferences', label: 'Çerez tercihleri butonu', short: 'Çerez butonu' },
  { value: 'cookie-inventory-category', label: 'Kategori çerez tablosu', short: 'Kategori tablo' },
  { value: 'cookie-inventory-all', label: 'Tüm çerez tablosu', short: 'Tüm tablo' },
]

const KIND_HINTS: Partial<Record<LegalSectionKind, string>> = {
  'company-details':
    'Bu bölüm, Firma Bilgileri ekranındaki verilerden otomatik oluşturulur. Metin alanı gerekmez.',
  'cookie-preferences': 'Bu bölüm sitede “Çerez Tercihlerinizi Yönetin” butonunu gösterir.',
  'cookie-inventory-category':
    'Bu bölüm, gerçek çerez envanterinden (API) otomatik beslenir. Yalnızca kategori seçin.',
  'cookie-inventory-all':
    'Bu bölüm, gerçek çerez envanterinden (API) otomatik beslenir. Metin alanı gerekmez.',
}

function newSection(order: number): LegalPageSection {
  return {
    id: `bolum-${Date.now()}`,
    title: 'Yeni Bölüm',
    body: '',
    order,
    active: true,
    kind: 'default',
  }
}

function kindMeta(kind?: LegalSectionKind) {
  return KIND_OPTIONS.find((option) => option.value === (kind ?? 'default')) ?? KIND_OPTIONS[0]
}

function isEditableKind(kind?: LegalSectionKind): boolean {
  return !kind || kind === 'default'
}

type AdminLegalPageEditorProps = {
  definition: LegalPageDefinition
  onMessage?: (message: { type: 'success' | 'error'; text: string } | null) => void
}

export const AdminLegalPageEditor = forwardRef<AdminLegalPageEditorHandle, AdminLegalPageEditorProps>(
  function AdminLegalPageEditor({ definition, onMessage }, ref) {
    const { key, defaults, livePath } = definition
    const [content, setContent] = useState<LegalPageContent>(defaults)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

    useEffect(() => {
      setLoading(true)
      setSelectedSectionId(null)
      void fetchLegalPageContent(key, defaults).then((data) => {
        setContent(data)
        setLoading(false)
      })
    }, [key, defaults])

    const updateMeta = <K extends keyof LegalPageContent>(field: K, value: LegalPageContent[K]) => {
      setContent((prev) => ({ ...prev, [field]: value }))
    }

    const updateSections = (sections: LegalPageSection[]) => {
      setContent((prev) => ({
        ...prev,
        sections: sections.map((section, index) => ({ ...section, order: index })),
      }))
    }

    const handleSave = async (): Promise<boolean> => {
      setSaving(true)
      onMessage?.(null)
      const payload = mergeLegalPageContent(defaults, content)
      const result = await saveLegalPageContent(key, defaults, payload)
      setSaving(false)
      if (result.success) {
        setContent(payload)
        onMessage?.({ type: 'success', text: 'Yasal sayfa kaydedildi.' })
        return true
      }
      onMessage?.({ type: 'error', text: `Hata oluştu: ${result.message ?? 'Kayıt başarısız'}` })
      return false
    }

    useImperativeHandle(ref, () => ({
      save: handleSave,
      previewPath: livePath,
      saving,
    }))

    const selectedSection = content.sections.find((section) => section.id === selectedSectionId) ?? null
    const selectedIndex = selectedSection ? content.sections.findIndex((s) => s.id === selectedSection.id) : -1

    const updateSelectedSection = (patch: Partial<LegalPageSection>) => {
      if (selectedIndex < 0) return
      const sections = [...content.sections]
      sections[selectedIndex] = { ...sections[selectedIndex], ...patch }
      updateSections(sections)
    }

    if (loading) {
      return <p className="text-sm text-slate-600">Yükleniyor…</p>
    }

    return (
      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setSettingsOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold text-slate-900">Sayfa Ayarları</span>
            {settingsOpen ? (
              <ChevronsDownUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {settingsOpen ? (
            <div className="space-y-4 border-t border-slate-100 px-4 py-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={content.enabled}
                  onChange={(e) => updateMeta('enabled', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Sayfa aktif (yayında)
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="label">Başlık</label>
                  <input
                    className="input w-full"
                    value={content.title}
                    onChange={(e) => updateMeta('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Güncelleme tarihi etiketi</label>
                  <input
                    className="input w-full"
                    value={content.updatedAtLabel}
                    onChange={(e) => updateMeta('updatedAtLabel', e.target.value)}
                    placeholder="Boşsa Firma Bilgileri tarihi kullanılır"
                  />
                </div>
              </div>

              <div>
                <label className="label">Kısa açıklama</label>
                <textarea
                  className="textarea w-full"
                  rows={2}
                  value={content.description}
                  onChange={(e) => updateMeta('description', e.target.value)}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="label">SEO title</label>
                  <input
                    className="input w-full"
                    value={content.seoTitle}
                    onChange={(e) => updateMeta('seoTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">SEO description</label>
                  <input
                    className="input w-full"
                    value={content.seoDescription}
                    onChange={(e) => updateMeta('seoDescription', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(260px,320px)_1fr]">
          <aside className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-3">
              <h3 className="text-sm font-semibold text-slate-900">Bölümler</h3>
              <button
                type="button"
                onClick={() => {
                  const section = newSection(content.sections.length)
                  updateSections([...content.sections, section])
                  setSelectedSectionId(section.id)
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Bölüm Ekle
              </button>
            </div>

            <ul className="max-h-[min(70vh,560px)] divide-y divide-slate-100 overflow-y-auto">
              {content.sections.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-slate-500">Henüz bölüm yok.</li>
              ) : (
                content.sections.map((section, index) => {
                  const meta = kindMeta(section.kind)
                  const isSelected = section.id === selectedSectionId
                  return (
                    <li key={section.id}>
                      <div
                        className={`flex items-start gap-2 px-3 py-2.5 transition ${
                          isSelected ? 'bg-emerald-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedSectionId(section.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="truncate text-sm font-medium text-slate-900">{section.title || 'Başlıksız'}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{meta.short}</p>
                        </button>

                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <label className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <input
                              type="checkbox"
                              checked={section.active}
                              onChange={(e) => {
                                const sections = [...content.sections]
                                sections[index] = { ...section, active: e.target.checked }
                                updateSections(sections)
                              }}
                              className="h-3.5 w-3.5 rounded border-slate-300"
                            />
                            Aktif
                          </label>
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => {
                                const sections = [...content.sections]
                                ;[sections[index - 1], sections[index]] = [sections[index], sections[index - 1]]
                                updateSections(sections)
                              }}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                              aria-label="Yukarı taşı"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === content.sections.length - 1}
                              onClick={() => {
                                const sections = [...content.sections]
                                ;[sections[index], sections[index + 1]] = [sections[index + 1], sections[index]]
                                updateSections(sections)
                              }}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                              aria-label="Aşağı taşı"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateSections(content.sections.filter((_, i) => i !== index))
                                if (selectedSectionId === section.id) setSelectedSectionId(null)
                              }}
                              className="rounded p-1 text-red-500 hover:bg-red-50"
                              aria-label="Sil"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </aside>

          <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:min-h-[420px]">
            {!selectedSection ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-slate-700">Düzenlemek için soldan bir bölüm seçin</p>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Aynı anda yalnızca seçili bölüm düzenlenir. Yeni bölüm eklemek için soldaki “Bölüm Ekle” butonunu
                  kullanın.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Bölüm Düzenle</h3>
                  <p className="text-xs text-slate-500">{kindMeta(selectedSection.kind).label}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="label">Bölüm başlığı</label>
                    <input
                      className="input w-full"
                      value={selectedSection.title}
                      onChange={(e) => updateSelectedSection({ title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Bölüm id (anchor)</label>
                    <input
                      className="input w-full font-mono text-xs"
                      value={selectedSection.id}
                      onChange={(e) => {
                        const nextId = e.target.value
                        updateSelectedSection({ id: nextId })
                        setSelectedSectionId(nextId)
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="label">Bölüm türü</label>
                    <select
                      className="input w-full"
                      value={selectedSection.kind ?? 'default'}
                      onChange={(e) =>
                        updateSelectedSection({ kind: e.target.value as LegalSectionKind })
                      }
                    >
                      {KIND_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedSection.active}
                      onChange={(e) => updateSelectedSection({ active: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Bölüm aktif
                  </label>
                </div>

                {selectedSection.kind && KIND_HINTS[selectedSection.kind] ? (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
                    {KIND_HINTS[selectedSection.kind]}
                  </div>
                ) : null}

                {selectedSection.kind === 'cookie-inventory-category' ? (
                  <div>
                    <label className="label">Çerez kategorisi</label>
                    <select
                      className="input w-full"
                      value={selectedSection.cookieCategory ?? 'necessary'}
                      onChange={(e) =>
                        updateSelectedSection({
                          cookieCategory: e.target.value as LegalPageSection['cookieCategory'],
                        })
                      }
                    >
                      <option value="necessary">Zorunlu</option>
                      <option value="analytics">Analitik</option>
                      <option value="marketing">Pazarlama</option>
                      <option value="functional">Fonksiyonel</option>
                    </select>
                  </div>
                ) : null}

                {isEditableKind(selectedSection.kind) ? (
                  <>
                    <div>
                      <label className="label">Metin gövdesi</label>
                      <p className="mb-1 text-xs text-slate-500">
                        Paragraflar arasında boş satır bırakın. İç link: [metin](/yol) — Firma alanları:{' '}
                        {'{{company.email}}'}, {'{{company.phone}}'}
                      </p>
                      <textarea
                        className="textarea w-full font-mono text-sm"
                        rows={8}
                        value={selectedSection.body}
                        onChange={(e) => updateSelectedSection({ body: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="label mb-0">Madde listesi</label>
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedSection({
                              listItems: [...(selectedSection.listItems ?? []), ''],
                            })
                          }
                          className="text-xs font-medium text-emerald-700 hover:underline"
                        >
                          + Madde ekle
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(selectedSection.listItems ?? []).length === 0 ? (
                          <p className="text-xs text-slate-500">Madde yok. “+ Madde ekle” ile satır ekleyin.</p>
                        ) : (
                          (selectedSection.listItems ?? []).map((item, itemIndex) => (
                            <div key={`${selectedSection.id}-item-${itemIndex}`} className="flex gap-2">
                              <input
                                className="input w-full text-sm"
                                value={item}
                                placeholder={`Madde ${itemIndex + 1}`}
                                onChange={(e) => {
                                  const listItems = [...(selectedSection.listItems ?? [])]
                                  listItems[itemIndex] = e.target.value
                                  updateSelectedSection({ listItems })
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const listItems = (selectedSection.listItems ?? []).filter(
                                    (_, i) => i !== itemIndex,
                                  )
                                  updateSelectedSection({ listItems })
                                }}
                                className="shrink-0 rounded-lg border border-red-200 px-2 text-red-600 hover:bg-red-50"
                                aria-label="Maddeyi sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
)
