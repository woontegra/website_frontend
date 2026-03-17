import { useState } from 'react'
import { Card } from './Card'

interface FAQItemProps {
  question: string
  answer: string
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false)
  return (
    <Card hover={false} className="overflow-hidden">
      <button
        type="button"
        className="w-full text-left flex justify-between items-start gap-4 p-6"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold text-heading">{question}</span>
        <span className="text-surface-500 shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-6 pb-6 text-surface-600 text-sm">{answer}</div>}
    </Card>
  )
}
