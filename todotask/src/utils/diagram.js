/**
 * Bố cục + đi dây cho sơ đồ UML.
 *  - estimateSize(type)             ước lượng kích thước ô class (dùng trước khi đo được trên DOM)
 *  - autoLayout(model, sizeOf)      xếp class theo tầng kế thừa: lớp cha ở trên, lớp con ở dưới
 *  - routeEdges(relations, boxes)   vẽ đường nối trực giao bằng A* trên lưới 10px, né các ô class
 */

export const GRID = 10

// ---------------------------------------------------------------------------
// Kích thước ước lượng (khớp với CSS trong ClassBox.vue)
// ---------------------------------------------------------------------------
const CHAR = 7.2
const TITLE_CHAR = 8

export function estimateSize(t) {
  const attrs = t.kind === 'enum' ? t.values : t.fields
  const ops = t.methods
  const title = (t.display.length + (t.bases.length ? t.bases.join(', ').length + 2 : 0)) * TITLE_CHAR
  const rows = Math.max(0, ...[...attrs, ...ops].map((m) => (m.text.length + 2) * CHAR))
  const stereo = t.kind !== 'class' || t.abstract || t.static
  let h = stereo ? 46 : 32
  if (attrs.length) h += attrs.length * 18 + 10
  if (ops.length) h += ops.length * 18 + 10
  if (!attrs.length && !ops.length) h += 14
  return { w: Math.max(120, Math.ceil(Math.max(title, rows) + 34)), h }
}

// ---------------------------------------------------------------------------
// Bố cục tự động theo tầng
// ---------------------------------------------------------------------------
export function autoLayout(model, sizeOf, { maxWidth = 1400, gapX = 50, gapY = 90, margin = 30 } = {}) {
  const { types, relations } = model
  const byId = new Map(types.map((t) => [t.id, t]))
  const order = new Map(types.map((t, i) => [t.id, i]))

  // quan hệ kế thừa: con → cha
  const parents = new Map(types.map((t) => [t.id, []]))
  const hasHierarchy = new Set()
  for (const r of relations) {
    if (r.kind === 'generalization' || r.kind === 'realization') {
      parents.get(r.from).push(r.to)
      hasHierarchy.add(r.from)
      hasHierarchy.add(r.to)
    }
  }

  const level = new Map()
  const visiting = new Set()
  const levelOf = (id) => {
    if (level.has(id)) return level.get(id)
    if (visiting.has(id)) return 0 // chu trình
    visiting.add(id)
    const ps = parents.get(id) ?? []
    const l = ps.length ? 1 + Math.max(...ps.map(levelOf)) : 0
    visiting.delete(id)
    level.set(id, l)
    return l
  }
  types.forEach((t) => levelOf(t.id))

  // kiểu không nằm trong cây kế thừa nhưng được tham chiếu (vd. enum) → đặt ngay dưới nơi dùng nó
  for (const t of types) {
    if (hasHierarchy.has(t.id)) continue
    const owners = relations.filter((r) => r.to === t.id && r.from !== t.id && hasHierarchy.has(r.from)).map((r) => level.get(r.from))
    if (owners.length) level.set(t.id, Math.min(...owners) + 1)
  }

  const rowsByLevel = []
  for (const t of types) (rowsByLevel[level.get(t.id)] ??= []).push(t)

  const pos = {}
  const centerX = (id) => pos[id].x + sizeOf(byId.get(id)).w / 2
  let y = margin

  rowsByLevel.forEach((row) => {
    if (!row?.length) return
    // sắp theo trung bình vị trí của lớp cha (giảm đường chéo nhau)
    const bary = (t) => {
      const ps = (parents.get(t.id) ?? []).filter((p) => pos[p])
      return ps.length ? ps.reduce((a, p) => a + centerX(p), 0) / ps.length : Infinity
    }
    const sorted = [...row].sort((a, b) => {
      const d = bary(a) - bary(b)
      return Number.isFinite(d) && d !== 0 ? d : order.get(a.id) - order.get(b.id)
    })

    let x = margin
    let rowH = 0
    for (const t of sorted) {
      const s = sizeOf(t)
      const want = Number.isFinite(bary(t)) ? bary(t) - s.w / 2 : x
      let px = Math.max(x, want)
      if (px + s.w > maxWidth && x > margin) {
        y += rowH + 50 // xuống dòng con trong cùng tầng
        x = margin
        rowH = 0
        px = x
      }
      pos[t.id] = { x: snap(px), y: snap(y) }
      x = px + s.w + gapX
      rowH = Math.max(rowH, s.h)
    }
    y += rowH + gapY
  })
  return pos
}

export const snap = (v) => Math.round(v / GRID) * GRID

// ---------------------------------------------------------------------------
// Đi dây trực giao (A* trên lưới, có phạt rẽ & phạt chạy chồng lên đường khác)
// ---------------------------------------------------------------------------
const M = 6 // khoảng cách tối thiểu từ đường nối đến ô class
const BEND = 6 // phí cho mỗi lần rẽ
const OVERLAP = 2 // phí chạy trùng đoạn đã có đường khác
const DX = [1, 0, -1, 0] // 0 phải, 1 xuống, 2 trái, 3 lên
const DY = [0, 1, 0, -1]
const SIDE = { top: { out: 3, in: 1 }, bottom: { out: 1, in: 3 }, left: { out: 2, in: 0 }, right: { out: 0, in: 2 } }
const MAX_EXPAND = 80000

function pickSides(a, b) {
  const below = b.y - (a.y + a.h)
  const above = a.y - (b.y + b.h)
  const right = b.x - (a.x + a.w)
  const left = a.x - (b.x + b.w)
  const vGap = Math.max(below, above)
  const hGap = Math.max(right, left)
  const hOverlap = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 20
  if (vGap > 0 && (hOverlap || vGap >= hGap)) return below > 0 ? ['bottom', 'top'] : ['top', 'bottom']
  if (hGap > 0) return right > 0 ? ['right', 'left'] : ['left', 'right']
  return ['right', 'right'] // hai ô chồng nhau
}

/** Chia đều các cổng trên một cạnh, căn theo lưới. */
function placePorts(box, side, n) {
  const horiz = side === 'top' || side === 'bottom'
  const start = horiz ? box.x : box.y
  const len = horiz ? box.w : box.h
  const lo = Math.ceil((start + GRID) / GRID) * GRID
  const hi = Math.max(lo, Math.floor((start + len - GRID) / GRID) * GRID)
  const out = []
  let prev = -Infinity
  for (let i = 0; i < n; i++) {
    let p = snap(start + (len * (i + 1)) / (n + 1))
    p = Math.min(hi, Math.max(lo, p))
    if (p <= prev) p = prev + GRID
    out.push(p)
    prev = p
  }
  return out
}

class MinHeap {
  constructor() {
    this.a = []
  }
  push(f, id, g) {
    const a = this.a
    a.push([f, id, g])
    let i = a.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (a[p][0] <= a[i][0]) break
      ;[a[p], a[i]] = [a[i], a[p]]
      i = p
    }
  }
  pop() {
    const a = this.a
    const top = a[0]
    const last = a.pop()
    if (a.length) {
      a[0] = last
      let i = 0
      for (;;) {
        const l = 2 * i + 1
        const r = l + 1
        let m = i
        if (l < a.length && a[l][0] < a[m][0]) m = l
        if (r < a.length && a[r][0] < a[m][0]) m = r
        if (m === i) break
        ;[a[m], a[i]] = [a[i], a[m]]
        i = m
      }
    }
    return top
  }
  get size() {
    return this.a.length
  }
}

function astar(ctx, s, t, startDir, endDir) {
  const { cols, rows, blocked, usedH, usedV, gscore, stamp, parent, gen } = ctx
  const cells = cols * rows
  const FINISH = cells * 4
  const sid = ((s.j * cols + s.i) << 2) | startDir
  const heap = new MinHeap()
  const h = (i, j) => Math.abs(i - t.i) + Math.abs(j - t.j)

  stamp[sid] = gen
  gscore[sid] = 0
  parent[sid] = -1
  heap.push(h(s.i, s.j), sid, 0)
  stamp[FINISH] = 0

  let expanded = 0
  while (heap.size && expanded++ < MAX_EXPAND) {
    const [, id, g] = heap.pop()
    if (id === FINISH) {
      const out = []
      let cur = parent[FINISH]
      while (cur !== -1) {
        const cell = cur >> 2
        out.push({ i: cell % cols, j: (cell / cols) | 0 })
        cur = parent[cur]
      }
      return out.reverse()
    }
    if (g > gscore[id]) continue
    const d = id & 3
    const cell = id >> 2
    const i = cell % cols
    const j = (cell / cols) | 0

    if (i === t.i && j === t.j) {
      const fg = g + (d === endDir ? 0 : BEND)
      if (stamp[FINISH] !== gen || fg < gscore[FINISH]) {
        stamp[FINISH] = gen
        gscore[FINISH] = fg
        parent[FINISH] = id
        heap.push(fg, FINISH, fg)
      }
    }

    for (let nd = 0; nd < 4; nd++) {
      if (nd === ((d + 2) & 3)) continue
      const ni = i + DX[nd]
      const nj = j + DY[nd]
      if (ni < 0 || nj < 0 || ni >= cols || nj >= rows) continue
      const ncell = nj * cols + ni
      if (blocked[ncell]) continue
      let cost = 1 + (nd === d ? 0 : BEND)
      if (nd === 0 || nd === 2) {
        if (usedH[j * cols + Math.min(i, ni)]) cost += OVERLAP
      } else if (usedV[Math.min(j, nj) * cols + i]) cost += OVERLAP
      const ng = g + cost
      const nid = (ncell << 2) | nd
      if (stamp[nid] !== gen || ng < gscore[nid]) {
        stamp[nid] = gen
        gscore[nid] = ng
        parent[nid] = id
        heap.push(ng + h(ni, nj), nid, ng)
      }
    }
  }
  return null
}

function simplify(points) {
  const pts = points.filter((p, i) => i === 0 || p.x !== points[i - 1].x || p.y !== points[i - 1].y)
  return pts.filter((p, i) => {
    if (i === 0 || i === pts.length - 1) return true
    const a = pts[i - 1]
    const b = pts[i + 1]
    return !((a.x === p.x && p.x === b.x) || (a.y === p.y && p.y === b.y))
  })
}

function roundedPath(pts, r = 7) {
  let d = `M${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const l1 = Math.hypot(p1.x - p0.x, p1.y - p0.y)
    const l2 = Math.hypot(p2.x - p1.x, p2.y - p1.y)
    const rad = Math.min(r, l1 / 2, l2 / 2)
    const a = { x: p1.x + ((p0.x - p1.x) / l1) * rad, y: p1.y + ((p0.y - p1.y) / l1) * rad }
    const b = { x: p1.x + ((p2.x - p1.x) / l2) * rad, y: p1.y + ((p2.y - p1.y) / l2) * rad }
    d += ` L${a.x} ${a.y} Q${p1.x} ${p1.y} ${b.x} ${b.y}`
  }
  const last = pts[pts.length - 1]
  return d + ` L${last.x} ${last.y}`
}

/**
 * Chọn chỗ đặt nhãn trên đường nối: ưu tiên đoạn dài, không đè lên ô class hay nhãn khác.
 * Đoạn ngang → nhãn nằm phía trên, đoạn dọc → nhãn nằm bên phải.
 */
function placeLabel(pts, text, boxes, taken) {
  const w = text.length * 6.4 + 6
  const h = 14
  const cands = []
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y)
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    if (a.y === b.y) cands.push({ len, x: mx, y: my - 6, anchor: 'middle', rect: { x: mx - w / 2, y: my - 6 - h + 3, w, h } })
    else cands.push({ len, x: mx + 6, y: my + 4, anchor: 'start', rect: { x: mx + 6, y: my - h / 2, w, h } })
  }
  cands.sort((p, q) => q.len - p.len)
  const hits = (r, o) => r.x < o.x + o.w && r.x + r.w > o.x && r.y < o.y + o.h && r.y + r.h > o.y
  const free = (c) => !Object.values(boxes).some((b) => hits(c.rect, b)) && !taken.some((t) => hits(c.rect, t))
  const pick = cands.find(free) ?? cands[0]
  taken.push(pick.rect)
  return pick
}

/**
 * @param relations  [{ key, from, to, kind, label }]
 * @param boxes      { [id]: { x, y, w, h } }
 * @returns          [{ key, from, to, kind, d, points, label, lx, ly }]
 */
export function routeEdges(relations, boxes) {
  const edges = relations
    .filter((r) => boxes[r.from] && boxes[r.to] && r.from !== r.to)
    .map((r, idx) => {
      const [sa, sb] = pickSides(boxes[r.from], boxes[r.to])
      return { r, idx, sa, sb }
    })
  if (!edges.length) return []

  // ---- 1. chia cổng trên từng cạnh của từng ô ----
  const slots = new Map()
  const addSlot = (id, side, edge, end, other) => {
    const key = `${id}|${side}`
    const horiz = side === 'top' || side === 'bottom'
    const o = boxes[other]
    const sort = horiz ? o.x + o.w / 2 : o.y + o.h / 2
    if (!slots.has(key)) slots.set(key, { id, side, list: [] })
    slots.get(key).list.push({ edge, end, sort })
  }
  for (const e of edges) {
    addSlot(e.r.from, e.sa, e, 'a', e.r.to)
    addSlot(e.r.to, e.sb, e, 'b', e.r.from)
  }
  for (const { id, side, list } of slots.values()) {
    list.sort((p, q) => p.sort - q.sort || p.edge.idx - q.edge.idx)
    const ps = placePorts(boxes[id], side, list.length)
    const b = boxes[id]
    list.forEach((item, k) => {
      const horiz = side === 'top' || side === 'bottom'
      const pt = horiz ? { x: ps[k], y: side === 'top' ? b.y : b.y + b.h } : { x: side === 'left' ? b.x : b.x + b.w, y: ps[k] }
      item.edge[item.end] = pt
    })
  }

  // ---- 2. lưới chắn ----
  let maxR = 0
  let maxB = 0
  for (const b of Object.values(boxes)) {
    maxR = Math.max(maxR, b.x + b.w)
    maxB = Math.max(maxB, b.y + b.h)
  }
  const cols = Math.ceil((maxR + 100) / GRID) + 2
  const rows = Math.ceil((maxB + 100) / GRID) + 2
  const blocked = new Uint8Array(cols * rows)
  for (const b of Object.values(boxes)) {
    const i0 = Math.floor((b.x - M) / GRID) + 1
    const i1 = Math.ceil((b.x + b.w + M) / GRID) - 1
    const j0 = Math.floor((b.y - M) / GRID) + 1
    const j1 = Math.ceil((b.y + b.h + M) / GRID) - 1
    for (let j = Math.max(0, j0); j <= Math.min(rows - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(cols - 1, i1); i++) blocked[j * cols + i] = 1
  }
  const states = cols * rows * 4 + 1
  const ctx = {
    cols,
    rows,
    blocked,
    usedH: new Uint8Array(cols * rows),
    usedV: new Uint8Array(cols * rows),
    gscore: new Float32Array(states),
    stamp: new Int32Array(states),
    parent: new Int32Array(states),
    gen: 0,
  }

  // ---- 3. đi dây: đường ngắn trước ----
  const outside = (pt, side) => {
    // nút lưới đầu tiên nằm ngoài vùng chắn, đi thẳng ra khỏi cổng
    if (side === 'top') return { i: pt.x / GRID, j: Math.floor((pt.y - M - 0.01) / GRID) }
    if (side === 'bottom') return { i: pt.x / GRID, j: Math.ceil((pt.y + M + 0.01) / GRID) }
    if (side === 'left') return { i: Math.floor((pt.x - M - 0.01) / GRID), j: pt.y / GRID }
    return { i: Math.ceil((pt.x + M + 0.01) / GRID), j: pt.y / GRID }
  }
  const order = [...edges].sort((p, q) => dist(p) - dist(q))
  function dist(e) {
    return Math.abs(e.a.x - e.b.x) + Math.abs(e.a.y - e.b.y)
  }

  const out = []
  const taken = []
  for (const e of order) {
    const S = outside(e.a, e.sa)
    const T = outside(e.b, e.sb)
    const clampNode = (n) => ({ i: Math.min(cols - 1, Math.max(0, n.i)), j: Math.min(rows - 1, Math.max(0, n.j)) })
    const s = clampNode(S)
    const t = clampNode(T)
    const sCell = s.j * cols + s.i
    const tCell = t.j * cols + t.i
    const sOld = blocked[sCell]
    const tOld = blocked[tCell]
    blocked[sCell] = 0
    blocked[tCell] = 0
    ctx.gen++
    const nodes = astar(ctx, s, t, SIDE[e.sa].out, SIDE[e.sb].in)
    blocked[sCell] = sOld
    blocked[tCell] = tOld

    let pts
    if (nodes) {
      for (let k = 1; k < nodes.length; k++) {
        const p = nodes[k - 1]
        const q = nodes[k]
        if (p.j === q.j) ctx.usedH[p.j * cols + Math.min(p.i, q.i)] = 1
        else ctx.usedV[Math.min(p.j, q.j) * cols + p.i] = 1
      }
      pts = [e.a, ...nodes.map((n) => ({ x: n.i * GRID, y: n.j * GRID })), e.b]
    } else {
      // không tìm được đường: nối thẳng kiểu chữ L (có thể cắt qua ô khác)
      const sp = { x: s.i * GRID, y: s.j * GRID }
      const tp = { x: t.i * GRID, y: t.j * GRID }
      pts = [e.a, sp, { x: tp.x, y: sp.y }, tp, e.b]
    }
    pts = simplify(pts)
    const label = e.r.label ?? ''
    const lp = label ? placeLabel(pts, label, boxes, taken) : { x: 0, y: 0, anchor: 'middle' }
    out[e.idx] = { key: e.r.key, from: e.r.from, to: e.r.to, kind: e.r.kind, label, d: roundedPath(pts), points: pts, lx: lp.x, ly: lp.y, anchor: lp.anchor, routed: !!nodes }
  }
  return out.filter(Boolean)
}

/** Kiểm tra (dùng cho test): đoạn nào của đường nối đi xuyên qua phần bên trong của một ô class. */
export function segmentsCrossingBoxes(points, boxes) {
  const hits = []
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const x0 = Math.min(a.x, b.x)
    const x1 = Math.max(a.x, b.x)
    const y0 = Math.min(a.y, b.y)
    const y1 = Math.max(a.y, b.y)
    for (const [id, bx] of Object.entries(boxes)) {
      // phần bên trong thu nhỏ 1px: chạm viền (cổng) không tính là cắt
      if (x1 > bx.x + 1 && x0 < bx.x + bx.w - 1 && y1 > bx.y + 1 && y0 < bx.y + bx.h - 1) hits.push(id)
    }
  }
  return hits
}
