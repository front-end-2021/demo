<template>
  <div class="code-viewer-container">
    <!-- Header & Upload -->
    <header class="header py12">
      <h3 class="w350 pl20">{{ folderRoot }}</h3>
      <div style="display:inline-flex; gap: 12px;">
        <div style="min-width: 280px;">
          <input v-model="searchQuery" type="text" placeholder="Nhập từ khóa để quét nội dung file..."
            class="input-search" />
        </div>
        <!-- Bộ lọc nhanh theo đuôi file -->
        <div class="filter-extensions" v-if="availableExtensions.size > 0">
          <p>Lọc theo định dạng:</p>
          <div class="tags-container">
            <span v-for="ext in availableExtensions" :key="ext"
              :class="['tag', selectedExtension === ext ? 'active' : '']" @click="toggleExtensionFilter(ext)">
              {{ ext }}
            </span>
          </div>
        </div>
      </div>

      <div class="upload-zone pr20">
        <label class="custom-upload-btn">
          📁 Tải lên thư mục Project
          <input type="file" webkitdirectory directory multiple @change="handleFolderUpload" style="display: none;" />
        </label>
        <span v-if="totalFilesCount > 0" class="status-text">
          Đã nạp <strong>{{ totalFilesCount }}</strong> file hợp lệ.
        </span>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Cột trái: Bộ lọc & Kết quả tìm kiếm -->
      <aside class="sidebar w350">
        <!-- Danh sách file kết quả -->
        <div class="results-list">
          <h4 class="restlt">Kết quả ({{ filteredResults.length }} file)</h4>
          <div v-for="file in filteredResults" :key="file.dir + file.name"
            :class="['file-item', selectedFilePath === file.dir + file.name ? 'active-file' : '']"
            @click="selectFile(file)">
            <div class="file-path">{{ file.dir }}</div>
            <div class="file-name">📄 {{ file.name }}</div>
            <!-- Đoạn trích nội dung chứa từ khóa -->
            <div v-if="file.snippet" class="file-snippet">
              ...<span v-html="highlightText(file.snippet, debouncedSearchQuery)"></span>...
            </div>
          </div>
        </div>
      </aside>

      <!-- Cột phải: Vùng hiển thị nội dung chi tiết -->
      <main class="code-content">
        <CodeEditor v-if="selectedFile" :file-name="selectedFile.name" :file-size="selectedFile.size"
          :file-dir="selectedFile.dir" :file-ext="selectedFile.ext" v-model="selectedFile.content" />

        <!-- Trạng thái trống khi chưa chọn file -->
        <div v-else class="empty-state">
          <h1>💡 Chọn một file từ danh sách bên trái hoặc tải thư mục lên để xem code.</h1>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { debounce } from 'lodash-es';

import CodeEditor from './components/CodeEditor.vue';

// State lưu trữ
const fileMap = ref(new Map());
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const selectedExtension = ref(null);
const selectedFilePath = ref(null);

const BLACKLIST_FOLDERS = ['bin', 'obj', '.vs', '.vscode', 'target', '.gradle', '.idea', 'build', 'venv', '.venv', '__pycache__', 'env', 'node_modules', '.git'];
const ALLOWED_EXTENSIONS = ['.cs', '.csproj', '.sln', '.config', '.json', '.java', '.xml', '.properties', '.yml', '.yaml', '.gradle', '.py', '.ini', '.cfg', '.sh', '.md', '.txt', '.js', '.ts', '.vue', '.html', '.css'];

const totalFilesCount = computed(() => fileMap.value.size);

const availableExtensions = computed(() => {
  const exts = new Set();
  for (const f of fileMap.value.values()) { exts.add(f.ext) }
  return exts;
});

const handleFolderUpload = async (event) => {
  const files = event.target.files;
  const newMap = new Map();

  const gDir = (t, sep = '/') => {
    const l = t.lastIndexOf(sep);
    return `${t.substring(0, l)}${sep}`
  }
  const sDir = (t, sep = '/') => {
    const l = t.lastIndexOf(sep);
    const f = t.indexOf(sep);
    let r = t.substring(0, l)
    r = `..${sep}${r.substring(f + 1)}${sep}`
    const dd = `..${sep}${sep}`
    if (r.includes(dd)) { r = r.replaceAll(dd, t.substring(0, f + 1)); }
    return r
  }
  for (const file of files) {
    const pathParts = file.webkitRelativePath.split('/');
    const isBlacklisted = pathParts.some(part => BLACKLIST_FOLDERS.includes(part.toLowerCase()));
    if (isBlacklisted) continue;

    const extIndex = file.name.lastIndexOf('.');
    const ext = extIndex !== -1 ? file.name.substring(extIndex).toLowerCase() : '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) continue;
    if (file.size > 5 * 1024 * 1024) continue;

    try {
      const text = await file.text();
      let path = file.webkitRelativePath;
      newMap.set(path, {
        name: file.name,
        ext: ext,
        sdir: sDir(path),
        dir: gDir(path),
        size: file.size,
        content: text
      });
    } catch (err) {
      console.error(`Lỗi đọc file: ${file.name}`, err);
    }
  }

  fileMap.value = newMap;
  selectedFilePath.value = null;
  selectedExtension.value = null;
};

watch(searchQuery, debounce((newVal) => {
  debouncedSearchQuery.value = newVal.trim();
}, 300));

const folderRoot = computed(() => {
  if (fileMap.value.size < 1) return '🛠️ Local Project Code Viewer';
  const firstFile = fileMap.value.values().next().value;
  const parts = firstFile.dir.split('/');
  return parts.length > 1 ? `📂 ${parts[0]}` : '📂 ../';
});
const filteredResults = computed(() => {
  const query = debouncedSearchQuery.value.toLowerCase();
  const results = [];

  for (const [path, fileObj] of fileMap.value.entries()) {
    if (selectedExtension.value && fileObj.ext !== selectedExtension.value) continue;
    if (!query) {
      results.push({ ...fileObj, snippet: '' });
      continue;
    }

    const contentLower = fileObj.content.toLowerCase();
    const index = contentLower.indexOf(query);

    if (index !== -1) {
      const start = Math.max(0, index - 6);
      const end = Math.min(fileObj.content.length, index + query.length + 50);
      let snippet = fileObj.content.substring(start, end);
      results.push({ ...fileObj, snippet });
    }
  }
  return results;
});
const selectedFile = computed(() => fileMap.value.get(selectedFilePath.value) || null);
const selectFile = (file) => { selectedFilePath.value = file.dir + file.name; };
const toggleExtensionFilter = (ext) => { selectedExtension.value = selectedExtension.value === ext ? null : ext; };
const highlightText = (text, search) => {
  if (!search) return text;
  const escapeRegExp = (string) => string.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');// Tìm các ký tự đặc biệt của RegExp và thêm \ vào trước chúng
  const regex = new RegExp(`(${escapeRegExp(search)})`, 'gi');
  return text.replace(regex, '<mark style="background-color: #ffeb3b; padding: 2px; border-radius: 2px;">\$1</mark>');
};
</script>

<style src="./app.css" scoped></style>
