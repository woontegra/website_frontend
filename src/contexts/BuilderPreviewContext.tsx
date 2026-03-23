import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type MouseEvent,
  type ReactNode,
} from 'react'
import type { HTMLAttributes } from 'react'

export type BuilderPreviewValue = {
  /** true: önizleme canvas — linkler yönlendirmez, bölüm seçimi için */
  builderMode: boolean
}

const BuilderPreviewContext = createContext<BuilderPreviewValue>({ builderMode: false })

export function BuilderPreviewProvider({
  builderMode,
  children,
}: {
  builderMode: boolean
  children: ReactNode
}) {
  const value = useMemo(() => ({ builderMode }), [builderMode])
  return <BuilderPreviewContext.Provider value={value}>{children}</BuilderPreviewContext.Provider>
}

export function useBuilderPreview() {
  return useContext(BuilderPreviewContext)
}

/**
 * Önizleme içinde tüm `<a href>` tıklamalarında navigate’i engeller (builderMode iken).
 * `data-builder-preview-link-allow` içeren bir üst öğe varsa o link atlanır.
 */
type CanvasProps = { children: ReactNode } & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export function BuilderPreviewCanvas({ children, className, ...rest }: CanvasProps) {
  const { builderMode } = useBuilderPreview()

  const stopLinkNavigation = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!builderMode) return
      const t = e.target as HTMLElement | null
      if (!t) return
      if (t.closest('[data-builder-preview-link-allow]')) return
      const link = t.closest('a[href]')
      if (link) e.preventDefault()
    },
    [builderMode]
  )

  return (
    <div
      role="presentation"
      data-builder-preview-canvas={builderMode ? 'true' : undefined}
      className={['builder-preview-canvas', className].filter(Boolean).join(' ')}
      onClickCapture={stopLinkNavigation}
      onAuxClickCapture={stopLinkNavigation}
      {...rest}
    >
      {children}
    </div>
  )
}
