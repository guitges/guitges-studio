import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The API (/api/...) runs as Vercel Functions, which plain `vite` can't serve. In development,
// /api is passed on to the deployed site, so the work list and /admin work locally too.
// Note: that means the local admin edits the live projects. Set API_PROXY to point it elsewhere
// (or run `npx vercel dev`, which serves the functions itself).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.API_PROXY || 'https://guitges.vercel.app'
  return {
    plugins: [react()],
    server: {
      proxy: { '/api': { target, changeOrigin: true } },
    },
  }
})
