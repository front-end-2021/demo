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
const SLIDE_MAX = 6 // đoạn không kẹt giữa hai ô: được dịch tối đa 6 ô lưới (60px) mỗi phía để tránh trùng
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
  const mSome = (c) => {
    for (let b of boxes.values()) {
      if(hits(c.rect, b)) { return true }
    }
    return false
  }
  const free = (c) => !mSome(c) && !taken.some((t) => hits(c.rect, t))
  const pick = cands.find(free) ?? cands[0]
  taken.push(pick.rect)
  return pick
}

/** Các nút lưới nằm trên đoạn ngang/dọc p→q. */
function nodesOnSegment(p, q) {
  const out = []
  if (p.x === q.x) {
    const i = p.x / GRID
    for (let j = Math.ceil(Math.min(p.y, q.y) / GRID); j <= Math.floor(Math.max(p.y, q.y) / GRID); j++) out.push([i, j])
  } else {
    const j = p.y / GRID
    for (let i = Math.ceil(Math.min(p.x, q.x) / GRID); i <= Math.floor(Math.max(p.x, q.x) / GRID); i++) out.push([i, j])
  }
  return out
}

/** Số bước lưới của đoạn p→q đang trùng với đoạn của một đường khác (used.H / used.V). */
function countOverlap(p, q, used) {
  if (!used || (p.x === q.x && p.y === q.y)) return 0
  const horizontal = p.y === q.y
  const ns = nodesOnSegment(p, q)
  let c = 0
  for (let n = 1; n < ns.length; n++) {
    const [i, j] = ns[n]
    const [pi, pj] = ns[n - 1]
    if (horizontal ? used.H[j * used.cols + Math.min(i, pi)] : used.V[Math.min(j, pj) * used.cols + i]) c++
  }
  return c
}

/**
 * Căn giữa các đoạn thẳng nằm giữa hai ô class.
 * Với mỗi đoạn không chạm cổng (đoạn giữa của đường chữ Z, các đoạn giữa của đường nhiều khúc rẽ):
 *  - đoạn dọc kẹt giữa một ô bên trái và một ô bên phải → dời ngang về giữa khe hở
 *  - đoạn ngang kẹt giữa một ô phía trên và một ô phía dưới → dời dọc về giữa khe hở
 * Chỉ trượt các đoạn "bậc thang" (hai đoạn kề cùng hướng, trượt không làm đường dài thêm), thử các vị trí
 * trên lưới gần tâm nhất trước và lấy vị trí đầu tiên không đụng ô nào. Đoạn từ cổng ra nút lưới đầu tiên (sp, tp) giữ nguyên.
 */
function centerSegments(pts, boxes, sp, tp, isFree, used) {
  const last = pts[pts.length - 1]
  if (pts.length < 4 || !(sp.x === pts[0].x || sp.y === pts[0].y) || !(tp.x === last.x || tp.y === last.y)) return pts
  let cur = pts
  for (let pass = 0; pass < 2; pass++) {
    for (let k = 1; k + 2 < cur.length; k++) cur = slideSegment(cur, k, boxes, sp, tp, isFree, used) ?? cur
  }
  return cur
}

function slideSegment(pts, k, boxes, sp, tp, isFree, used) {
  const n = pts.length
  const p = pts[k]
  const q = pts[k + 1]
  const vertical = p.x === q.x
  const ax = vertical ? 'x' : 'y' // trục mà đoạn trượt trên đó
  const sx = vertical ? 'y' : 'x' // trục dọc theo chiều dài đoạn
  const lo = Math.min(p[sx], q[sx])
  const hi = Math.max(p[sx], q[sx])
  const at = p[ax]

  // hai ô gần nhất ở hai bên của đoạn (chỉ xét ô có phần chồng lên đoạn theo chiều dài của nó)
  let L = -Infinity
  let R = Infinity
  boxes.forEach((b) => {
    const s0 = vertical ? b.y : b.x
    const s1 = s0 + (vertical ? b.h : b.w)
    if (!(s0 < hi && s1 > lo)) { return } // continue
    const a0 = vertical ? b.x : b.y
    const a1 = a0 + (vertical ? b.w : b.h)
    if (a1 <= at) L = Math.max(L, a1)
    else if (a0 >= at) R = Math.min(R, a0)
  })
  const bounded = Number.isFinite(L) && Number.isFinite(R)
  const mid = bounded ? (L + R) / 2 : at

  // số đoạn lưới của 3 đoạn bị ảnh hưởng (k-1, k, k+1) đang chạy trùng đường khác
  const overlapOf = (m) => {
    let c = 0
    for (let a = k - 1; a <= k + 1; a++) c += countOverlap(m[a], m[a + 1], used)
    return c
  }
  const now = overlapOf(pts)

  const dPrev = Math.sign(at - pts[k - 1][ax])
  const dNext = Math.sign(pts[k + 2][ax] - q[ax])
  if (dPrev === 0 || dNext === 0) return null
  const uShape = dPrev !== dNext
  // đường quay đầu (chữ U) chỉ được trượt khi cần tránh trùng, vì trượt sẽ làm đường dài thêm
  if (uShape && now === 0) return null
  if (!bounded && now === 0) return null

  const prevRef = k === 1 ? sp : pts[k - 1]
  const nextRef = k + 2 === n - 1 ? tp : pts[k + 2]
  const cands = []
  if (bounded) {
    for (let v = Math.ceil(L / GRID) * GRID; v <= R; v += GRID) {
      if (v <= L || v === at) continue
      if (now === 0 && Math.abs(v - mid) >= Math.abs(at - mid)) continue
      cands.push(v)
    }
  } else {
    for (let d = 1; d <= SLIDE_MAX; d++) cands.push(at + d * GRID, at - d * GRID)
  }

  const scored = []
  for (const v of cands) {
    // hai đoạn kề vẫn phải đi đúng hướng cũ (riêng đoạn ngay sau cổng được phép dài 0)
    const okPrev = k === 1 ? (v - prevRef[ax]) * dPrev >= 0 : (v - prevRef[ax]) * dPrev > 0
    const okNext = k + 2 === n - 1 ? (nextRef[ax] - v) * dNext >= 0 : (nextRef[ax] - v) * dNext > 0
    if (!okPrev || !okNext) continue
    const m = pts.map((pt) => ({ ...pt }))
    m[k][ax] = v
    m[k + 1][ax] = v
    const ov = overlapOf(m)
    if (now > 0 ? ov >= now : ov > 0) continue // phải ít trùng hơn hiện tại (hoặc không được gây trùng mới)
    scored.push({ v, m, ov, d: bounded ? Math.abs(v - mid) : Math.abs(v - at) })
  }
  scored.sort((a, b) => a.ov - b.ov || a.d - b.d)
  for (const c of scored) if (isFree([sp, ...c.m.slice(1, -1), tp])) return simplify(c.m)
  return null
}

/**
 * @param relations  [{ key, from, to, kind, label }]
 * @param boxes      Map { [id]: { x, y, w, h } }
 * @returns          [{ key, from, to, kind, d, points, label, lx, ly }]
 */
export function routeEdges(relations, boxes) {
  const edges = relations
    .filter((r) => boxes.get(r.from) && boxes.get(r.to) && r.from !== r.to)
    .map((r, idx) => {
      const [sa, sb] = pickSides(boxes.get(r.from), boxes.get(r.to))
      return { r, idx, sa, sb }
    })
  if (!edges.length) return []

  // ---- 1. chia cổng trên từng cạnh của từng ô ----
  const slots = new Map()
  const addSlot = (id, side, edge, end, other) => {
    const key = `${id}|${side}`
    const horiz = side === 'top' || side === 'bottom'
    const o = boxes.get(other)
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
    const ps = placePorts(boxes.get(id), side, list.length)
    const b = boxes.get(id)
    list.forEach((item, k) => {
      const horiz = side === 'top' || side === 'bottom'
      const pt = horiz ? { x: ps[k], y: side === 'top' ? b.y : b.y + b.h } : { x: side === 'left' ? b.x : b.x + b.w, y: ps[k] }
      item.edge[item.end] = pt
    })
  }

  // ---- 2. lưới chắn ----
  let maxR = 0, maxB = 0
  boxes.forEach((b) => {
    maxR = Math.max(maxR, b.x + b.w)
    maxB = Math.max(maxB, b.y + b.h)
  })
  const cols = Math.ceil((maxR + 100) / GRID) + 2
  const rows = Math.ceil((maxB + 100) / GRID) + 2
  const blocked = new Uint8Array(cols * rows)
  boxes.forEach((b) => {
    const i0 = Math.floor((b.x - M) / GRID) + 1
    const i1 = Math.ceil((b.x + b.w + M) / GRID) - 1
    const j0 = Math.floor((b.y - M) / GRID) + 1
    const j1 = Math.ceil((b.y + b.h + M) / GRID) - 1
    for (let j = Math.max(0, j0); j <= Math.min(rows - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(cols - 1, i1); i++) blocked[j * cols + i] = 1
  })
  const states = cols * rows * 4 + 1
  const ctx = {
    cols, rows,
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
  function dist(e) { return Math.abs(e.a.x - e.b.x) + Math.abs(e.a.y - e.b.y) }

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

    let pts
    if (nodes) {
      pts = simplify([e.a, ...nodes.map((n) => ({ x: n.i * GRID, y: n.j * GRID })), e.b])
      // căn giữa các đoạn nằm giữa hai ô class (chạy khi hai nút s, t còn đang mở khoá)
      const isFree = (m) =>
        m.every((p, k) => k === 0 || nodesOnSegment(m[k - 1], p).every(([i, j]) => i >= 0 && j >= 0 && i < cols && j < rows && !blocked[j * cols + i]))
      pts = centerSegments(pts, boxes, { x: s.i * GRID, y: s.j * GRID }, { x: t.i * GRID, y: t.j * GRID }, isFree, { H: ctx.usedH, V: ctx.usedV, cols })
    } else {
      // không tìm được đường: nối thẳng kiểu chữ L (có thể cắt qua ô khác)
      const sp = { x: s.i * GRID, y: s.j * GRID }
      const tp = { x: t.i * GRID, y: t.j * GRID }
      pts = simplify([e.a, sp, { x: tp.x, y: sp.y }, tp, e.b])
    }
    blocked[sCell] = sOld
    blocked[tCell] = tOld

    // đánh dấu các đoạn đã dùng (theo đường cuối cùng) để các đường sau tránh chạy trùng
    for (let k = 1; k < pts.length; k++) {
      const horizontal = pts[k].y === pts[k - 1].y
      const ns = nodesOnSegment(pts[k - 1], pts[k])
      for (let n = 1; n < ns.length; n++) {
        const [i, j] = ns[n]
        const [pi, pj] = ns[n - 1]
        if (horizontal) ctx.usedH[j * cols + Math.min(i, pi)] = 1
        else ctx.usedV[Math.min(j, pj) * cols + i] = 1
      }
    }
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
    boxes.forEach((bx, id) => {
      // phần bên trong thu nhỏ 1px: chạm viền (cổng) không tính là cắt
      if (x1 > bx.x + 1 && x0 < bx.x + bx.w - 1 && y1 > bx.y + 1 && y0 < bx.y + bx.h - 1) hits.push(id)
    })
  }
  return hits
}
