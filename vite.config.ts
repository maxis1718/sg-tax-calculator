import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Prerenderer from '@prerenderer/rollup-plugin'
import Renderer from '@prerenderer/renderer-puppeteer'
import { writeFileSync } from 'fs'

// 生成 sitemap.xml 的插件
function generateSitemap() {
  return {
    name: 'generate-sitemap',
    writeBundle() {
      const baseUrl = 'https://sgtaxcalculator.com'
      const routes = ['/', '/zh-Hans', '/zh-Hant', '/ms', '/ta']
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`

      writeFileSync('dist/sitemap.xml', sitemap)
      console.log('✅ Sitemap generated successfully!')
    }
  }
}

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
      }),
      generateSitemap()
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
