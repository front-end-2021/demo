// Build ra 1 file HTML duy nhất (dùng để xem nhanh / gửi cho người khác): npm run build:single
import { defineConfig } from 'vite'
import { explorerPlugins } from './vite.plugins.js'

export default defineConfig({
  plugins: explorerPlugins(),
  build: { outDir: 'dist-single' },
})
