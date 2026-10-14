import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile';
import monacoEditorPluginModule from 'vite-plugin-monaco-editor';
const monacoEditorPlugin = monacoEditorPluginModule.default || monacoEditorPluginModule;
export default defineConfig({
  plugins: [
    vue(),
    viteSingleFile({
      removeViteModuleLoader: false // Đảm bảo không ép inlining gây lỗi với worker asset
    }),
    monacoEditorPlugin({
      // Bật đầy đủ tất cả các language worker đi kèm của Monaco Editor
      languageWorkers: [
        'editorWorkerService', // Bắt buộc cho lõi của editor
        'css',                 // Phân tích cú pháp css, scss, less
        'html',                // Phân tích cú pháp html, handlebars, razor
        'json',                // Phân tích cú pháp json
        'typescript'           // Phân tích cú pháp typescript, javascript
      ],
      // Đăng ký biến toàn cục `window.monaco` để các thư viện bổ sung có thể truy cập
      globalAPI: true
    })
  ],
})