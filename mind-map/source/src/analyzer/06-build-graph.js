// 06-build-graph.js — Bước 5: dựng mô hình đồ thị TRUNG LẬP (không gắn với thư viện vẽ nào).
//
// ĐẦU VÀO: units (04), extraNodes + edges (05)
// ĐẦU RA: graphology Graph (directed, multi)
//
// Node:
//   file      { kind:'file', label, path, folder, lang, roles[], symbols[], unusedCss[], errors[] }
//   endpoint  { kind:'endpoint', label, method, urlPattern, framework, handler, external? }
//   route     { kind:'route', label, routeName }
//   external  { kind:'external', label }
// Cạnh:       { kind, confidence, count, labels[], locs[{ path, line }] }
//
// Gửi qua postMessage: graph.export()  —  nhận lại: Graph.from(json)

import Graph from 'graphology'
import { fileId, basename, dirname } from './utils.js'

const ROLE_FROM_SYMBOL = { component: 'component', store: 'store', hook: 'hook', context: 'context', route: 'router', endpoint: 'api' }
const HIDDEN_SYMBOLS = new Set(['css-class', 'css-id', 'dom-id'])

export function buildGraph({ units, extraNodes, edges }) {
  const g = new Graph({ type: 'directed', multi: true, allowSelfLoops: false })

  for (const u of units) {
    const roles = new Set(u.roles)
    for (const s of u.symbols) if (ROLE_FROM_SYMBOL[s.kind]) roles.add(ROLE_FROM_SYMBOL[s.kind])
    if (/(^|\/)(tests?|__tests__|spec)\//i.test(u.path) || /\.(test|spec)\.\w+$/i.test(u.path) || /(Tests?|_test)\.\w+$/.test(u.path)) roles.add('test')

    g.mergeNode(fileId(u.path), {
      kind: 'file',
      label: basename(u.path),
      path: u.path,
      folder: dirname(u.path),
      lang: u.lang,
      roles: [...roles],
      symbols: u.symbols
        .filter((s) => !HIDDEN_SYMBOLS.has(s.kind))
        .slice(0, 300)
        .map((s) => ({ kind: s.kind, name: s.name, line: s.line })),
      // class CSS không tìm thấy nơi dùng (có thể vẫn được dùng động — chỉ là gợi ý)
      unusedCss: u.symbols
        .filter((s) => s.kind === 'css-class' && !s.meta.used && !s.meta.module)
        .slice(0, 300)
        .map((s) => s.name),
      errors: u.errors.slice(0, 5),
    })
  }

  for (const [id, attrs] of extraNodes) g.mergeNode(id, attrs)

  for (const e of edges) {
    if (!g.hasNode(e.from) || !g.hasNode(e.to)) continue
    g.addEdge(e.from, e.to, { kind: e.kind, confidence: e.confidence, count: e.count, labels: e.labels, locs: e.locs })
  }
  return g
}
