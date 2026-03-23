import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'İçerik yazın…', className = '' }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-accent-blue underline' } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none min-h-[280px] px-3 py-3 focus:outline-none [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    const cur = editor.getHTML()
    if (value !== cur && (value || '') !== (cur === '<p></p>' ? '' : cur)) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return <div className="min-h-[280px] animate-pulse rounded-lg border border-slate-200 bg-slate-50" />
  }

  return (
    <div className={`rounded-lg border border-slate-200 bg-white ${className}`}>
      <div className="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50 px-2 py-2">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          label="B"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          label="I"
        />
        <span className="mx-1 w-px bg-slate-200" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          label="H2"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          label="H3"
        />
        <span className="mx-1 w-px bg-slate-200" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          label="• Liste"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          label="1. Liste"
        />
        <span className="mx-1 w-px bg-slate-200" />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} label="Geri" />
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} label="İleri" />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarBtn({
  onClick,
  active,
  label,
}: {
  onClick: () => void
  active?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-medium ${
        active ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  )
}
