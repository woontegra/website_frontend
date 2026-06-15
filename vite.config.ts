import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/** Yerel Vite’ta /uploads için önceki sabit hedef — medya genelde bu sunucuda. */
const RAILWAY_UPLOADS_DEFAULT = 'https://websitebackend-production-ab6e.up.railway.app'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  /**
   * VITE_API_URL=/api iken tarayıcı localhost:5173/api/... çağırır; buradaki hedefe proxy edilir.
   * Varsayılan: yerel backend (admin / sipariş API’si).
   */
  const apiProxyTarget = env.VITE_DEV_API_PROXY?.trim() || 'http://127.0.0.1:4000'
  /**
   * /uploads ayrı hedef: API’yi local çalıştırırken dosyalar hâlâ Railway’de olabilir.
   * Tamamen yerel medya için .env: VITE_DEV_UPLOADS_PROXY=http://127.0.0.1:4000
   */
  const uploadsProxyTarget = env.VITE_DEV_UPLOADS_PROXY?.trim() || RAILWAY_UPLOADS_DEFAULT

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: true,
        },
        '/uploads': {
          target: uploadsProxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
