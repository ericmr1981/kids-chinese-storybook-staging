import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8083,
    proxy: {
      // Anthropic-compatible API proxy (阿里云 DashScope)
      '/api/anthropic': {
        target: 'https://coding.dashscope.aliyuncs.com/apps/anthropic',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
      },
      // OpenAI-compatible Images API proxy (火山引擎 ARK)
      '/api/ark': {
        target: 'https://ark.cn-beijing.volces.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ark/, ''),
      },
    },
  },
  preview: {
    host: true,
    port: 8083,
    proxy: {
      // Anthropic-compatible API proxy (阿里云 DashScope)
      '/api/anthropic': {
        target: 'https://coding.dashscope.aliyuncs.com/apps/anthropic',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
      },
      // OpenAI-compatible Images API proxy (火山引擎 ARK)
      '/api/ark': {
        target: 'https://ark.cn-beijing.volces.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ark/, ''),
      },
    },
  },
})