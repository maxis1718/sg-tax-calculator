import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Prerenderer from '@prerenderer/rollup-plugin'
import Renderer from '@prerenderer/renderer-puppeteer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // 只在 build 時使用預渲染
    ...(process.env.NODE_ENV === 'production' ? [
      Prerenderer({
        routes: ['/', '/zh-Hans', '/zh-Hant', '/ms', '/ta'],
        renderer: new Renderer({
          renderAfterTime: 3000,
          headless: true,
        })
      })
    ] : [])
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // 生產環境優化
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-slot', 'lucide-react']
        }
      }
    }
  }
})
