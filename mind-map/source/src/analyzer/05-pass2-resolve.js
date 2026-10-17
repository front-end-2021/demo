// 05-pass2-resolve.js — Bước 4, LƯỢT 2: biến tham chiếu chưa giải quyết thành cạnh.
//
// ĐẦU VÀO: { units, index, refs } từ 04, files (Map), config
// ĐẦU RA: {
//   edges: [{ from, to, kind, confidence, count, labels, locs }]
//   extraNodes: Map<id, attrs>     node không phải file: endpoint, route, thư viện ngoài
//   unresolved: [{ kind, path, line, target, reason }]
// }
//
// Loại cạnh: imports, renders, emits, uses-store, uses-hook, uses-context, provides-context,
// provides, styled-by, dom, calls, routes-to, defines, navigates, calls-api, exposes,
// extends, uses, injects, manages, registers, implemented-by, mounts
// confidence: 'certain' (liên kết tường minh) | 'inferred' (khớp theo tên / mẫu URL)

import {
  fileId, endpointId, routeId, externalId, dirname, basename, joinPath, joinUrl,
  normalizePath, toPascal, sameEventName, normalizeUrlPattern,
} from './utils.js'
import { lookup } from './04-pass1-index.js'

const JS_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.json']
const STYLE_EXTS = ['.scss', '.sass', '.css', '.less']
const NATIVE_EVENTS = new Set([
  'click', 'dblclick', 'input', 'change', 'submit', 'keydown', 'keyup', 'keypress', 'focus', 'blur',
  'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'mousedown', 'mouseup', 'scroll', 'wheel',
  'touchstart', 'touchend', 'contextmenu', 'drag', 'drop', 'dragover', 'paste', 'copy',
])
const KIND_EDGE = { store: 'uses-store', hook: 'uses-hook', context: 'uses-context', 'context-provider': 'provides-context' }
const PY_STDLIB = new Set(('os sys re json typing datetime time math logging pathlib collections functools itertools subprocess ' +
  'asyncio dataclasses enum abc uuid random hashlib base64 io csv copy contextlib threading traceback unittest argparse ' +
  'shutil tempfile glob urllib http socket decimal statistics string textwrap inspect importlib warnings pickle sqlite3 ' +
  'email secrets operator types weakref queue signal platform zipfile gzip struct heapq bisect pprint getpass calendar ' +
  'locale codecs configparser __future__').split(' '))

export function runPass2({ units, index, refs, files, config, onProgress = () => {} }) {
  const resolveModule = createModuleResolver(files, config)
  const edges = new Map()
  const extraNodes = new Map()
  const unresolved = []
  const unitOf = (path) => index.unitsByPath.get(path)
  const globalComponents = new Map(
    Object.entries(config.globalComponents instanceof Map ? Object.fromEntries(config.globalComponents) : config.globalComponents ?? {}),
  )

  // ---------------- helpers ----------------
  function addEdge(from, to, kind, ref, { confidence = ref?.confidence ?? 'certain', label } = {}) {
    if (!from || !to || from === to) return
    const key = `${from}|${to}|${kind}`
    let e = edges.get(key)
    if (!e) edges.set(key, (e = { from, to, kind, confidence, count: 0, labels: [], locs: [] }))
    e.count++
    if (confidence === 'certain') e.confidence = 'certain'
    if (label && e.labels.length < 20 && !e.labels.includes(label)) e.labels.push(label)
    if (ref?.line != null && e.locs.length < 10) e.locs.push({ path: ref.path, line: ref.line })
  }
  const addNode = (id, attrs) => { if (!extraNodes.has(id)) extraNodes.set(id, attrs) }
  const miss = (ref, reason) => {
    if (unresolved.length < 5000) unresolved.push({ kind: ref.kind, path: ref.path, line: ref.line, target: ref.target, reason })
  }
  function moduleTarget(spec, ref, opts) {
    const r = resolveModule(spec, ref.path, opts)
    if (!r) return null
    if (r.external) {
      const id = externalId(r.external)
      addNode(id, { kind: 'external', label: r.external })
      return { id, external: true }
    }
    return r.path ? { id: fileId(r.path), path: r.path } : null
  }
  function componentTarget(name, spec, ref) {
    if (spec) {
      const t = moduleTarget(spec, ref)
      if (t) return t
    }
    if (!name) return null
    const g = globalComponents.get(name) ?? globalComponents.get(toPascal(name))
    if (g && files.has(g)) return { id: fileId(g), path: g }
    const cands = lookup(index, 'component', name)
    if (cands.length === 1) return { id: fileId(cands[0].path), path: cands[0].path, inferred: true }
    return null
  }

  // ---------------- Pha 1: đăng ký toàn cục ----------------
  for (const ref of refs) {
    if (ref.kind === 'global-component') {
      const t = ref.target.spec ? moduleTarget(ref.target.spec, ref) : null
      if (t?.path) {
        globalComponents.set(ref.target.name, t.path)
        globalComponents.set(toPascal(ref.target.name), t.path)
        addEdge(ref.from, t.id, 'registers', ref, { label: ref.target.name })
      }
    } else if (ref.kind === 'router-include') applyRouterInclude(ref)
  }

  // ---------------- Pha 2: node endpoint & route ----------------
  const endpoints = []
  const routeByName = new Map()
  for (const u of units) {
    for (const s of u.symbols) {
      if (s.kind === 'endpoint') {
        const norm = normalizeUrlPattern(s.meta.path)
        const id = endpointId(s.meta.method, norm)
        addNode(id, { kind: 'endpoint', label: `${s.meta.method} ${s.meta.path}`, method: s.meta.method, urlPattern: norm, framework: s.meta.framework, handler: s.meta.handler })
        addEdge(fileId(u.path), id, 'exposes', { path: u.path, line: s.line, confidence: 'certain' }, { label: s.meta.handler })
        endpoints.push({ id, method: s.meta.method, segs: segments(norm) })
      } else if (s.kind === 'route') {
        const id = routeId(s.name)
        addNode(id, { kind: 'route', label: s.name, routeName: s.meta.routeName ?? null })
        addEdge(fileId(u.path), id, 'defines', { path: u.path, line: s.line, confidence: 'certain' })
        if (s.meta.routeName) routeByName.set(s.meta.routeName, id)
      }
    }
  }

  // ---------------- Pha 3: mọi tham chiếu còn lại ----------------
  const cssSeen = new Set()
  let n = 0
  for (const ref of refs) {
    switch (ref.kind) {
      case 'import': {
        const t = moduleTarget(ref.target.spec, ref, { style: !!ref.target.css })
        if (t) addEdge(ref.from, t.id, 'imports', ref, { label: ref.target.dynamic ? 'dynamic' : ref.target.typeOnly ? 'type' : undefined })
        else miss(ref, 'not-found')
        break
      }
      case 'component': {
        const t = componentTarget(ref.target.name, ref.target.spec, ref)
        if (!t) miss(ref, 'unknown-component')
        else if (!t.external) addEdge(ref.from, t.id, 'renders', ref, { confidence: t.inferred ? 'inferred' : 'certain', label: ref.target.name })
        break
      }
      case 'listens': {
        const t = componentTarget(ref.target.component, ref.target.spec, ref)
        if (!t?.path) break
        const comp = unitOf(t.path)?.symbols.find((s) => s.kind === 'component')
        const declared = comp?.meta.emits?.some((e) => sameEventName(e, ref.target.event))
        if (!declared && NATIVE_EVENTS.has(ref.target.event)) break // sự kiện DOM gốc, không phải emit
        addEdge(t.id, ref.from, 'emits', ref, { confidence: declared ? 'certain' : 'inferred', label: ref.target.event })
        break
      }
      case 'store':
      case 'hook':
      case 'context':
      case 'context-provider':
        resolveNamed(ref)
        break
      case 'inject': {
        const providers = lookup(index, 'provide', ref.target.key)
        for (const s of providers) addEdge(fileId(s.path), ref.from, 'provides', ref, { confidence: 'inferred', label: ref.target.key })
        if (!providers.length) miss(ref, 'no-provider')
        break
      }
      case 'css-class':
      case 'css-id':
        resolveCss(ref)
        break
      case 'css-module-class': {
        const t = moduleTarget(ref.target.spec, ref, { style: true })
        if (t?.path) {
          addEdge(ref.from, t.id, 'styled-by', ref, { label: '.' + ref.target.name })
          for (const s of lookup(index, 'css-class', ref.target.name)) if (s.path === t.path) s.meta.used = true
        }
        break
      }
      case 'dom-id': {
        const defs = lookup(index, 'dom-id', ref.target.id)
        for (const s of defs) addEdge(ref.from, fileId(s.path), 'dom', ref, { confidence: 'inferred', label: '#' + ref.target.id })
        break
      }
      case 'global-function': {
        const defs = lookup(index, 'function', ref.target.name).filter((s) => !s.path.endsWith('.py'))
        for (const s of defs.slice(0, 3)) addEdge(ref.from, fileId(s.path), 'calls', ref, { confidence: 'inferred', label: ref.target.name })
        if (!defs.length) miss(ref, 'not-found')
        break
      }
      case 'route-view': {
        const t = componentTarget(ref.target.name, ref.target.spec, ref)
        if (t && !t.external) addEdge(ref.from, t.id, 'routes-to', ref, { confidence: t.inferred ? 'inferred' : 'certain' })
        else miss(ref, 'unknown-view')
        break
      }
      case 'navigates': {
        let id = null
        if (ref.target.routeName) id = routeByName.get(ref.target.routeName) ?? null
        else if (ref.target.path && extraNodes.has(routeId(ref.target.path))) id = routeId(ref.target.path)
        if (id) addEdge(ref.from, id, 'navigates', ref, { confidence: 'inferred' })
        break
      }
      case 'api-call': resolveApi(ref); break
      case 'jvm-import': resolveJvmImport(ref); break
      case 'type-ref': resolveJvmType(ref); break
      case 'cs-type-ref': resolveCsType(ref); break
      case 'di-register': resolveDi(ref); break
      case 'py-import': resolvePyImport(ref); break
      case 'py-type-ref': resolvePyType(ref); break
      case 'extends': {
        const t = ref.target.spec ? moduleTarget(ref.target.spec, ref) : null
        if (t && !t.external) addEdge(ref.from, t.id, 'extends', ref, { label: ref.target.name })
        break
      }
      case 'global-component':
      case 'router-include':
        break // đã xử lý ở pha 1
      default:
        miss(ref, 'unknown-ref-kind')
    }
    if (++n % 2000 === 0) onProgress({ stage: 'pass2', done: n, total: refs.length })
  }
  onProgress({ stage: 'pass2', done: refs.length, total: refs.length })

  return { edges: [...edges.values()], extraNodes, unresolved }

  // =====================================================================
  // Các hàm giải quyết (khai báo function nên dùng được ở trên nhờ hoisting)
  // =====================================================================
  function resolveNamed(ref) {
    const { name, spec } = ref.target
    const edgeKind = KIND_EDGE[ref.kind]
    if (spec) {
      const t = moduleTarget(spec, ref)
      if (t?.external) return // thư viện ngoài: đã có cạnh imports
      if (t) return addEdge(ref.from, t.id, edgeKind, ref, { label: name })
    }
    // Không có import (ví dụ unplugin-auto-import): tìm theo tên
    const symKind = ref.kind === 'context-provider' ? 'context' : ref.kind
    let cands = lookup(index, symKind, name)
    if (!cands.length && ref.kind === 'store') cands = lookup(index, 'hook', name)
    if (!cands.length && ref.kind === 'hook') cands = lookup(index, 'store', name)
    if (cands.length === 1) addEdge(ref.from, fileId(cands[0].path), edgeKind, ref, { confidence: 'inferred', label: name })
    else miss(ref, cands.length ? 'ambiguous' : 'not-found')
  }

  function resolveCss(ref) {
    const kind = ref.kind
    const name = ref.target.name
    const key = `${ref.path}|${kind}|${name}`
    if (cssSeen.has(key)) return
    cssSeen.add(key)
    const defs = lookup(index, kind, name)
    if (!defs.length) return // class tiện ích (Tailwind...) hoặc từ thư viện: bỏ qua
    for (const s of defs) s.meta.used = true
    if (defs.some((s) => s.meta.scopedTo === ref.path)) return // style scoped của chính component
    const globals = defs.filter((s) => !s.meta.scopedTo && !s.meta.module)
    if (!globals.length || globals.length > 3) return // quá nhiều nơi định nghĩa -> không đủ tin cậy
    for (const s of globals) addEdge(ref.from, fileId(s.path), 'styled-by', ref, { confidence: 'inferred', label: (kind === 'css-id' ? '#' : '.') + name })
  }

  function resolveApi(ref) {
    const norm = normalizeUrlPattern(ref.target.url)
    const method = (ref.target.method ?? 'GET').toUpperCase()
    const segs = segments(norm)
    const okMethod = (e) => e.method === 'ANY' || e.method === method
    let hits = endpoints.filter((e) => okMethod(e) && segMatch(e.segs, segs))
    let confidence = ref.confidence
    if (!hits.length) {
      // baseURL khác nhau (axios.create({ baseURL: '/api' })): so khớp phần đuôi
      hits = endpoints.filter((e) => okMethod(e) && suffixMatch(e.segs, segs))
      confidence = 'inferred'
    }
    if (!hits.length) {
      const id = endpointId(method, norm)
      addNode(id, { kind: 'endpoint', label: `${method} ${ref.target.url}`, method, urlPattern: norm, external: true })
      addEdge(ref.from, id, 'calls-api', ref, { confidence: 'inferred', label: method })
      miss(ref, 'no-endpoint')
      return
    }
    for (const e of hits.slice(0, 3)) addEdge(ref.from, e.id, 'calls-api', ref, { confidence, label: method })
  }

  function resolveJvmImport(ref) {
    const { fqcn, wildcard } = ref.target
    if (wildcard) return // nối từng lớp thực sự được dùng qua type-ref
    let path = index.jvmByFqcn.get(fqcn)
    if (!path) {
      // import static a.b.C.method / lớp lồng a.b.C.Inner / hàm top-level Kotlin a.b.util.fn
      const parts = fqcn.split('.')
      while (!path && parts.length > 1) {
        parts.pop()
        path = index.jvmByFqcn.get(parts.join('.'))
      }
      if (!path) {
        const pkgFiles = index.jvmByPackage.get(fqcn.split('.').slice(0, -1).join('.'))
        if (pkgFiles?.size === 1) path = [...pkgFiles][0]
      }
    }
    if (path) return addEdge(ref.from, fileId(path), 'imports', ref, { label: fqcn.split('.').pop() })
    if (/^(java|javax|kotlin|kotlinx)\./.test(fqcn)) return // thư viện chuẩn: bỏ qua cho đỡ rối
    const group = fqcn.split('.').slice(0, 2).join('.')
    const internal = [...index.jvmByPackage.keys()].some((p) => p === group || p.startsWith(group + '.'))
    if (internal) return miss(ref, 'not-found')
    const id = externalId(group)
    addNode(id, { kind: 'external', label: group })
    addEdge(ref.from, id, 'imports', ref)
  }

  function resolveJvmType(ref) {
    const jvm = unitOf(ref.path)?.facts.jvm
    if (!jvm) return
    const { name, edge } = ref.target
    let path = null
    let viaImport = false
    const imp = jvm.imports.find((i) => !i.wildcard && (i.alias === name || (!i.alias && i.fqcn.split('.').pop() === name)))
    if (imp) { path = index.jvmByFqcn.get(imp.fqcn); viaImport = !!path }
    if (!path) path = index.jvmByFqcn.get(jvm.pkg ? `${jvm.pkg}.${name}` : name) // cùng package
    if (!path) {
      for (const w of jvm.imports.filter((i) => i.wildcard)) {
        path = index.jvmByFqcn.get(`${w.fqcn}.${name}`)
        if (path) break
      }
    }
    if (!path) return
    if (edge === 'uses' && viaImport) return // đã có cạnh imports
    addEdge(ref.from, fileId(path), edge, ref, { label: name })
  }

  function resolveCsType(ref) {
    const cs = unitOf(ref.path)?.facts.cs
    if (!cs) return
    const cands = index.csTypes.get(ref.target.name)
    if (!cands) return
    // Namespace nhìn thấy được: using + global using + namespace hiện tại và các namespace cha
    const visible = new Set(index.csGlobalUsings)
    visible.add('')
    for (const us of cs.usings) if (!us.static && !us.alias) visible.add(us.ns)
    for (const ns of cs.namespaces) {
      let p = ns
      while (p) {
        visible.add(p)
        p = p.includes('.') ? p.slice(0, p.lastIndexOf('.')) : ''
      }
    }
    const hits = cands.filter((c) => visible.has(c.ns))
    const chosen = hits.length ? hits : cands.length === 1 ? cands : []
    const confidence = hits.length ? 'certain' : 'inferred'
    for (const c of chosen.slice(0, 3)) addEdge(ref.from, fileId(c.path), ref.target.edge, ref, { confidence, label: ref.target.name })
  }

  function resolveDi(ref) {
    const pathsOf = (name) => (index.csTypes.get(name) ?? []).map((c) => c.path)
    const ifaces = pathsOf(ref.target.iface)
    const impls = pathsOf(ref.target.impl)
    for (const p of impls) addEdge(ref.from, fileId(p), 'registers', ref, { label: ref.target.impl })
    if (ref.target.iface !== ref.target.impl) {
      for (const i of ifaces) for (const p of impls) addEdge(fileId(i), fileId(p), 'implemented-by', ref, { label: ref.target.impl })
    }
  }

  function resolvePyImport(ref) {
    const paths = resolvePython(ref.target, ref.path, files, config)
    if (paths.length) {
      for (const p of paths) addEdge(ref.from, fileId(p), 'imports', ref, { label: ref.target.module || '.' })
      return
    }
    if (ref.target.level > 0) return miss(ref, 'not-found')
    const top = (ref.target.module ?? '').split('.')[0]
    if (!top || PY_STDLIB.has(top)) return
    const id = externalId('py:' + top)
    addNode(id, { kind: 'external', label: top })
    addEdge(ref.from, id, 'imports', ref)
  }

  function resolvePyType(ref) {
    const py = unitOf(ref.path)?.facts.py
    if (!py) return
    const [head, ...rest] = ref.target.name.split('.')
    for (const imp of py.imports) {
      const named = imp.names.find((x) => (x.alias ?? x.name) === head)
      let paths = []
      if (named) paths = resolvePython({ ...imp, names: [named] }, ref.path, files, config)
      else if (!imp.names.length && rest.length && (imp.alias === head || imp.module.split('.').pop() === head)) {
        paths = resolvePython({ ...imp, names: [] }, ref.path, files, config)
      }
      if (paths.length) {
        for (const p of paths) addEdge(ref.from, fileId(p), 'extends', ref, { label: ref.target.name })
        return
      }
    }
    const cands = lookup(index, 'class', ref.target.name).filter((s) => s.path.endsWith('.py'))
    if (cands.length === 1) addEdge(ref.from, fileId(cands[0].path), 'extends', ref, { confidence: 'inferred', label: ref.target.name })
  }

  // app.register_blueprint(auth_bp, url_prefix='/auth') / app.include_router(router, prefix='/api')
  function applyRouterInclude(ref) {
    const py = unitOf(ref.path)?.facts.py
    const { name, prefix } = ref.target
    const [head, ...rest] = name.split('.')
    let paths = []
    let original = rest.length ? rest[rest.length - 1] : head
    for (const imp of py?.imports ?? []) {
      const named = imp.names.find((x) => (x.alias ?? x.name) === head)
      if (named && !rest.length) {
        original = named.name // from app.auth import bp as auth_bp
        paths = resolvePython({ ...imp, names: [] }, ref.path, files, config)
      } else if (named && rest.length) {
        paths = resolvePython({ ...imp, names: [named] }, ref.path, files, config) // from app import auth; auth.bp
      } else if (!imp.names.length && rest.length && (imp.alias === head || imp.module.split('.').pop() === head)) {
        paths = resolvePython({ ...imp, names: [] }, ref.path, files, config) // import app.auth as auth; auth.bp
      }
      if (paths.length) break
    }
    if (!paths.length) paths = [ref.path] // router định nghĩa ngay trong file này
    for (const p of paths) {
      if (p !== ref.path) addEdge(ref.from, fileId(p), 'mounts', ref, { label: prefix || name })
      for (const s of unitOf(p)?.symbols ?? []) {
        if (s.kind !== 'endpoint' || s.meta.routerVar !== original) continue
        // Flask: url_prefix khi đăng ký THAY THẾ prefix của Blueprint; FastAPI: NỐI THÊM phía trước
        const base = s.meta.framework === 'flask' && prefix ? prefix : joinUrl(prefix, s.meta.routerPrefix)
        s.meta.path = joinUrl(base, s.meta.routePath)
        s.name = `${s.meta.method} ${normalizeUrlPattern(s.meta.path)}`
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Giải quyết module JS/TS/CSS: tương đối, alias, tuyệt đối (Vite), gói npm
// ---------------------------------------------------------------------------
export function createModuleResolver(files, config) {
  const aliases = config.aliases ?? []
  const has = (p) => files.has(p)

  function tryCandidates(base, exts) {
    if (!base) return null
    if (has(base)) return base
    for (const e of exts) if (has(base + e)) return base + e
    // './x.js' trong mã TypeScript thực chất trỏ tới x.ts
    const m = /\.(m|c)?jsx?$/.exec(base)
    if (m) {
      const noExt = base.slice(0, -m[0].length)
      for (const e of ['.ts', '.tsx', '.mts', '.cts']) if (has(noExt + e)) return noExt + e
    }
    for (const e of exts) if (has(`${base}/index${e}`)) return `${base}/index${e}`
    // partial SCSS: @use 'variables' -> _variables.scss
    const d = dirname(base)
    const b = basename(base)
    for (const e of STYLE_EXTS) if (has(joinPath(d, `_${b}${e}`))) return joinPath(d, `_${b}${e}`)
    return null
  }

  return function resolveModule(spec, fromPath, { style = false } = {}) {
    if (!spec || /^(https?:|data:|mailto:|#|virtual:)/i.test(spec)) return null
    spec = spec.split(/[?#]/)[0]
    const exts = style ? [...STYLE_EXTS, ...JS_EXTS] : [...JS_EXTS, ...STYLE_EXTS]
    const fromDir = dirname(fromPath)

    if (spec.startsWith('.')) return { path: tryCandidates(joinPath(fromDir, spec), exts) }
    for (const a of aliases) {
      const key = a.find.replace(/\/$/, '')
      if (spec === key || spec.startsWith(key + '/')) {
        const hit = tryCandidates(joinPath(a.replacement, spec.slice(key.length)), exts)
        if (hit) return { path: hit }
      }
    }
    if (spec.startsWith('/')) return { path: tryCandidates(joinPath(fromDir, spec), exts) ?? tryCandidates(normalizePath(spec), exts) }
    if (style || spec.startsWith('~')) {
      const local = tryCandidates(joinPath(fromDir, spec.replace(/^~/, '')), exts) // Sass cho phép bỏ './'
      if (local) return { path: local }
      spec = spec.replace(/^~/, '')
    }
    if (spec.startsWith('sass:') || spec.startsWith('node:')) return null
    const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]
    return { external: pkg }
  }
}

// ---------------------------------------------------------------------------
// Giải quyết import Python -> danh sách file
// ---------------------------------------------------------------------------
export function resolvePython(imp, fromPath, files, config) {
  const tryMod = (p) => (files.has(p + '.py') ? p + '.py' : files.has(joinPath(p, '__init__.py')) ? joinPath(p, '__init__.py') : null)
  let bases
  if (imp.level > 0) {
    let d = dirname(fromPath)
    for (let i = 1; i < imp.level; i++) d = dirname(d)
    bases = [d]
  } else {
    bases = [...(config.pythonRoots ?? [''])]
  }
  const modPath = imp.module ? imp.module.replace(/\./g, '/') : ''
  for (const b of bases) {
    const base = joinPath(b, modPath)
    const subs = imp.names.filter((n) => n.name !== '*').map((n) => tryMod(joinPath(base, n.name))).filter(Boolean)
    const allSubs = imp.names.length > 0 && subs.length === imp.names.length
    const mod = !allSubs && (modPath || imp.level) ? tryMod(base) : null
    const found = [...subs, ...(mod ? [mod] : [])]
    if (found.length) return [...new Set(found)]
  }
  return []
}

// ---------------------------------------------------------------------------
// So khớp URL theo từng đoạn; '{*}' khớp mọi đoạn
// ---------------------------------------------------------------------------
const segments = (p) => p.split('/').filter(Boolean)
const segMatch = (a, b) => a.length === b.length && a.every((s, i) => s === b[i] || s === '{*}' || b[i] === '{*}')
function suffixMatch(a, b) {
  const [short, long] = a.length <= b.length ? [a, b] : [b, a]
  return short.length >= 2 && segMatch(short, long.slice(long.length - short.length))
}
