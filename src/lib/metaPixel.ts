import { WOONTEGRA_META_PIXEL_FALLBACK } from '../config/tracking'
import { fetchTrackingSettings } from './trackingSettings'

declare global {
  interface Window {
    fbq?: FbqFunction
    _fbq?: FbqFunction
  }
}

type FbqFunction = {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  loaded?: boolean
  version?: string
  push?: FbqFunction
}

let initializedPixelId: string | null = null

function bootstrapFbq(): void {
  if (window.fbq) return

  const n: FbqFunction = function (...args: unknown[]) {
    if (n.callMethod) {
      n.callMethod(...args)
    } else {
      n.queue.push(args)
    }
  } as FbqFunction

  n.queue = []
  n.loaded = true
  n.version = '2.0'
  window.fbq = n
  window._fbq = n

  if (!document.getElementById('woontegra-meta-pixel')) {
    const script = document.createElement('script')
    script.id = 'woontegra-meta-pixel'
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
  }
}

export async function resolveMetaPixelId(): Promise<string> {
  const envPixel = import.meta.env.VITE_META_PIXEL_ID?.trim()
  if (envPixel) return envPixel

  try {
    const settings = await fetchTrackingSettings()
    if (settings.metaBrowserPixelEnabled !== false && settings.metaPixelId) {
      return settings.metaPixelId
    }
  } catch {
    /* API yoksa fallback */
  }

  return WOONTEGRA_META_PIXEL_FALLBACK
}

export function initMetaPixel(pixelId: string): boolean {
  if (!pixelId || initializedPixelId === pixelId) return false

  bootstrapFbq()
  window.fbq?.('init', pixelId)
  window.fbq?.('track', 'PageView')
  initializedPixelId = pixelId
  return true
}

export function trackMetaPageView(): void {
  if (!initializedPixelId || !window.fbq) return
  window.fbq('track', 'PageView')
}

export function isMetaPixelInitialized(): boolean {
  return initializedPixelId !== null
}
