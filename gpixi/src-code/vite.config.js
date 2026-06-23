import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile"
export default defineConfig({
  base: './',
  // server: {
  //   port: 5173,
  //   open: true
  // },
  // build: {
  //   outDir: 'dist',
  //   target: 'es2020'
  // },
  plugins: [viteSingleFile()]
});