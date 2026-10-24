// adapters/javascript.js — JS / TS / JSX / TSX.
// Adapter Vue và HTML tái sử dụng parseScript() và analyzeScript() của file này.
//
// Thu thập:
//   symbol: function, class, component, hook, store (Pinia/Zustand/Redux slice), context,
//           route, provide, dom-id, endpoint (Express/Fastify)
//   ref:    import, component, store, hook, context, context-provider, inject,
//           css-class, css-id, css-module-class, dom-id, route-view, navigates,
//           global-component, api-call, extends
//   facts:  importBindings (tên cục bộ -> { spec, imported }), vue.emits, vue.props

import { parse } from '@babel/parser'
import { createUnit, addSymbol, addRef, basename, stripExt, toPascal, routeId } from '../utils.js'

const REACT_BUILTIN_HOOKS = new Set([
  'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef',
  'useLayoutEffect', 'useImperativeHandle', 'useDebugValue', 'useId', 'useTransition',
  'useDeferredValue', 'useSyncExternalStore', 'useInsertionEffect', 'useOptimistic',
  'useActionState', 'useFormStatus',
])
const VUE_BUILTIN_COMPOSABLES = new Set([
  'useRoute', 'useRouter', 'useAttrs', 'useSlots', 'useCssModule', 'useCssVars',
  'useTemplateRef', 'useId', 'useModel', 'useLink', 'useFetch',
])
const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete'])
const ROUTER_PACKAGES = /^(vue-router|react-router|react-router-dom|@tanstack\/react-router)$/
const SERVER_PACKAGES = /^(express|koa-router|@koa\/router|fastify|hono)$/
const VUE_OPTION_KEYS = new Set(['template', 'render', 'setup', 'props', 'emits', 'components', 'data', 'computed', 'methods'])
const SKIP_KEYS = new Set(['loc', 'start', 'end', 'extra', 'leadingComments', 'trailingComments', 'innerComments', 'range', 'comments', 'tokens'])

export const javascriptAdapter = {
  id: 'javascript',
  extensions: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts'],
  match: (sf) => !/\.d\.[mc]?ts$/.test(sf.name),
  analyze(sf, text) {
    const ts = /^\.[mc]?tsx?$/.test(sf.ext)
    const jsx = !['.ts', '.mts', '.cts'].includes(sf.ext)
    const unit = createUnit(sf, 'javascript', ts ? 'typescript' : 'javascript')
    let ast
    try {
      ast = parseScript(text, { ts, jsx })
    } catch (e) {
      try {
        ast = parseScript(text, { ts, jsx: !jsx }) // thử lại với cấu hình JSX ngược lại
      } catch {
        unit.errors.push(String(e.message ?? e))
        return unit
      }
    }
    analyzeScript(unit, ast)
    return unit
  },
}

// ---------------------------------------------------------------------------
// Parse & duyệt AST
// ---------------------------------------------------------------------------
export function parseScript(code, { ts = false, jsx = true } = {}) {
  const plugins = ['decorators-legacy']
  if (ts) plugins.push('typescript')
  if (jsx) plugins.push('jsx')
  return parse(code, {
    sourceType: 'unambiguous',
    errorRecovery: true,
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true,
    plugins,
  })
}

/** Duyệt mọi node con. visit trả về false để không đi sâu vào node đó. */
export function walk(node, visit, parent = null) {
  if (!node || typeof node.type !== 'string') return
  if (visit(node, parent) === false) return
  for (const key of Object.keys(node)) {
    if (SKIP_KEYS.has(key)) continue
    const v = node[key]
    if (Array.isArray(v)) {
      for (const c of v) if (c && typeof c.type === 'string') walk(c, visit, node)
    } else if (v && typeof v.type === 'string') walk(v, visit, node)
  }
}

// ---------------------------------------------------------------------------
// Phân tích một chương trình JS/TS (cũng dùng cho <script> của .vue và .html)
// ---------------------------------------------------------------------------
export function analyzeScript(unit, ast, { lineOffset = 0 } = {}) {
  const L = (node) => (node?.loc?.start?.line ?? 0) + lineOffset
  const bindings = (unit.facts.importBindings ??= new Map())
  const vue = (unit.facts.vue ??= { emits: new Set(), props: new Set() })
  const ctx = { unit, L, bindings, vue, isRouterFile: false, seen: new Set() }

  // A. import trước, để biết tên nào đến từ đâu
  for (const stmt of ast.program.body) collectImport(ctx, stmt)
  ctx.isRouterFile = [...bindings.values()].some((b) => ROUTER_PACKAGES.test(b.spec))

  // B. khai báo cấp cao nhất -> symbol
  for (const stmt of ast.program.body) collectTopLevel(ctx, stmt)

  // C. duyệt toàn bộ: lời gọi, JSX, CSS modules, route
  walk(ast.program, (node) => {
    switch (node.type) {
      case 'VariableDeclarator': collectRequire(ctx, node); break
      case 'CallExpression': handleCall(ctx, node); break
      case 'ImportExpression': { // Babel 8: import('./x') là node riêng
        const spec = stringValue(node.source)
        if (spec) addRef(unit, 'import', { spec, dynamic: true }, ctx.L(node))
        break
      }
      case 'NewExpression': { // new Worker(new URL('./x.worker.js', import.meta.url))
        const c = node.callee
        const a = node.arguments[0]
        if (c.type === 'Identifier' && /^(Shared)?Worker$/.test(c.name)) {
          const spec = a?.type === 'NewExpression' && a.callee.name === 'URL' ? stringValue(a.arguments[0]) : stringValue(a)
          if (spec) addRef(unit, 'import', { spec, worker: true }, ctx.L(node))
        }
        break
      }
      case 'JSXOpeningElement': handleJsx(ctx, node); break
      case 'MemberExpression': handleCssModule(ctx, node); break
      case 'ObjectExpression': if (ctx.isRouterFile) handleRouteObject(ctx, node); break
    }
  })
}

function collectImport(ctx, stmt) {
  const { unit, L, bindings } = ctx
  if (stmt.type === 'ImportDeclaration') {
    const spec = stmt.source.value
    for (const s of stmt.specifiers) {
      const imported =
        s.type === 'ImportDefaultSpecifier' ? 'default'
        : s.type === 'ImportNamespaceSpecifier' ? '*'
        : (s.imported.name ?? s.imported.value)
      bindings.set(s.local.name, { spec, imported })
    }
    addRef(unit, 'import', { spec, typeOnly: stmt.importKind === 'type' }, L(stmt))
  } else if ((stmt.type === 'ExportNamedDeclaration' || stmt.type === 'ExportAllDeclaration') && stmt.source) {
    addRef(unit, 'import', { spec: stmt.source.value, reexport: true }, L(stmt))
  }
}

function collectRequire(ctx, node) {
  const init = node.init
  if (init?.type !== 'CallExpression' || init.callee.type !== 'Identifier' || init.callee.name !== 'require') return
  const spec = stringValue(init.arguments[0])
  if (!spec) return
  if (node.id.type === 'Identifier') ctx.bindings.set(node.id.name, { spec, imported: 'default' })
  else if (node.id.type === 'ObjectPattern') {
    for (const p of node.id.properties) if (p.value?.type === 'Identifier') ctx.bindings.set(p.value.name, { spec, imported: propKey(p) })
  }
}

function collectTopLevel(ctx, stmt) {
  const { unit, L, bindings } = ctx
  let decl = stmt
  let exported = false
  let isDefault = false
  if (stmt.type === 'ExportNamedDeclaration') { exported = true; decl = stmt.declaration }
  else if (stmt.type === 'ExportDefaultDeclaration') { exported = true; isDefault = true; decl = stmt.declaration }
  if (!decl) return
  const fileBase = toPascal(stripExt(basename(unit.path)))

  if (
    decl.type === 'FunctionDeclaration' || decl.type === 'ClassDeclaration' ||
    (isDefault && (decl.type === 'ArrowFunctionExpression' || decl.type === 'FunctionExpression' || decl.type === 'ClassExpression'))
  ) {
    const name = decl.id?.name ?? (isDefault ? fileBase : null)
    if (!name) return
    addSymbol(unit, classifyFunction(name, decl), name, L(decl), { exported, isDefault })
    if (decl.superClass?.type === 'Identifier') {
      addRef(unit, 'extends', { name: decl.superClass.name, spec: bindings.get(decl.superClass.name)?.spec }, L(decl))
    }
    return
  }

  if (decl.type === 'VariableDeclaration') {
    for (const d of decl.declarations) {
      if (d.id.type !== 'Identifier') continue
      const name = d.id.name
      const init = unwrap(d.init)
      let kind = 'variable'
      const meta = { exported }
      if (init?.type === 'ArrowFunctionExpression' || init?.type === 'FunctionExpression') kind = classifyFunction(name, init)
      else if (init?.type === 'CallExpression') {
        const cn = calleeName(init.callee)
        if (cn === 'defineStore') { kind = 'store'; meta.storeId = stringValue(init.arguments[0]) }
        else if (cn === 'create' && /^use[A-Z]/.test(name)) kind = 'store' // Zustand
        else if (cn === 'createSlice') { kind = 'store'; meta.slice = true } // Redux Toolkit
        else if (cn === 'createContext') kind = 'context'
        else if (['forwardRef', 'memo', 'defineComponent', 'defineAsyncComponent'].includes(cn) && /^[A-Z]/.test(name)) kind = 'component'
      }
      addSymbol(unit, kind, name, L(d), meta)
    }
    return
  }

  // Vue Options API: export default { props, emits, components, ... } hoặc defineComponent({...})
  if (isDefault) {
    const obj =
      decl.type === 'ObjectExpression' ? decl
      : decl.type === 'CallExpression' && calleeName(decl.callee) === 'defineComponent' ? decl.arguments[0]
      : null
    if (obj?.type === 'ObjectExpression' && obj.properties.some((p) => VUE_OPTION_KEYS.has(propKey(p)))) {
      collectOptionsApi(ctx, obj)
      addSymbol(unit, 'component', fileBase, L(decl), { exported: true, isDefault: true, options: true })
    }
  }
}

function collectOptionsApi(ctx, obj) {
  for (const p of obj.properties) {
    const key = propKey(p)
    const target = key === 'emits' ? ctx.vue.emits : key === 'props' ? ctx.vue.props : null
    if (!target) continue
    if (p.value?.type === 'ArrayExpression') p.value.elements.forEach((e) => { const v = stringValue(e); if (v) target.add(v) })
    else if (p.value?.type === 'ObjectExpression') p.value.properties.forEach((q) => { const k = propKey(q); if (k) target.add(k) })
  }
}

// ---------------------------------------------------------------------------
function handleCall(ctx, node) {
  const { unit, L, bindings, vue } = ctx
  const callee = node.callee
  const args = node.arguments
  const line = L(node)

  // import('./x') động
  if (callee.type === 'Import') {
    const spec = stringValue(args[0])
    if (spec) addRef(unit, 'import', { spec, dynamic: true }, line)
    return
  }
  const name = callee.type === 'Identifier' ? callee.name : null
  const prop = callee.type === 'MemberExpression' && !callee.computed ? callee.property.name : null
  const obj = callee.type === 'MemberExpression' ? memberRootName(callee.object) : null

  if (name === 'require') {
    const spec = stringValue(args[0])
    if (spec) addRef(unit, 'import', { spec, require: true }, line)
    return
  }

  // --- Vue <script setup> macros ---
  if (name === 'defineEmits') return collectMacro(node, vue.emits)
  if (name === 'defineProps') return collectMacro(node, vue.props)
  if (name === 'defineModel') {
    const m = stringValue(args[0]) ?? 'modelValue'
    vue.props.add(m)
    vue.emits.add(`update:${m}`)
    return
  }
  // --- provide / inject (Vue) ---
  if (name === 'provide' && args.length >= 2) {
    const key = keyOf(args[0])
    if (key) addSymbol(unit, 'provide', key, line)
    return
  }
  if (name === 'inject' && args.length >= 1) {
    const key = keyOf(args[0])
    if (key) addRef(unit, 'inject', { key }, line, { confidence: 'inferred' })
    return
  }
  // --- React context ---
  if (name === 'useContext') {
    const a = args[0]
    if (a?.type === 'Identifier') addRef(unit, 'context', { name: a.name, spec: bindings.get(a.name)?.spec }, line)
    return
  }
  // --- custom hook / composable / store (useXxx, useXxxStore) ---
  if (name && /^use[A-Z0-9]/.test(name) && !REACT_BUILTIN_HOOKS.has(name) && !VUE_BUILTIN_COMPOSABLES.has(name)) {
    const spec = bindings.get(name)?.spec
    addRef(unit, /Store$/.test(name) ? 'store' : 'hook', { name, spec }, line, { confidence: spec ? 'certain' : 'inferred' })
    return
  }
  // --- app.component('Name', Comp): đăng ký component toàn cục ---
  if (prop === 'component' && args.length >= 2 && args[1].type === 'Identifier') {
    const cname = stringValue(args[0])
    if (cname) addRef(unit, 'global-component', { name: cname, spec: bindings.get(args[1].name)?.spec }, line)
    return
  }
  // --- DOM ---
  if (prop === 'getElementById') {
    const id = stringValue(args[0])
    if (id) addRef(unit, 'dom-id', { id }, line, { confidence: 'inferred' })
    return
  }
  if (prop === 'querySelector' || prop === 'querySelectorAll') {
    const sel = stringValue(args[0])
    if (sel) {
      for (const m of sel.matchAll(/([#.])([A-Za-z_][\w-]*)/g)) {
        if (m[1] === '#') addRef(unit, 'dom-id', { id: m[2] }, line, { confidence: 'inferred' })
        else addCssRef(ctx, 'css-class', m[2], line, 'inferred')
      }
    }
    return
  }
  // --- điều hướng: router.push('/x'), navigate('/x') ---
  if (((prop === 'push' || prop === 'replace') && /router$/i.test(obj ?? '')) || name === 'navigate' || name === 'navigateTo') {
    navRef(ctx, args[0], line)
    return
  }

  // --- lời gọi API ---
  let method = null
  let urlNode = null
  let optsNode = null
  if (name === 'fetch' || name === '$fetch' || name === 'ofetch' || name === 'useFetch') {
    method = 'GET'; urlNode = args[0]; optsNode = args[1]
  } else if (name === 'axios') {
    method = 'GET'
    if (args[0]?.type === 'ObjectExpression') { optsNode = args[0]; urlNode = propValue(args[0], 'url') }
    else { urlNode = args[0]; optsNode = args[1] }
  } else if (prop && HTTP_METHODS.has(prop) && args.length >= 1) {
    // Express/Fastify phía server: app.get('/x', handler) là ĐỊNH NGHĨA endpoint, không phải lời gọi
    if (isServerFile(ctx) && args.length >= 2 && ['app', 'router', 'server', 'fastify', 'api'].includes(obj)) {
      const path = urlPattern(args[0])
      if (path) addSymbol(unit, 'endpoint', `${prop.toUpperCase()} ${path}`, line, { method: prop.toUpperCase(), path, handler: obj, framework: 'express' })
      return
    }
    method = prop.toUpperCase()
    urlNode = args[0]
  }
  if (!urlNode) return
  let url = urlPattern(urlNode)
  if (!looksLikeUrl(url)) return
  const declared = optsNode?.type === 'ObjectExpression' ? stringValue(propValue(optsNode, 'method')) : null
  if (declared) method = declared.toUpperCase()
  let confidence = 'certain'
  if (url.startsWith('{*}')) { url = url.slice(3); confidence = 'inferred' } // `${BASE_URL}/api/x`
  addRef(unit, 'api-call', { method, url }, line, { confidence })
}

function collectMacro(node, set) {
  const a = node.arguments[0]
  if (a?.type === 'ArrayExpression') a.elements.forEach((e) => { const v = stringValue(e); if (v) set.add(v) })
  else if (a?.type === 'ObjectExpression') a.properties.forEach((p) => { const k = propKey(p); if (k) set.add(k) })
  // defineEmits<{ (e: 'change', id: number): void }>() hoặc defineEmits<{ change: [id: number] }>()
  const tp = (node.typeParameters ?? node.typeArguments)?.params?.[0]
  if (tp?.type !== 'TSTypeLiteral') return
  for (const m of tp.members) {
    if (m.type === 'TSPropertySignature') {
      const k = propKey(m)
      if (k) set.add(k)
    } else if (m.type === 'TSCallSignatureDeclaration') {
      const t = (m.parameters ?? m.params)?.[0]?.typeAnnotation?.typeAnnotation
      const literals = t?.type === 'TSUnionType' ? t.types : [t]
      for (const lt of literals) if (lt?.type === 'TSLiteralType' && typeof lt.literal.value === 'string') set.add(lt.literal.value)
    }
  }
}

function navRef(ctx, arg, line) {
  if (!arg) return
  const s = stringValue(arg)
  if (s) return addRef(ctx.unit, 'navigates', { path: s }, line, { confidence: 'inferred' })
  if (arg.type === 'ObjectExpression') {
    const routeName = stringValue(propValue(arg, 'name'))
    const path = stringValue(propValue(arg, 'path'))
    if (routeName || path) addRef(ctx.unit, 'navigates', routeName ? { routeName } : { path }, line, { confidence: 'inferred' })
  }
}

// ---------------------------------------------------------------------------
function handleJsx(ctx, node) {
  const { unit, L, bindings } = ctx
  const line = L(node)

  // className / id
  for (const a of node.attributes) {
    if (a.type !== 'JSXAttribute') continue
    const an = a.name?.name
    if (an === 'className' || an === 'class') {
      if (a.value?.type === 'StringLiteral') {
        a.value.value.split(/\s+/).filter(Boolean).forEach((c) => addCssRef(ctx, 'css-class', c, line, 'certain'))
      } else if (a.value?.type === 'JSXExpressionContainer') {
        walk(a.value.expression, (x) => {
          const s = x.type === 'StringLiteral' ? x.value : x.type === 'TemplateElement' ? x.value.cooked : null
          if (s) s.split(/\s+/).filter((c) => /^[A-Za-z_-][\w-]*$/.test(c)).forEach((c) => addCssRef(ctx, 'css-class', c, line, 'inferred'))
        })
      }
    } else if (an === 'id' && a.value?.type === 'StringLiteral') {
      addSymbol(unit, 'dom-id', a.value.value, line)
      addCssRef(ctx, 'css-id', a.value.value, line, 'certain')
    }
  }

  const n = node.name
  if (n.type === 'JSXMemberExpression') {
    if (n.property.name === 'Provider' && n.object.type === 'JSXIdentifier') {
      addRef(unit, 'context-provider', { name: n.object.name, spec: bindings.get(n.object.name)?.spec }, line)
    }
    return
  }
  if (n.type !== 'JSXIdentifier' || !/^[A-Z]/.test(n.name)) return

  const name = n.name
  const spec = bindings.get(name)?.spec
  const fromRouter = ROUTER_PACKAGES.test(spec ?? '') || spec === 'next/link'
  if (name === 'Route' && fromRouter) return handleJsxRoute(ctx, node, line)
  if (['Link', 'NavLink', 'Navigate'].includes(name) && fromRouter) {
    const to = jsxAttrString(node, 'to') ?? jsxAttrString(node, 'href')
    if (to) addRef(unit, 'navigates', { path: to }, line, { confidence: 'inferred' })
    return
  }
  // Callback truyền qua props (onSave={...}) là dạng tương đương "emit" của Vue
  const callbacks = node.attributes
    .filter((a) => a.type === 'JSXAttribute' && /^on[A-Z]/.test(a.name?.name ?? ''))
    .map((a) => a.name.name)
  addRef(unit, 'component', { name, spec }, line, { confidence: spec ? 'certain' : 'inferred', meta: { callbacks } })
}

function handleJsxRoute(ctx, node, line) {
  const path = jsxAttrString(node, 'path') ?? (jsxAttr(node, 'index') ? '(index)' : null)
  if (path == null) return
  addSymbol(ctx.unit, 'route', path, line, {})
  for (const key of ['element', 'component', 'Component']) {
    const expr = jsxAttrExpr(node, key)
    const target = expr && componentTargetOf(expr, ctx.bindings)
    if (target) {
      addRef(ctx.unit, 'route-view', target, line, { from: routeId(path) })
      break
    }
  }
}

// { path: '/x', component: X } (Vue Router) hoặc { path, element: <X/> } (React Router)
function handleRouteObject(ctx, node) {
  const path = stringValue(propValue(node, 'path'))
  if (path == null) return
  const view = propValue(node, 'component') ?? propValue(node, 'Component') ?? propValue(node, 'element') ?? propValue(node, 'lazy')
  if (!view && !propValue(node, 'children') && !propValue(node, 'redirect')) return
  const routePath = path || '(index)'
  const line = ctx.L(node)
  addSymbol(ctx.unit, 'route', routePath, line, { routeName: stringValue(propValue(node, 'name')) })
  const target = view && componentTargetOf(view, ctx.bindings)
  if (target) addRef(ctx.unit, 'route-view', target, line, { from: routeId(routePath) })
}

// styles.header với styles import từ '*.module.css'
function handleCssModule(ctx, node) {
  if (node.object.type !== 'Identifier') return
  const b = ctx.bindings.get(node.object.name)
  if (!b || !/\.module\.(css|scss|sass|less)$/.test(b.spec)) return
  const name = node.computed ? stringValue(node.property) : node.property.name
  if (!name) return
  const key = `cssm|${b.spec}|${name}`
  if (ctx.seen.has(key)) return
  ctx.seen.add(key)
  addRef(ctx.unit, 'css-module-class', { spec: b.spec, name }, ctx.L(node))
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function addCssRef(ctx, kind, name, line, confidence) {
  const key = `${kind}|${name}`
  if (ctx.seen.has(key)) return
  ctx.seen.add(key)
  addRef(ctx.unit, kind, { name }, line, { confidence })
}

function isServerFile(ctx) {
  return [...ctx.bindings.values()].some((b) => SERVER_PACKAGES.test(b.spec))
}

function classifyFunction(name, fn) {
  if (/^use[A-Z0-9]/.test(name)) return 'hook'
  if (/^[A-Z]/.test(name) && containsJsx(fn)) return 'component'
  if (fn.type === 'ClassDeclaration' || fn.type === 'ClassExpression') return 'class'
  return 'function'
}

function containsJsx(node) {
  let found = false
  walk(node, (n) => {
    if (found) return false
    if (n.type === 'JSXElement' || n.type === 'JSXFragment') { found = true; return false }
  })
  return found
}

function componentTargetOf(node, bindings) {
  let spec = null
  let name = null
  walk(node, (n) => {
    if (spec || name) return false
    if (n.type === 'CallExpression' && n.callee.type === 'Import') { spec = stringValue(n.arguments[0]); return false }
    if (n.type === 'ImportExpression') { spec = stringValue(n.source); return false }
    if ((n.type === 'Identifier' || n.type === 'JSXIdentifier') && /^[A-Z]/.test(n.name)) { name = n.name; return false }
  })
  if (spec) return { spec }
  if (name) return { name, spec: bindings.get(name)?.spec }
  return null
}

function unwrap(n) {
  while (n && ['TSAsExpression', 'TSSatisfiesExpression', 'TypeCastExpression', 'ParenthesizedExpression', 'TSNonNullExpression'].includes(n.type)) n = n.expression
  return n
}

function calleeName(callee) {
  if (!callee) return null
  if (callee.type === 'Identifier') return callee.name
  if (callee.type === 'MemberExpression' && !callee.computed) return callee.property.name
  return null
}

function memberRootName(node) {
  while (node?.type === 'MemberExpression') node = node.object
  if (node?.type === 'ThisExpression') return 'this'
  return node?.type === 'Identifier' ? node.name : null
}

function propKey(p) {
  const k = p?.key
  if (!k || p.computed) return null
  return k.type === 'Identifier' ? k.name : k.type === 'StringLiteral' ? k.value : null
}

function propValue(obj, key) {
  return obj?.properties?.find((p) => propKey(p) === key)?.value ?? null
}

function stringValue(node) {
  if (!node) return null
  if (node.type === 'StringLiteral') return node.value
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) return node.quasis.map((q) => q.value.cooked).join('')
  return null
}

function keyOf(node) {
  const s = stringValue(node)
  if (s) return s
  return node?.type === 'Identifier' ? `@${node.name}` : null // khoá dạng Symbol/const được export
}

// Dựng URL từ chuỗi / template / phép cộng chuỗi; phần động thành {*}
function urlPattern(node) {
  if (!node) return null
  if (node.type === 'StringLiteral') return node.value
  if (node.type === 'TemplateLiteral') return node.quasis.map((q, i) => q.value.cooked + (i < node.expressions.length ? '{*}' : '')).join('')
  if (node.type === 'BinaryExpression' && node.operator === '+') return (urlPattern(node.left) ?? '{*}') + (urlPattern(node.right) ?? '{*}')
  return null
}

function looksLikeUrl(u) {
  return typeof u === 'string' && (/^(https?:)?\/\//i.test(u) || u.startsWith('/') || u.startsWith('{*}/') || /^api\//i.test(u))
}

const jsxAttr = (node, name) => node.attributes.find((a) => a.type === 'JSXAttribute' && a.name?.name === name)
function jsxAttrString(node, name) {
  const v = jsxAttr(node, name)?.value
  if (!v) return null
  if (v.type === 'StringLiteral') return v.value
  if (v.type === 'JSXExpressionContainer') return stringValue(v.expression)
  return null
}
function jsxAttrExpr(node, name) {
  const v = jsxAttr(node, name)?.value
  return v?.type === 'JSXExpressionContainer' ? v.expression : null
}
