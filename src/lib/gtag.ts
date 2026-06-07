declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const isDev = import.meta.env.DEV

export function gaDebug(message: string, ...args: unknown[]): void {
  if (isDev) console.log(`[Woontegra GA] ${message}`, ...args)
}

/** Google'ın önerdiği kuyruk stub'ı — `arguments` nesnesi push edilmeli (rest params değil). */
export function ensureGtag(): void {
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    } as Window['gtag']
  }
}
