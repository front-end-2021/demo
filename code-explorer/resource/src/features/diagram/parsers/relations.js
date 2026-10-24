// parsers/relations.js — Nối quan hệ giữa các kiểu (kế thừa, thực thi, kết hợp, tập hợp). Dùng chung mọi ngôn ngữ.
//
// Mỗi Type cần có: id, name, namespace, kind, baseRefs[] (tên dạng `A.B.Foo`, không generic), baseKinds?[] ('extends' |
// 'implements' | undefined), usings[] (namespace / module được nạp), fields[{ name, type }].

/** Tên (có thể có qualifier `a.b.Foo`) xuất hiện trong một chuỗi kiểu: `List<a.Foo>` → ['List', 'a.Foo']. */
const identsOf = (typeStr) => (String(typeStr ?? '').match(/[A-Za-z_$][\w$]*(?:\s*\.\s*[A-Za-z_$][\w$]*)*/g) ?? []).map((s) => s.replace(/\s+/g, ''))

/**
 * Tìm kiểu được tham chiếu bởi `ref` (tên đơn hoặc có qualifier) từ bên trong kiểu `from`.
 * Thứ tự: duy nhất trong tập → khớp qualifier → kiểu lồng trong chính `from` → cùng namespace → namespace được nạp;
 * còn mơ hồ thì trả về null (không vẽ quan hệ sai).
 * @param {(using: string, ns: string, name: string) => boolean} nsMatches so khớp mục được nạp với namespace của ứng viên
 *   (`name` = tên đơn đang tìm — Python chỉ nhìn thấy tên được import đích danh)
 */
function resolveType(ref, from, bySimple, nsMatches = (u, ns) => u === ns) {
  const parts = ref.split('.')
  const simple = parts.pop()
  const cands = bySimple.get(simple)
  if (!cands) return null
  if (cands.length === 1) return cands[0]
  if (parts.length) {
    const q = parts.join('.')
    const hit = cands.find((c) => c.namespace === q || c.namespace.endsWith(`.${q}`) || c.id === ref || c.id.endsWith(`.${ref}`))
    if (hit) return hit
  }
  return (
    cands.find((c) => c.namespace === from.id) ??
    cands.find((c) => c.namespace === from.namespace) ??
    cands.find((c) => from.usings.some((u) => nsMatches(u, c.namespace, simple))) ??
    null
  )
}

/**
 * @param {object[]} types
 * @param {{ collection: RegExp, idents?: (t: string) => string[], nsMatches?: Function }} opts
 *   collection: nhận ra kiểu là tập hợp (List<…>, Foo[]…) → quan hệ "tập hợp" thay vì "kết hợp"
 */
export function buildRelations(types, { collection, idents = identsOf, nsMatches } = {}) {
  const bySimple = new Map()
  for (const t of types) {
    if (!bySimple.has(t.name)) bySimple.set(t.name, [])
    bySimple.get(t.name).push(t)
  }
  const rels = new Map()
  const addMp = (from, to, kind, label = '', many = false) => {
    const key = `${from}|${to}|${kind}`; const r = rels.get(key)
    if (!r) rels.set(key, { key, from, to, kind, label, many, labels: label ? [label] : [] })
    else if (label && !r.labels.includes(label)) {
      r.labels.push(label);
      r.label = r.labels.join(', ')
    }
  }
  const interf = 'interface'
  const rlz = 'realization'
  const gnz = 'generalization'
  for (const t of types) {
    t.baseRefs.forEach((ref, i) => {
      const target = resolveType(ref, t, bySimple, nsMatches)
      if (!target || target === t) return
      const realization = t.baseKinds?.[i] === 'implements' || (target.kind === interf && t.kind !== interf)
      addMp(t.id, target.id, realization ? rlz : gnz)
    })
    for (const f of t.fields) {
      const many = collection.test(f.type ?? '')
      const seen = new Set()
      for (const id of idents(f.type ?? '')) {
        const target = resolveType(id, t, bySimple, nsMatches)
        if (!target || target === t || seen.has(target.id)) continue
        seen.add(target.id)
        addMp(t.id, target.id, many ? 'aggregation' : 'association', f.name, many)
      }
    }
  }
  return [...rels.values()].map(({ labels, ...r }) => ({ ...r, label: r.label + (r.many ? ' *' : '') }))
}
