// adapters/vue.js — Single File Component (.vue).
// Tách file thành <script>/<script setup> (-> analyzeScript), <template> (-> AST của compiler-dom)
// và <style> (-> analyzeCss).
//
// Thêm so với adapter JS:
//   symbol: component (meta.emits, meta.props), dom-id
//   ref:    component (thẻ trong template), listens (@event trên component con),
//           css-class / css-id từ template, navigates (<RouterLink to>)

import { parse as parseSfc } from '@vue/compiler-sfc'
import { createUnit, addSymbol, addRef, stripExt, toPascal, toKebab } from '../utils.js'
import { parseScript, analyzeScript } from './javascript.js'
import { analyzeCss } from './css.js'

const NODE_ELEMENT = 1
const PROP_ATTRIBUTE = 6
const PROP_DIRECTIVE = 7
const BUILTIN_TAGS = new Set([
  'component', 'slot', 'template', 'transition', 'transition-group', 'keep-alive',
  'teleport', 'suspense', 'router-view', 'router-link',
])

export const vueAdapter = {
  id: 'vue',
  extensions: ['.vue'],
  analyze(sf, text) {
    const unit = createUnit(sf, 'vue', 'vue')
    unit.facts.importBindings = new Map()
    unit.facts.vue = { emits: new Set(), props: new Set() }

    let descriptor
    try {
      ;({ descriptor } = parseSfc(text, { filename: sf.path, sourceMap: false }))
    } catch (e) {
      unit.errors.push(String(e.message ?? e))
      return unit
    }

    // 1) Script trước: cần import binding để biết thẻ <SignPad> trỏ tới file nào
    for (const block of [descriptor.script, descriptor.scriptSetup]) {
      if (!block) continue
      const lang = block.lang ?? 'js'
      try {
        const ast = parseScript(block.content, { ts: lang.startsWith('ts'), jsx: lang.endsWith('x') })
        analyzeScript(unit, ast, { lineOffset: block.loc.start.line - 1 })
      } catch (e) {
        unit.errors.push(`script: ${e.message ?? e}`)
      }
      if (block.src) addRef(unit, 'import', { spec: block.src }, block.loc.start.line)
    }
    // export default {...} trong .vue trùng với symbol component của chính file -> bỏ bản trùng
    unit.symbols = unit.symbols.filter((s) => !(s.kind === 'component' && s.meta.isDefault))
    addSymbol(unit, 'component', toPascal(stripExt(sf.name)), 1, {
      emits: [...unit.facts.vue.emits],
      props: [...unit.facts.vue.props],
    })

    // 2) Template (vị trí dòng trong AST tính trên toàn file .vue)
    const ast = descriptor.template?.ast
    if (ast) walkTemplate(ast.children ?? [], (node) => handleElement(unit, node))

    // 3) Style
    for (const style of descriptor.styles) {
      if (style.src) addRef(unit, 'import', { spec: style.src, css: true }, style.loc.start.line)
      analyzeCss(unit, style.content, {
        lineOffset: style.loc.start.line - 1,
        scopedTo: style.scoped ? sf.path : null,
        isModule: !!style.module,
      })
    }
    return unit
  },
}

function walkTemplate(children, fn) {
  for (const node of children) {
    if (node.type === NODE_ELEMENT) fn(node)
    if (node.children?.length) walkTemplate(node.children, fn)
    if (node.branches) for (const b of node.branches) walkTemplate(b.children ?? [], fn)
  }
}

function handleElement(unit, node) {
  const tag = node.tag
  const kebab = toKebab(tag)
  const line = node.loc?.start?.line ?? null
  const bindings = unit.facts.importBindings

  for (const p of node.props) {
    if (p.type === PROP_ATTRIBUTE) {
      const value = p.value?.content
      if (p.name === 'class' && value) value.split(/\s+/).filter(Boolean).forEach((c) => addRef(unit, 'css-class', { name: c }, line))
      else if (p.name === 'id' && value) {
        addSymbol(unit, 'dom-id', value, line)
        addRef(unit, 'css-id', { name: value }, line)
      } else if (p.name === 'to' && kebab === 'router-link' && value) {
        addRef(unit, 'navigates', { path: value }, line, { confidence: 'inferred' })
      }
    } else if (p.type === PROP_DIRECTIVE) {
      const arg = p.arg?.content
      const exp = p.exp?.content ?? ''
      if (p.name === 'bind' && arg === 'class') {
        for (const c of classesFromExpression(exp)) addRef(unit, 'css-class', { name: c }, line, { confidence: 'inferred' })
      } else if (p.name === 'bind' && arg === 'to' && kebab === 'router-link') {
        const byName = /name\s*:\s*['"]([^'"]+)['"]/.exec(exp)
        const byPath = /^['"`]([^'"`]+)['"`]$/.exec(exp.trim()) ?? /path\s*:\s*['"]([^'"]+)['"]/.exec(exp)
        if (byName) addRef(unit, 'navigates', { routeName: byName[1] }, line, { confidence: 'inferred' })
        else if (byPath) addRef(unit, 'navigates', { path: byPath[1] }, line, { confidence: 'inferred' })
      } else if (p.name === 'bind' && arg === 'is' && kebab === 'component') {
        unit.facts.dynamicComponents = (unit.facts.dynamicComponents ?? 0) + 1 // <component :is> — không xác định tĩnh được
      }
    }
  }

  const isComponentTag = /^[A-Z]/.test(tag) || tag.includes('-')
  if (!isComponentTag || BUILTIN_TAGS.has(kebab)) return

  const pascal = toPascal(tag)
  const binding = bindings.get(pascal) ?? bindings.get(tag)
  const events = node.props
    .filter((p) => p.type === PROP_DIRECTIVE && p.name === 'on' && p.arg?.content)
    .map((p) => p.arg.content)
  // v-model trên component = prop modelValue + emit update:modelValue
  for (const p of node.props) if (p.type === PROP_DIRECTIVE && p.name === 'model') events.push(`update:${p.arg?.content ?? 'modelValue'}`)

  addRef(unit, 'component', { name: pascal, spec: binding?.spec }, line, { confidence: binding ? 'certain' : 'inferred', meta: { events } })
  for (const event of events) addRef(unit, 'listens', { component: pascal, spec: binding?.spec, event }, line)
}

// :class="{ active: isActive, 'text-danger': hasError }" hoặc :class="['a', cond ? 'b' : 'c']"
function classesFromExpression(exp) {
  const out = new Set()
  for (const m of exp.matchAll(/['"`]([^'"`]+)['"`]/g)) m[1].split(/\s+/).forEach((c) => /^[A-Za-z_-][\w-]*$/.test(c) && out.add(c))
  for (const m of exp.matchAll(/([A-Za-z_][\w-]*)\s*:/g)) out.add(m[1])
  return out
}
