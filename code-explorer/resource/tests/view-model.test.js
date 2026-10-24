import test from 'node:test'
import assert from 'node:assert/strict'
import { buildViewModel } from '../src/analyzer/08-view-model.js'

// Đồ thị giả tối thiểu (đủ các phương thức buildViewModel dùng của graphology)
function fakeGraph(nodes, edges = []) {
  return {
    forEachNode: (cb) => nodes.forEach(([id, a]) => cb(id, a)),
    forEachEdge: (cb) => edges.forEach(([s, t, a], i) => cb(`e${i}`, a, s, t)),
    forEachInEdge: (id, cb) => edges.forEach(([s, t, a], i) => { if (t === id) cb(`e${i}`, a, s, t) }),
    filterNodes: (fn) => nodes.filter(([id, a]) => fn(id, a)).map(([id]) => id),
  }
}

const sym = (name, kind, line) => ({ name, kind, line })
const PATHS = ['A/A.csproj', 'A/Foo.cs', 'A/Bar.cs', 'B/package.json', 'B/app.js', 'README.md']
const graph = fakeGraph([
  ['A/Foo.cs', { kind: 'file', label: 'Foo.cs', path: 'A/Foo.cs', lang: 'csharp', symbols: [sym('FooService', 'class', 3), sym('Run', 'method', 7), sym('tmp', 'variable', 9)] }],
  ['A/Bar.cs', { kind: 'file', label: 'Bar.cs', path: 'A/Bar.cs', lang: 'csharp', symbols: [sym('BarFoo', 'class', 1)] }],
  ['B/app.js', { kind: 'file', label: 'app.js', path: 'B/app.js', lang: 'javascript', symbols: [sym('fooHelper', 'function', 12)] }],
])
const model = buildViewModel(graph, { paths: PATHS, rootName: 'repo' })

test('projectOf: file thuộc project theo thư mục chứa file đánh dấu (.csproj, package.json)', () => {
  assert.equal(model.projectOf('A/Foo.cs'), 'A/')
  assert.equal(model.projectOf('B/app.js'), 'B/')
  assert.equal(model.projectOf('A/docs/readme.md'), 'A/') // file không có node vẫn thuộc project
  assert.equal(model.projectOf('README.md'), '/') // ở thư mục gốc
})

test('searchSymbols: tìm theo tên, xếp trùng/bắt đầu bằng trước, bỏ qua biến, có path và dòng', () => {
  const { hits, total } = model.searchSymbols('foo')
  assert.equal(total, 3)
  assert.deepEqual(hits.map((h) => h.name), ['fooHelper', 'FooService', 'BarFoo']) // "bắt đầu bằng" trước "chứa"; cùng điểm: tên ngắn trước
  assert.deepEqual(hits[1], { name: 'FooService', kind: 'class', line: 3, path: 'A/Foo.cs' })
  assert.equal(model.searchSymbols('tmp').total, 0) // symbol kiểu variable không được lập chỉ mục
  assert.equal(model.searchSymbols('').total, 0)
})

test('searchSymbols: lọc theo đuôi file', () => {
  assert.deepEqual(model.searchSymbols('foo', { exts: new Set(['.js']) }).hits.map((h) => h.name), ['fooHelper'])
})
