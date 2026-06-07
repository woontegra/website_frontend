const CATEGORY_GRADIENTS: Record<string, string> = {
  SaaS: 'from-violet-700 via-purple-800 to-slate-900',
  'E-Ticaret': 'from-emerald-600 via-teal-700 to-slate-900',
  Yazılım: 'from-blue-600 via-indigo-800 to-slate-900',
  'Marka & Patent': 'from-orange-600 via-red-700 to-slate-900',
  'Dijital Büyüme': 'from-green-600 via-emerald-800 to-slate-900',
}

export function getBlogCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category] ?? 'from-slate-800 via-slate-900 to-gray-900'
}
