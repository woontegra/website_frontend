import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  /**
   * VITE_API_URL=/api iken tarayıcı localhost:5173/api/... çağırır; buradaki hedefe proxy edilir.
   * Varsayılan: yerel backend (admin / sipariş API’si).
   */
  const apiProxyTarget = env.VITE_DEV_API_PROXY?.trim() || 'http://127.0.0.1:4000'
  /**
   * /uploads — varsayılan olarak API ile aynı hedef (yerelde yüklenen dosyalar önizlenir).
   * Production/Railway medyası için .env: VITE_DEV_UPLOADS_PROXY=https://websitebackend-production-ab6e.up.railway.app
   */
  const uploadsProxyTarget = env.VITE_DEV_UPLOADS_PROXY?.trim() || apiProxyTarget

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
