import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCSharp } from '../src/features/diagram/parsers/csharp.js'
import { parseFiles, canDiagram, supportedLabel } from '../src/features/diagram/parsers/index.js'
import { autoLayout, estimateSize, routeEdges, segmentsCrossingBoxes } from '../src/features/diagram/layout.js'
import { SAMPLE_CSHARP } from './fixtures/sample-csharp.js'

const model = parseCSharp(SAMPLE_CSHARP)
const layout = autoLayout(model, estimateSize)
//const boxes = Object.fromEntries(model.types.map((t) => [t.id, { ...layout[t.id], ...estimateSize(t) }]))
const boxes = new Map(model.types.map((t) => [t.id, { ...layout[t.id], ...estimateSize(t) }]))

test('mẫu có namespace: id đầy đủ đi qua autoLayout — mọi class đều có vị trí hữu hạn', () => {
  assert.ok(model.types.length >= 5 && model.types.every((t) => t.id.startsWith('Demo.')))
  for (const t of model.types) {
    assert.ok(Number.isFinite(layout[t.id]?.x) && Number.isFinite(layout[t.id]?.y), t.id)
  }
})

test('xếp tầng theo kế thừa: lớp cha nằm trên lớp con', () => {
  const inherit = model.relations.filter((r) => r.kind === 'generalization' || r.kind === 'realization')
  assert.ok(inherit.length >= 2)
  for (const r of inherit) assert.ok(layout[r.to].y < layout[r.from].y, `${r.to} phải nằm trên ${r.from}`)
})

test('routeEdges: mỗi quan hệ có một đường nối hữu hạn, nhãn và đường đi không xuyên qua ô class', () => {
  const edges = routeEdges(model.relations, boxes)
  assert.equal(edges.length, model.relations.length)
  for (const e of edges) {
    assert.ok(e.d && e.points.length >= 2, e.key)
    assert.ok(e.points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)), e.key)
    assert.deepEqual(segmentsCrossingBoxes(e.points, boxes), [], `${e.key} xuyên qua ô class`)
  }
})

test('hai class cùng tên khác namespace: hai ô riêng, cả hai đều có vị trí và đường nối riêng', () => {
  const m = parseCSharp('namespace A { class User {} class SvcA { User u; } } namespace B { class User {} class SvcB { User u; } }')
  const lay = autoLayout(m, estimateSize)
  assert.deepEqual(m.types.map((t) => t.id).sort(), ['A.SvcA', 'A.User', 'B.SvcB', 'B.User'])
  assert.ok(m.types.every((t) => lay[t.id]))
 // const bx = Object.fromEntries(m.types.map((t) => [t.id, { ...lay[t.id], ...estimateSize(t) }]))
  const bx = new Map(m.types.map((t) => [t.id, { ...lay[t.id], ...estimateSize(t) }]))
  assert.deepEqual(routeEdges(m.relations, bx).map((e) => `${e.from}>${e.to}`).sort(), ['A.SvcA>A.User', 'B.SvcB>B.User'])
})

test('registry parser: nhận .cs .java .kt .py; file khác được báo là chưa hỗ trợ', () => {
  for (const p of ['src/Order.cs', 'src/Order.CS', 'a/B.java', 'a/B.kt', 'a/b.py']) assert.equal(canDiagram(p), true, p)
  for (const p of ['src/app.js', 'README.md', 'a/b.kts', 'a/b.pyi', 'a/b.rb']) assert.equal(canDiagram(p), false, p)
  assert.match(supportedLabel(), /C#.*Java.*Kotlin.*Python/)
  const r = parseFiles([{ path: 'a.cs', text: 'class A { B b; } class B { }' }, { path: 'x.js', text: 'class A {}' }, { path: 'y.rb', text: '' }])
  assert.deepEqual(r.types.map((t) => t.id), ['A', 'B'])
  assert.deepEqual(r.relations.map((x) => `${x.from}>${x.to}`), ['A>B'])
  assert.deepEqual(r.unsupported, ['x.js', 'y.rb'])
})
