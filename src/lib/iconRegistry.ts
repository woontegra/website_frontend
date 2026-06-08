import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Boxes,
  Code2,
  Globe,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Package,
  Palette,
  RefreshCw,
  Search,
  Share2,
  ShoppingCart,
  Target,
  Truck,
  Workflow,
  Zap,
  Box,
} from 'lucide-react'

export const ICON_OPTIONS = [
  'Globe',
  'ShoppingCart',
  'Search',
  'Megaphone',
  'Share2',
  'Palette',
  'Lightbulb',
  'Code2',
  'Target',
  'Workflow',
  'Zap',
  'BarChart3',
  'Package',
  'Truck',
  'RefreshCw',
  'Boxes',
  'LayoutDashboard',
] as const

export type IconName = (typeof ICON_OPTIONS)[number]

const ICON_MAP: Record<IconName, LucideIcon> = {
  Globe,
  ShoppingCart,
  Search,
  Megaphone,
  Share2,
  Palette,
  Lightbulb,
  Code2,
  Target,
  Workflow,
  Zap,
  BarChart3,
  Package,
  Truck,
  RefreshCw,
  Boxes,
  LayoutDashboard,
}

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name as IconName] ?? Box
}

export const GRADIENT_OPTIONS = [
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-violet-500 to-purple-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-500',
  'from-fuchsia-500 to-purple-500',
  'from-amber-500 to-orange-500',
  'from-slate-700 to-slate-900',
] as const
