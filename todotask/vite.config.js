import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile';
import monacoEditorPluginModule from 'vite-plugin-monaco-editor'
const monacoEditorPlugin = monacoEditorPluginModule.default || monacoEditorPluginModule // Khắc phục lỗi tương thích ESM nếu có của plugin
export default defineConfig({
  plugins: [
    vue(),
    viteSingleFile({
      removeViteModuleLoader: false // Đảm bảo không ép inlining gây lỗi với worker asset
    }),
    monacoEditorPlugin({
      languages: ['csharp', 'java'], // Chỉ đóng gói các tính năng lõi và đúng 2 ngôn ngữ bạn cần
      languageWorkers: ['editorWorkerService'],
      // customWorkers: [
      //   {
      //     label: 'editorWorkerService',// Cấu hình worker cơ bản cho trình chỉnh sửa (editorWorker Service)
      //     entry: 'monaco-editor/esm/vs/editor/editor.worker'
      //   }
      // ]
    })
  ],
})