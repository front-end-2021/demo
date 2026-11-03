// Build ra 1 file HTML duy nhất (dùng để xem nhanh / gửi cho người khác): npm run build:single
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [vue(), viteSingleFile()],
  build: { outDir: 'dist-single' },
})
