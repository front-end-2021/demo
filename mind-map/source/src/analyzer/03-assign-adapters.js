// 03-assign-adapters.js — Bước 3: gán mỗi file cho một language adapter theo đuôi file.
//
// ĐẦU VÀO: files (Map<path, SourceFile>), adapters (mảng LanguageAdapter, xem adapters/index.js)
// ĐẦU RA: { groups: Map<adapterId, SourceFile[]>, unassigned: string[] }
//
// Lưu ý: ở đây CHỈ chọn ngôn ngữ/parser. Việc nhận diện framework (Spring, ASP.NET,
// Flask...) chạy SAU, trên kết quả đã parse (xem frameworks/index.js), vì framework
// không xác định được qua đuôi file.

export function assignAdapters(files, adapters) {
  const byExt = new Map()
  for (const a of adapters) for (const ext of a.extensions) byExt.set(ext, a)

  const groups = new Map()
  const unassigned = []
  for (const sf of files.values()) {
    const adapter = byExt.get(sf.ext)
    if (!adapter || (adapter.match && !adapter.match(sf))) {
      unassigned.push(sf.path)
      continue
    }
    if (!groups.has(adapter.id)) groups.set(adapter.id, [])
    groups.get(adapter.id).push(sf)
  }
  return { groups, unassigned }
}
