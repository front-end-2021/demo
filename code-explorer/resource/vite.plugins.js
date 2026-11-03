// Plugin Vite dùng chung cho cả hai file cấu hình (vite.config.js và vite.config.single.js).
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import monacoEditorPluginModule from 'vite-plugin-monaco-editor'

// Gói này xuất CommonJS nên khi import vào ESM phải lấy .default (giống code-viewer)
const monacoEditorPlugin = monacoEditorPluginModule.default || monacoEditorPluginModule

export const explorerPlugins = () => [
  vue(),
  viteSingleFile({
    useRecommendedBuildConfig: true, // Tắt cấu hình tự động ép một số thiết lập nếu cần, nhưng mặc định để true sẽ tối ưu inline
    removeViteModuleLoader: false, // Đảm bảo không ép inlining gây lỗi với worker asset
  }),
  monacoEditorPlugin({
    languageWorkers: ['editorWorkerService', 'css', 'html', 'json', 'typescript'], // Worker cho Monaco (editor đọc mã nguồn): lõi + các ngôn ngữ có language service riêng
  }),
]