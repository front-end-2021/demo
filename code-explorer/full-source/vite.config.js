import { defineConfig } from 'vite'
import { explorerPlugins } from './vite.plugins.js'

export default defineConfig({
  plugins: explorerPlugins(),
  build: {
    cssCodeSplit: false, // Tắt chia tách code CSS để gộp hết vào index.html
    assetsInlineLimit: 100000000, // Bật giới hạn kích thước asset inline lên cao để chứa toàn bộ JS/CSS
  }
})
