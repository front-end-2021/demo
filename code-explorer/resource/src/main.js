import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { useWorkspaceStore } from './stores/workspace'
import { useSelectionStore } from './stores/selection'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')

// Chỉ khi `npm run dev`: tay nắm để thử trong console (xem ROADMAP.md → checklist M1)
//   await explorer.ws.readFile(explorer.sel.filePath)
if (import.meta.env.DEV) window.explorer = { ws: useWorkspaceStore(pinia), sel: useSelectionStore(pinia) }
