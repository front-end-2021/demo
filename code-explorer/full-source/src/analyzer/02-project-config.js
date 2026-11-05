// 02-project-config.js — "Bước 0": đọc file cấu hình dự án.
//
// ĐẦU VÀO: files (Map<path, SourceFile>) từ 01-collect-files.js
// ĐẦU RA: config = {
//   frameworks: Set<string>          'vue', 'react', 'pinia', 'spring', 'aspnet', 'flask', ...
//   packages: [{ path, dir, name, deps }]
//   aliases: [{ find, replacement, source }]   '@' -> 'src' (tsconfig, vite.config, người dùng)
//   globalComponents: Map<tên, path>  từ components.d.ts (unplugin-vue-components)
//   pythonRoots: Set<dir>            thư mục gốc để giải quyết import tuyệt đối của Python
//   csGlobalUsings: Set<namespace>   <Using Include="..."/> trong .csproj
//   entryFiles: Set<path>            index.html, main.ts, Program.cs, app.py...
// }

import { parse as parseJsonc } from 'jsonc-parser'
import { dirname, joinPath, normalizePath, matchClose } from './utils.js'
import { readText } from './01-collect-files.js'

const FRAMEWORK_PACKAGES = {
  vue: 'vue', react: 'react', 'react-dom': 'react', pinia: 'pinia', vuex: 'vuex', vite: 'vite',
  //'@playwright/test' : 'playwright', '@testing-library/react': 'testing-library', '@testing-library/vue': 'testing-library',
  'vue-router': 'vue-router', 'react-router': 'react-router', 'react-router-dom': 'react-router',
  '@reduxjs/toolkit': 'redux', redux: 'redux', zustand: 'zustand', next: 'next', nuxt: 'nuxt',
  express: 'express', fastify: 'fastify', axios: 'axios', '@angular/core': 'angular', svelte: 'svelte',
}
const BUNDLER_DEPS = ['vite', 'vue', 'react', '@vitejs/plugin-vue', '@vitejs/plugin-react', '@vue/cli-service', 'next', 'nuxt',
  '@playwright/test', '@testing-library/react', '@testing-library/vue', 'webpack', 'rollup', 'parcel', 'esbuild']

/**
 * @param {Map<string, object>} files
 * @param {{ extraAliases?: {find: string, replacement: string}[], rootName?: string }} opts
 */
export async function readProjectConfig(files, { extraAliases = [], rootName = '' } = {}) {
  const config = {
    rootName,
    frameworks: new Set(),
    packages: [],
    aliases: [],
    globalComponents: new Map(),
    pythonRoots: new Set(),
    csGlobalUsings: new Set(),
    entryFiles: new Set(),
  }
  const detected = []

  for (const sf of files.values()) {
    const name = sf.name.toLowerCase()
    const dir = dirname(sf.path)
    try {
      if (name === 'package.json') await readPackageJson(sf, dir, config)
      else if (/^[tj]sconfig(\..+)?\.json$/.test(name)) await readTsConfig(sf, dir, detected)
      else if (/^(vite|vitest|webpack|vue)\.config\.[cm]?[jt]s$/.test(name)) await readBundlerAliases(sf, dir, detected)
      else if (name === 'components.d.ts') await readComponentsDts(sf, dir, config)
      else if (['pom.xml', 'build.gradle', 'build.gradle.kts'].includes(name)) await readJvmBuild(sf, config)
      else if (name.endsWith('.csproj')) await readCsproj(sf, config)
      else if (['requirements.txt', 'pyproject.toml', 'setup.py', 'setup.cfg', 'pipfile'].includes(name)) await readPythonDeps(sf, config)
    } catch (e) {
      console.warn('[project-config] Không đọc được', sf.path, e)
    }
    if (isEntryFile(name, sf.path)) config.entryFiles.add(sf.path)
  }

  // Gốc Python: thư mục cha gần nhất KHÔNG chứa __init__.py
  for (const sf of files.values()) {
    if (sf.ext !== '.py') continue
    let d = dirname(sf.path)
    while (d && files.has(joinPath(d, '__init__.py'))) d = dirname(d)
    config.pythonRoots.add(d)
  }
  if (!config.pythonRoots.size) config.pythonRoots.add('')

  // Alias '@' -> src mặc định của Vite/Vue CLI, nếu dự án không tự khai báo
  if (!detected.some((a) => a.find.replace(/\/$/, '') === '@')) {
    for (const pkg of config.packages) {
      if (!pkg.deps.some((d) => BUNDLER_DEPS.includes(d))) continue
      const src = joinPath(pkg.dir, 'src')
      if ([...files.keys()].some((p) => p.startsWith(src + '/'))) detected.push({ find: '@', replacement: src, source: 'default' })
    }
  }

  // Alias người dùng khai báo được ưu tiên (đứng trước), rồi sắp xếp theo độ dài (sort ổn định)
  config.aliases = [...extraAliases.map((a) => ({ ...a, replacement: normalizePath(a.replacement), source: 'user' })), ...detected]
  config.aliases.sort((a, b) => b.find.length - a.find.length)
  return config
}

/** Chuyển Set/Map sang mảng/object để gửi qua postMessage hoặc lưu JSON. */
export function toPlainConfig(c) {
  return {
    ...c,
    frameworks: [...c.frameworks],
    globalComponents: Object.fromEntries(c.globalComponents),
    pythonRoots: [...c.pythonRoots],
    csGlobalUsings: [...c.csGlobalUsings],
    entryFiles: [...c.entryFiles],
  }
}

// ---------------------------------------------------------------------------
function isEntryFile(name, path) {
  const depth = path.split('/').length
  if (/^index\.html?$/.test(name)) return depth <= 3
  return (
    /^main\.[jt]sx?$/.test(name) ||
    /^(index|app)\.[jt]sx$/.test(name) ||
    ['program.cs', 'app.py', 'main.py', 'manage.py', 'wsgi.py', 'asgi.py'].includes(name)
  )
}

async function readPackageJson(sf, dir, config) {
  const pkg = JSON.parse(await readText(sf))
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies })
  config.packages.push({ path: sf.path, dir, name: pkg.name ?? '', deps })
  for (const d of deps) if (FRAMEWORK_PACKAGES[d]) config.frameworks.add(FRAMEWORK_PACKAGES[d])
}

async function readTsConfig(sf, dir, out) {
  const cfg = parseJsonc(await readText(sf)) ?? {}
  const co = cfg.compilerOptions ?? {}
  const baseUrl = joinPath(dir, co.baseUrl ?? '.')
  for (const [key, targets] of Object.entries(co.paths ?? {})) {
    const target = (Array.isArray(targets) ? targets[0] : '') ?? ''
    out.push({ find: key.replace(/\*$/, ''), replacement: joinPath(baseUrl, target.replace(/\*$/, '')), source: sf.path })
  }
  // Lưu ý: "extends" sang tsconfig khác chưa được xử lý.
}

// vite.config / webpack.config là mã thực thi -> không chạy, chỉ đọc khối "alias" bằng heuristic.
async function readBundlerAliases(sf, dir, out) {
  const text = await readText(sf)
  const m = /\balias\s*:\s*([[{])/.exec(text)
  if (!m) return
  const open = m.index + m[0].length - 1
  const block = text.slice(open + 1, matchClose(text, open, m[1], m[1] === '{' ? '}' : ']'))
  const lastString = (s) => {
    const all = [...s.matchAll(/['"`]([^'"`]+)['"`]/g)]
    return all.length ? all[all.length - 1][1] : null
  }
  // Dạng mảng: [{ find: '@', replacement: ... }]
  let found = false
  for (const a of block.matchAll(/find\s*:\s*['"]([^'"]+)['"][^}]*?replacement\s*:\s*([^}]*)/g)) {
    const value = lastString(a[2])
    if (value) { out.push({ find: a[1], replacement: joinPath(dir, value), source: sf.path }); found = true }
  }
  if (found) return
  // Dạng object: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  for (const a of block.matchAll(/^\s*['"]?([^'"\s:,{}]+)['"]?\s*:\s*(.+?),?\s*$/gm)) {
    const value = lastString(a[2])
    if (value && !/^(find|replacement)$/.test(a[1])) out.push({ find: a[1], replacement: joinPath(dir, value), source: sf.path })
  }
}

async function readComponentsDts(sf, dir, config) {
  const text = await readText(sf)
  for (const m of text.matchAll(/(\w+)\s*:\s*typeof import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    if (m[2].startsWith('.')) config.globalComponents.set(m[1], joinPath(dir, m[2]))
  }
}

async function readJvmBuild(sf, config) {
  const text = await readText(sf)
  if (/spring-boot/.test(text)) config.frameworks.add('spring')
  if (/kotlin/.test(text)) config.frameworks.add('kotlin')
  if (/ktor/.test(text)) config.frameworks.add('ktor')
}

async function readCsproj(sf, config) {
  const text = await readText(sf)
  config.frameworks.add('dotnet')
  if (/Sdk="Microsoft\.NET\.Sdk\.Web"|Microsoft\.AspNetCore/.test(text)) config.frameworks.add('aspnet')
  for (const m of text.matchAll(/<Using\s+Include="([\w.]+)"/g)) config.csGlobalUsings.add(m[1])
}

async function readPythonDeps(sf, config) {
  const text = (await readText(sf)).toLowerCase()
  for (const fw of ['flask', 'django', 'fastapi']) if (new RegExp(`\\b${fw}\\b`).test(text)) config.frameworks.add(fw)
}
