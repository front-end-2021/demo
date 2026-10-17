import Graph from 'graphology'
import forceAtlas2 from 'graphology-layout-forceatlas2'

/** Tổng số vòng lặp ForceAtlas2 theo kích thước đồ thị. */
const totalIterations = (n) => (n <= 500 ? 500 : n <= 3000 ? 200 : n <= 8000 ? 80 : 50)
/** Số vòng mỗi đợt (sau mỗi đợt gửi vị trí về giao diện). */
const stepIterations = (n) => (n <= 3000 ? 20 : 10)

/** Vị trí ban đầu: xoắn ốc hướng dương — rải đều, không chồng nhau, nhìn được ngay. */
export function initialPositions(count, randomize = false) {
  const pos = new Float32Array(count * 2)
  const R = Math.sqrt(count) * 20
  const turn = randomize ? Math.random() * Math.PI * 2 : 0
  for (let i = 0; i < count; i++) {
    const r = R * Math.sqrt((i + 0.5) / count)
    const a = i * 2.39996 + turn + (randomize ? Math.random() : 0)
    pos[i * 2] = r * Math.cos(a)
    pos[i * 2 + 1] = r * Math.sin(a)
  }
  return pos
}

/**
 * Chạy ForceAtlas2 theo từng đợt; sau mỗi đợt gọi onStep(positions: Float32Array, done, total)
 * rồi nhường luồng (await) để Worker kịp nhận yêu cầu mới. isCancelled() trả về true → dừng ngay.
 * nodeIds theo đúng thứ tự của mảng positions. Trả về vị trí cuối cùng, hoặc null nếu bị huỷ.
 */
export async function runLayout(nodeIds, edges, positions, onStep, isCancelled = () => false) {
  const n = nodeIds.length
  if (n < 2) return positions
  const graph = new Graph({ type: 'directed', multi: false, allowSelfLoops: false })
  nodeIds.forEach((id, i) => graph.addNode(id, { x: positions[i * 2], y: positions[i * 2 + 1] }))
  for (const e of edges) graph.mergeEdge(e.source, e.target, { weight: e.weight || 1 })

  const settings = {
    ...forceAtlas2.inferSettings(graph),
    barnesHutOptimize: n > 500,
    edgeWeightInfluence: 0.5,
    strongGravityMode: true, // giữ các node lẻ (không liên kết) ở gần, không bị đẩy ra xa làm sơ đồ chính bị thu nhỏ
    gravity: 0.05,
  }
  const total = totalIterations(n)
  const step = stepIterations(n)
  let out = positions
  for (let done = 0; done < total; ) {
    const k = Math.min(step, total - done)
    forceAtlas2.assign(graph, { iterations: k, settings })
    done += k
    out = new Float32Array(n * 2)
    nodeIds.forEach((id, i) => {
      const a = graph.getNodeAttributes(id)
      out[i * 2] = a.x
      out[i * 2 + 1] = a.y
    })
    if (done >= total && n <= 80) spreadOverlaps(out) // đồ thị nhỏ (vd. tổng quan): tách node chồng lên nhau
    onStep(out.slice(), done, total)
    await new Promise((r) => setTimeout(r, 0))
    if (isCancelled()) return null
  }
  return out
}

/**
 * Đẩy các node quá gần nhau ra xa, khoảng cách tối thiểu = 22% kích thước sơ đồ (đủ chỗ cho nhãn tên project).
 * O(n²) nên chỉ dùng cho đồ thị nhỏ (node lẻ bị trọng lực kéo về cùng một chỗ trong ForceAtlas2).
 */
function spreadOverlaps(pos) {
  const n = pos.length / 2
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (let i = 0; i < n; i++) {
    minX = Math.min(minX, pos[i * 2]); maxX = Math.max(maxX, pos[i * 2])
    minY = Math.min(minY, pos[i * 2 + 1]); maxY = Math.max(maxY, pos[i * 2 + 1])
  }
  const minDist = Math.max(maxX - minX, maxY - minY, 1) * 0.22
  for (let iter = 0; iter < 60; iter++) {
    let moved = false
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = pos[j * 2] - pos[i * 2]
        let dy = pos[j * 2 + 1] - pos[i * 2 + 1]
        let d = Math.hypot(dx, dy)
        if (d >= minDist) continue
        if (d < 1e-6) { dx = Math.cos(i + j); dy = Math.sin(i + j); d = 1 } // trùng hẳn: đẩy theo một hướng bất kỳ
        const push = (minDist - d) / 2 / d
        pos[i * 2] -= dx * push; pos[i * 2 + 1] -= dy * push
        pos[j * 2] += dx * push; pos[j * 2 + 1] += dy * push
        moved = true
      }
    }
    if (!moved) break
  }
}
