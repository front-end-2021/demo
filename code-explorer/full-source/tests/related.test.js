import test from 'node:test'
import assert from 'node:assert/strict'
import { computeRelated } from '../src/analyzer/related.js'
import { buildViewModel } from '../src/analyzer/08-view-model.js'

/** Đồ thị đa cạnh giả, cùng chữ ký callback với graphology: (edge, attrs, source, target, sourceAttrs, targetAttrs) */
function fakeGraph(nodes, edges) {
  const attrs = new Map(nodes)
  const each = (pick) => (id, cb) => edges.forEach(([s, t, a], i) => { if (pick(s, t) === id) cb(`e${i}`, a, s, t, attrs.get(s), attrs.get(t)) })
  return {
    hasNode: (id) => attrs.has(id),
    getNodeAttributes: (id) => attrs.get(id),
    forEachNode: (cb) => attrs.forEach((a, id) => cb(id, a)),
    forEachOutEdge: each((s) => s),
    forEachInEdge: each((s, t) => t),
    forEachEdge: (cb) => edges.forEach(([s, t, a], i) => cb(`e${i}`, a, s, t)),
    filterNodes: (fn) => [...attrs].filter(([id, a]) => fn(id, a)).map(([id]) => id),
  }
}

const file = (path, symbols = []) => [`f:${path}`, { kind: 'file', label: path.split('/').pop(), path, symbols }]
const edge = (from, to, kind, extra = {}) => [from, to, { kind, confidence: 'certain', count: 1, labels: [], locs: [], ...extra }]
const sym = (name, kind, line) => ({ name, kind, line })

// web/App.vue  --imports(helper)-->  web/util.js        (App dùng helper ở dòng 3 và 9; helper định nghĩa ở dòng 20)
// web/App.vue  --calls-api--> endpoint "GET /users"  <--exposes-- api/UsersController.cs (định nghĩa ở dòng 15)
// web/App.vue  --imports--> external "lodash"
// web/main.js  --imports--> web/App.vue (dòng 5 của main.js)
const G = fakeGraph(
  [
    file('web/App.vue', [sym('App', 'component', 1), sym('tmp', 'variable', 4), sym('onSave', 'function', 12)]),
    file('web/util.js', [sym('helper', 'function', 20), sym('other', 'function', 40)]),
    file('web/main.js'),
    file('api/UsersController.cs', [sym('UsersController', 'class', 8)]),
    ['ep:GET /users', { kind: 'endpoint', label: 'GET /users' }],
    ['ext:lodash', { kind: 'external', label: 'lodash' }],
  ],
  [
    edge('f:web/App.vue', 'f:web/util.js', 'imports', { count: 2, labels: ['helper'], locs: [{ path: 'web/App.vue', line: 3 }, { path: 'web/App.vue', line: 9 }] }),
    edge('f:web/App.vue', 'ep:GET /users', 'calls-api', { confidence: 'inferred', labels: ['GET'], locs: [{ path: 'web/App.vue', line: 30 }] }),
    edge('f:api/UsersController.cs', 'ep:GET /users', 'exposes', { locs: [{ path: 'api/UsersController.cs', line: 15 }] }),
    edge('f:web/App.vue', 'ext:lodash', 'imports'),
    edge('f:web/main.js', 'f:web/App.vue', 'imports', { labels: ['App'], locs: [{ path: 'web/main.js', line: 5 }] }),
  ],
)
const idOf = (p) => `f:${p}`

test('Dùng: nhảy tới DÒNG ĐỊNH NGHĨA của symbol được dùng, kèm các dòng dùng trong file hiện tại', () => {
  const r = computeRelated(G, 'web/App.vue', idOf)
  const util = r.uses.find((e) => e.path === 'web/util.js')
  assert.equal(util.line, 20) // helper được định nghĩa ở dòng 20 của util.js (không phải symbol đầu tiên)
  assert.deepEqual(util.lines, [3, 9]) // App.vue dùng ở dòng 3 và 9
  assert.deepEqual(util.kinds, ['imports'])
  assert.deepEqual(util.labels, ['helper'])
  assert.equal(util.confidence, 'certain')
})

test('Dùng: gọi API được nối tới FILE ĐỊNH NGHĨA endpoint (xuyên project), kèm dòng định nghĩa', () => {
  const ctrl = computeRelated(G, 'web/App.vue', idOf).uses.find((e) => e.path === 'api/UsersController.cs')
  assert.deepEqual(ctrl.kinds, ['calls-api'])
  assert.deepEqual(ctrl.labels, ['GET /users']) // nhãn là endpoint, không phải 'GET'
  assert.equal(ctrl.line, 15) // dòng định nghĩa endpoint lấy từ cạnh `exposes`
  assert.deepEqual(ctrl.lines, [30]) // App.vue gọi API ở dòng 30
  assert.equal(ctrl.confidence, 'inferred')
})

test('Dùng: thư viện ngoài tách riêng; cạnh định nghĩa (exposes) không bị tính là "dùng"', () => {
  const r = computeRelated(G, 'web/App.vue', idOf)
  assert.deepEqual(r.externals, ['lodash'])
  assert.deepEqual(r.uses.map((e) => e.path).sort(), ['api/UsersController.cs', 'web/util.js'])
  assert.deepEqual(computeRelated(G, 'api/UsersController.cs', idOf).uses, []) // chỉ định nghĩa endpoint, không dùng gì
})

test('Được dùng bởi: nhảy tới DÒNG file kia dùng mình', () => {
  const r = computeRelated(G, 'web/App.vue', idOf)
  assert.equal(r.usedBy.length, 1)
  assert.deepEqual(r.usedBy[0], { path: 'web/main.js', kinds: ['imports'], labels: ['App'], confidence: 'certain', count: 1, line: 5, lines: [5] })
})

test('Được dùng bởi: file back-end được gọi từ front-end qua endpoint của nó', () => {
  const r = computeRelated(G, 'api/UsersController.cs', idOf)
  assert.equal(r.usedBy.length, 1)
  assert.equal(r.usedBy[0].path, 'web/App.vue')
  assert.deepEqual(r.usedBy[0].kinds, ['calls-api'])
  assert.deepEqual(r.usedBy[0].labels, ['GET /users'])
  assert.equal(r.usedBy[0].line, 30) // mở App.vue ở dòng gọi API
})

test('Định nghĩa: symbol của file, bỏ biến, xếp theo dòng', () => {
  const r = computeRelated(G, 'web/App.vue', idOf)
  assert.deepEqual(r.symbols, [{ kind: 'component', name: 'App', line: 1 }, { kind: 'function', name: 'onSave', line: 12 }])
})

test('file không có trong đồ thị (README, .json…): found=false, các danh sách rỗng', () => {
  assert.deepEqual(computeRelated(G, 'README.md', idOf), { path: 'README.md', found: false, symbols: [], uses: [], usedBy: [], externals: [] })
})

test('nhiều cạnh giữa hai file được gộp thành MỘT mục; mục xếp theo số tham chiếu giảm dần', () => {
  const g = fakeGraph(
    [file('a.js'), file('b.js', [sym('Foo', 'class', 7)]), file('c.js')],
    [
      edge('f:a.js', 'f:b.js', 'imports', { count: 1, labels: ['Foo'] }),
      edge('f:a.js', 'f:b.js', 'calls', { count: 3, labels: ['bar'], locs: [{ path: 'a.js', line: 11 }] }),
      edge('f:a.js', 'f:c.js', 'imports', { count: 1 }),
    ],
  )
  const r = computeRelated(g, 'a.js', idOf)
  assert.deepEqual(r.uses.map((e) => e.path), ['b.js', 'c.js'])
  assert.deepEqual(r.uses[0].kinds, ['imports', 'calls'])
  assert.deepEqual(r.uses[0].labels, ['Foo', 'bar'])
  assert.equal(r.uses[0].count, 4)
  assert.equal(r.uses[0].line, 7) // theo nhãn 'Foo' → class Foo ở dòng 7
})

test('nhãn kiểu CSS ".btn" và tên có chấm "Ns.Foo" vẫn tra được symbol', () => {
  const g = fakeGraph(
    [file('a.cs'), file('b.cs', [sym('Foo', 'class', 3)])],
    [edge('f:a.cs', 'f:b.cs', 'imports', { labels: ['Ns.Foo'] })],
  )
  assert.equal(computeRelated(g, 'a.cs', idOf).uses[0].line, 3)
})

test('buildViewModel.related: tra id node theo đường dẫn rồi trả về cùng kết quả', () => {
  const model = buildViewModel(G, { paths: ['web/App.vue', 'web/util.js', 'web/main.js', 'api/UsersController.cs'], rootName: 'repo' })
  const r = model.related('web/App.vue')
  assert.equal(r.found, true)
  assert.equal(r.uses.find((e) => e.path === 'web/util.js').line, 20)
  assert.equal(model.related('nope.txt').found, false)
})
