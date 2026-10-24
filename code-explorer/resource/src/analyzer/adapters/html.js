// adapters/html.js — HTML.
//   ref:    import (<script src>, <link rel=stylesheet>), css-class, css-id,
//           global-function (onclick="fn()"), + mọi thứ trong <script> inline
//   symbol: dom-id, + css trong <style> inline

import { parse } from 'parse5'
import { createUnit, addSymbol, addRef } from '../utils.js'
import { parseScript, analyzeScript } from './javascript.js'
import { analyzeCss } from './css.js'

export const htmlAdapter = {
  id: 'html',
  extensions: ['.html', '.htm'],
  analyze(sf, text) {
    const unit = createUnit(sf, 'html', 'html')
    unit.facts.importBindings = new Map()
    const doc = parse(text, { sourceCodeLocationInfo: true })
    walkHtml(doc, (node) => handleNode(unit, node))
    return unit
  },
}

function walkHtml(node, fn) {
  fn(node)
  for (const c of node.childNodes ?? []) walkHtml(c, fn)
  if (node.content) walkHtml(node.content, fn) // nội dung <template>
}

const attr = (node, name) => node.attrs?.find((a) => a.name === name)?.value
const innerText = (node) => (node.childNodes ?? []).map((c) => c.value ?? '').join('')

function handleNode(unit, node) {
  if (!node.tagName) return
  const line = node.sourceCodeLocation?.startLine ?? null
  const tag = node.tagName

  if (tag === 'script') {
    const src = attr(node, 'src')
    if (src) addRef(unit, 'import', { spec: src, html: true }, line)
    else {
      const type = attr(node, 'type') ?? ''
      const code = innerText(node)
      if (code.trim() && (!type || /module|javascript|babel|jsx/.test(type))) {
        try {
          analyzeScript(unit, parseScript(code, { jsx: /babel|jsx/.test(type) }), { lineOffset: (line ?? 1) - 1 })
        } catch (e) {
          unit.errors.push(`inline script (dòng ${line}): ${e.message ?? e}`)
        }
      }
    }
  } else if (tag === 'link') {
    const rel = (attr(node, 'rel') ?? '').toLowerCase()
    const href = attr(node, 'href')
    if (href && /stylesheet|modulepreload/.test(rel)) addRef(unit, 'import', { spec: href, html: true, css: rel.includes('stylesheet') }, line)
  } else if (tag === 'style') {
    analyzeCss(unit, innerText(node), { lineOffset: (line ?? 1) - 1 })
  }

  for (const a of node.attrs ?? []) {
    if (a.name === 'class') {
      a.value.split(/\s+/).filter(Boolean).forEach((c) => addRef(unit, 'css-class', { name: c }, line))
    } else if (a.name === 'id' && a.value) {
      addSymbol(unit, 'dom-id', a.value, line)
      addRef(unit, 'css-id', { name: a.value }, line)
    } else if (/^on[a-z]+$/.test(a.name)) {
      // onclick="saveDoc(); track('x')" -> hàm toàn cục saveDoc, track
      for (const m of a.value.matchAll(/(?:^|[;\s(!])([A-Za-z_$][\w$]*)\s*\(/g)) {
        addRef(unit, 'global-function', { name: m[1], event: a.name.slice(2) }, line, { confidence: 'inferred' })
      }
    }
  }
}
