// 04-pass1-index.js — Bước 4, LƯỢT 1: parse mọi file và lập chỉ mục ký hiệu.
//
// ĐẦU VÀO: groups (từ 03), adapters, config (từ 02)
// ĐẦU RA (hoặc null nếu bị huỷ): {
//   units: Unit[]            kết quả từng file (symbol + ref chưa giải quyết + facts)
//   skipped: [{ path, reason: 'vendor' }]   thư viện nhận ra qua nội dung
//   index: SymbolIndex       tra cứu "ai định nghĩa cái gì" cho lượt 2
//   refs: Ref[]              toàn bộ tham chiếu chưa giải quyết
// }
//
// Vì sao phải 2 lượt: khi file A tham chiếu tới B, có thể B chưa được parse.
// Phải biết hết mọi định nghĩa (lượt 1) rồi mới nối tham chiếu (lượt 2).

import { readText, isVendorText } from './01-collect-files.js'
import { frameworkDetectors as defaultDetectors } from './frameworks/index.js'

export async function runPass1({
  groups, adapters, config, detectors = defaultDetectors, includeVendor = false,
  onProgress = () => {}, isCancelled = () => false,
}) {
  const adapterById = new Map(adapters.map((a) => [a.id, a]))
  const total = [...groups.values()].reduce((n, list) => n + list.length, 0)
  const units = []
  const skipped = [] // thư viện nhận ra qua nội dung (banner bản quyền / UMD)
  let done = 0

  for (const [adapterId, list] of groups) {
    const adapter = adapterById.get(adapterId)
    for (const sf of list) {
      let unit
      try {
        const text = await readText(sf)
        if (!includeVendor && isVendorText(sf.ext, text)) {
          skipped.push({ path: sf.path, reason: 'vendor', size: sf.size })
          sf.text = null
          done++
          continue
        }
        unit = adapter.analyze(sf, text, { config })
        for (const d of detectors) if (d.appliesTo(unit, config)) d.run(unit, config)
      } catch (e) {
        unit = { path: sf.path, adapterId, lang: adapterId, symbols: [], refs: [], facts: {}, roles: new Set(), errors: [String(e?.message ?? e)] }
      }
      if (config.entryFiles.has(sf.path)) unit.roles.add('entry')
      units.push(unit)
      sf.text = null // giải phóng bộ nhớ; nội dung sẽ được đọc lại khi cần hiển thị
      done++
      if (done % 25 === 0 || done === total) {
        onProgress({ stage: 'pass1', done, total })
        await new Promise((r) => setTimeout(r, 0)) // nhường luồng để Worker nhận được yêu cầu huỷ
        if (isCancelled()) return null
      }
    }
  }

  return { units, skipped, index: buildIndex(units, config), refs: units.flatMap((u) => u.refs) }
}

/**
 * SymbolIndex:
 *   unitsByPath   path -> unit
 *   byKind        kind -> Map(name -> Symbol[])     ví dụ byKind.get('component').get('SignPad')
 *   jvmByFqcn     'com.acme.UserService' -> path
 *   jvmByPackage  'com.acme' -> Set(path)
 *   csTypes       'UserService' -> [{ path, ns }]
 *   csGlobalUsings Set(namespace)
 */
export function buildIndex(units, config) {
  const index = {
    unitsByPath: new Map(),
    byKind: new Map(),
    jvmByFqcn: new Map(),
    jvmByPackage: new Map(),
    csTypes: new Map(),
    csGlobalUsings: new Set(config.csGlobalUsings),
  }
  for (const u of units) {
    index.unitsByPath.set(u.path, u)
    for (const s of u.symbols) {
      let byName = index.byKind.get(s.kind)
      if (!byName) index.byKind.set(s.kind, (byName = new Map()))
      const list = byName.get(s.name)
      if (list) list.push(s)
      else byName.set(s.name, [s])

      if (s.kind === 'class' && u.facts.jvm) index.jvmByFqcn.set(s.meta.fqcn, u.path)
      if (s.kind === 'class' && u.facts.cs) {
        const arr = index.csTypes.get(s.name) ?? []
        arr.push({ path: u.path, ns: s.meta.ns })
        index.csTypes.set(s.name, arr)
      }
    }
    if (u.facts.jvm) {
      const set = index.jvmByPackage.get(u.facts.jvm.pkg) ?? new Set()
      set.add(u.path)
      index.jvmByPackage.set(u.facts.jvm.pkg, set)
    }
    if (u.facts.cs) for (const us of u.facts.cs.usings) if (us.global) index.csGlobalUsings.add(us.ns)
  }
  return index
}

export const lookup = (index, kind, name) => index.byKind.get(kind)?.get(name) ?? []
