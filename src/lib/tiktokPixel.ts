import { canLoadMarketing } from './trackingSettings'

declare global {
  interface Window {
    ttq?: {
      (...args: unknown[]): void
      load?: (pixelId: string) => void
      page?: () => void
      track?: (...args: unknown[]) => void
      methods?: string[]
      setAndDefer?: (target: unknown, method: string) => void
      instance?: (id: string) => unknown
      _i?: Record<string, unknown>
      _t?: Record<string, number>
      _o?: Record<string, unknown>
    }
    TiktokAnalyticsObject?: string
  }
}

let initializedPixelId: string | null = null

function bootstrapTtq(): void {
  if (window.ttq) return

  const queue: unknown[][] = []
  const ttq = ((...args: unknown[]) => {
    queue.push(args)
  }) as NonNullable<Window['ttq']>

  ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent']
  ttq.load = (pixelId: string) => {
    if (!document.getElementById('woontegra-tiktok-pixel')) {
      const script = document.createElement('script')
      script.id = 'woontegra-tiktok-pixel'
      script.async = true
      script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`
      document.head.appendChild(script)
    }
  }
  ttq.page = () => ttq('page')
  window.ttq = ttq
  window.TiktokAnalyticsObject = 'ttq'
}

export function initTikTokPixel(pixelId: string): boolean {
  const id = pixelId.trim()
  if (!id || !canLoadMarketing() || initializedPixelId === id) return false

  bootstrapTtq()
  window.ttq?.load?.(id)
  window.ttq?.page?.()
  initializedPixelId = id
  return true
}

export function trackTikTokPageView(): void {
  if (!canLoadMarketing() || !initializedPixelId || !window.ttq) return
  window.ttq.page?.()
}

export function isTikTokPixelInitialized(): boolean {
  return initializedPixelId !== null
}
