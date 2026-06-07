import { canLoadAnalytics } from './trackingSettings'

let initializedContainerId: string | null = null

export function initGoogleTagManager(containerId: string): boolean {
  const id = containerId.trim()
  if (!id || !canLoadAnalytics()) return false
  if (initializedContainerId === id) return false

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

  if (!document.getElementById('woontegra-gtm-js')) {
    const script = document.createElement('script')
    script.id = 'woontegra-gtm-js'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`
    document.head.appendChild(script)
  }

  initializedContainerId = id
  return true
}

export function isGoogleTagManagerInitialized(): boolean {
  return initializedContainerId !== null
}
