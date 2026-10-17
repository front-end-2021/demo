// adapters/css.js — CSS / SCSS / Less.
//   symbol: css-class, css-id (meta.scopedTo: style scoped của Vue, meta.module: CSS Modules)
//   ref:    import (@import / @use / @forward)

import postcssScss from 'postcss-scss'
import selectorParser from 'postcss-selector-parser'
import { createUnit, addSymbol, addRef, maskComments, makeLineLookup } from '../utils.js'

export const cssAdapter = {
  id: 'css',
  extensions: ['.css', '.scss', '.sass', '.less', '.pcss'],
  analyze(sf, text) {
    const unit = createUnit(sf, 'css', 'css')
    analyzeCss(unit, text, { isModule: /\.module\.(css|scss|sass|less)$/.test(sf.name) })
    return unit
  },
}

/** Dùng chung cho file CSS, <style> của .vue và <style> trong HTML. */
export function analyzeCss(unit, text, { lineOffset = 0, scopedTo = null, isModule = false } = {}) {
  const classes = new Map() // tên -> dòng đầu tiên
  const ids = new Map()
  let root = null
  try {
    root = postcssScss.parse(text)
  } catch {
    root = null
  }

  if (root) {
    root.walkAtRules((rule) => {
      if (!['import', 'use', 'forward'].includes(rule.name)) return
      const line = (rule.source?.start?.line ?? 0) + lineOffset
      for (const spec of specsFromParams(rule.params)) addRef(unit, 'import', { spec, css: true }, line)
    })
    root.walkRules((rule) => {
      const line = (rule.source?.start?.line ?? 0) + lineOffset
      const selector = fullSelector(rule)
      try {
        selectorParser((sel) => {
          sel.walkClasses((c) => { if (!classes.has(c.value)) classes.set(c.value, line) })
          sel.walkIds((i) => { if (!ids.has(i.value)) ids.set(i.value, line) })
        }).processSync(selector)
      } catch {
        regexSelectors(selector, line, classes, ids) // ví dụ selector có nội suy #{$x}
      }
    })
  } else {
    regexScan(unit, text, lineOffset, classes, ids)
  }

  const meta = { scopedTo, module: isModule }
  for (const [name, line] of classes) addSymbol(unit, 'css-class', name, line, { ...meta })
  for (const [name, line] of ids) addSymbol(unit, 'css-id', name, line, { ...meta })
}

// SCSS lồng nhau: .card { &__title {} } -> .card__title (hỗ trợ BEM)
function fullSelector(rule) {
  const sel = rule.selector ?? ''
  if (!sel.includes('&') || rule.parent?.type !== 'rule') return sel
  const parent = fullSelector(rule.parent).split(',')[0].trim()
  return sel.split(',').map((s) => s.replace(/&/g, parent)).join(',')
}

function regexSelectors(sel, line, classes, ids) {
  for (const m of sel.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) if (!classes.has(m[1])) classes.set(m[1], line)
  for (const m of sel.matchAll(/#(-?[_a-zA-Z][\w-]*)/g)) if (!ids.has(m[1])) ids.set(m[1], line)
}

// Phương án dự phòng khi postcss không parse được (ví dụ cú pháp .sass thụt lề)
function regexScan(unit, text, lineOffset, classes, ids) {
  const src = maskComments(text, { style: 'c' })
  const lineAt = makeLineLookup(src)
  for (const m of src.matchAll(/@(import|use|forward)\s+([^;\n]+)/g)) {
    for (const spec of specsFromParams(m[2])) addRef(unit, 'import', { spec, css: true }, lineAt(m.index) + lineOffset)
  }
  for (const m of src.matchAll(/([^{};]+)\{/g)) {
    const sel = m[1].trim()
    if (sel && !sel.startsWith('@')) regexSelectors(sel, lineAt(m.index) + lineOffset, classes, ids)
  }
}

function specsFromParams(params) {
  const out = []
  for (const m of String(params).matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)|['"]([^'"]+)['"]/g)) {
    const s = (m[1] ?? m[2]).trim()
    if (s && !/^(https?:)?\/\//.test(s) && !s.startsWith('sass:')) out.push(s)
  }
  return out
}
