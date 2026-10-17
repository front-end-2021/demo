/**
 * Bóc tách quan hệ giữa class / hàm / file thành dữ liệu đồ thị (node + cạnh).
 * Đầu vào là các file ĐÃ được làm sạch (xoá comment) bởi readSources() trong sourceFiles.js.
 *
 * Độ phức tạp: mỗi file chỉ được quét tuyến tính vài lần (O(tổng độ dài mã nguồn)),
 * tra cứu tên bằng Map, chống trùng cạnh bằng Map → không có vòng lặp lồng nhau theo số thực thể.
 */

/* ------------------------------------------------------------------------------------------ */

const BRACE_LANGS = new Set(['cs', 'java', 'js', 'mjs', 'jsx', 'ts', 'tsx', 'vue'])
const JS_LANGS = new Set(['js', 'mjs', 'jsx', 'ts', 'tsx', 'vue'])
const LANG_TAG = { cs: 'CS', java: 'JAVA', py: 'PY', js: 'JS', mjs: 'JS', jsx: 'JSX', ts: 'TS', tsx: 'TSX', vue: 'VUE' }

/** Vị trí kết thúc khối mã bắt đầu từ `from` (đếm ngoặc nhọn; nếu gặp ; hoặc xuống dòng trước { thì là biểu thức 1 dòng). */
function braceBlockEnd(src, from) {
  let i = from
  for (; i < src.length; i++) {
    const c = src[i]
    if (c === '{') break
    if (c === ';') return i
    if (c === '\n') { // arrow function 1 dòng không có { }: kết thúc ở cuối dòng
      const head = src.slice(from, i)
      if (head.includes('=>') && !/=>\s*$/.test(head)) return i
    }
  }
  let depth = 0
  for (; i < src.length; i++) {
    const c = src[i]
    if (c === '{') depth++
    else if (c === '}' && --depth === 0) return i
  }
  return src.length
}

/** Vị trí kết thúc khối Python: dòng đầu tiên (không trống) có thụt lề ≤ dòng định nghĩa. */
function indentBlockEnd(src, defIndex) {
  const lineStart = src.lastIndexOf('\n', defIndex) + 1
  const indent = /^[ \t]*/.exec(src.slice(lineStart, defIndex + 1))[0].length
  const re = /\n([ \t]*)(?=\S)/g
  re.lastIndex = src.indexOf('\n', defIndex)
  if (re.lastIndex < 0) return src.length
  let m
  while ((m = re.exec(src))) if (m[1].length <= indent && src[m.index + 1 + m[1].length] !== '#') return m.index
  return src.length
}

/** Tách danh sách lớp cha từ phần khai báo: ": Base, IFoo" / "extends A implements B, C" / "(Base, metaclass=M)" */
function parseBases(text) {
  if (!text) return []
  let t = text.replace(/\bwhere\b[\s\S]*/, '').replace(/\([^)]*\)/g, ' ')
  for (let k = 0; k < 5 && /<[^<>]*>/.test(t); k++) t = t.replace(/<[^<>]*>/g, '') // bỏ generic lồng nhau
  return t
    .split(/[\s,:]+/)
    .filter((w) => w && !w.includes('=') && !['extends', 'implements', 'public', 'private', 'protected', 'virtual'].includes(w))
    .map((w) => w.split('.').pop())
    .filter((w) => /^[A-Za-z_$][\w$]*$/.test(w))
}

/**
 * Phân tích danh sách file đã làm sạch → { nodes, edges, stats }.
 *  - projectOf(path) → id project chứa file; node mang thuộc tính `project`.
 *    Tên trùng nhau ở nhiều project được giữ riêng; khi tra lời gọi, ưu tiên định nghĩa trong CÙNG project.
 *  - onProgress(done, total) được gọi trong khi phân tích (dùng để báo về từ Web Worker).
 * Cạnh trả về dạng gọn { source, target, kind, weight }.
 */
export function parseProjectCode(files, { projectOf = () => '' } = {}, onProgress) {
  const total = files.length * 2
  let step = 0
  for (const f of files) f.project = projectOf(f.path)

  const nodes = new Map() // id → data
  const edges = new Map() // id → data
  const nameIndex = new Map() // tên class/hàm → { first: id, byProject: Map(project → id) }
  const cssIndex = new Map() // tên class CSS → [id node]
  const fileDefs = new Map() // path → [{ start, end, id, namePos }]
  const inherits = [] // { source, bases }

  const addNode = (id, data) => { if (!nodes.has(id)) nodes.set(id, { id, ...data }) }
  const addEdge = (source, target, kind) => {
    if (source === target || !nodes.has(source) || !nodes.has(target)) return // không bao giờ tạo cạnh tới node không tồn tại
    if (kind === 'call' && edges.has(`inherit:${source}->${target}`)) return // đã có cạnh kế thừa
    const id = `${kind}:${source}->${target}`
    const e = edges.get(id)
    if (e) e.weight++
    else edges.set(id, { source, target, kind, weight: 1 })
  }
  const fileNode = (f) => {
    const id = `file:${f.path}`
    addNode(id, { label: f.path.split('/').slice(-2).join('/'), type: f.ext === 'html' ? 'html' : 'file', file: f.path, project: f.project })
    return id
  }
  /** Tên → id node: ưu tiên định nghĩa cùng project, nếu không có thì lấy định nghĩa đầu tiên trong solution. */
  const resolve = (name, project) => {
    const entry = nameIndex.get(name)
    return entry && (entry.byProject.get(project) || entry.first)
  }

  // ---------- BƯỚC 1: tìm định nghĩa → node ----------
  for (const f of files) {
    const src = f.content
    const defs = []
    const define = (name, kind, typeLabel, nameIdx, blockFrom, isPy) => {
      let entry = nameIndex.get(name)
      if (!entry) nameIndex.set(name, (entry = { first: null, byProject: new Map() }))
      let id = entry.byProject.get(f.project)
      if (!id) {
        const type = kind === 'class' ? 'class' : 'function'
        id = `${type}:${f.project}:${name}`
        entry.byProject.set(f.project, id)
        entry.first ??= id
        addNode(id, { label: `[${LANG_TAG[f.ext]}] ${typeLabel}: ${name}`, type, file: f.path, project: f.project })
      }
      const end = isPy ? indentBlockEnd(src, nameIdx) : braceBlockEnd(src, blockFrom)
      defs.push({ start: nameIdx, end, id, namePos: nameIdx })
      return id
    }
    let m

    if (f.ext === 'cs' || f.ext === 'java') {
      const re = /\b(class|interface|struct|record|enum)\s+([A-Za-z_]\w*)([^{;]*)/g
      while ((m = re.exec(src))) {
        const label = { class: 'Class', interface: 'Interface', struct: 'Struct', record: 'Record', enum: 'Enum' }[m[1]]
        const id = define(m[2], 'class', label, m.index + m[0].indexOf(m[2], m[1].length), m.index)
        inherits.push({ source: id, project: f.project, bases: parseBases(m[3]) })
      }
    }

    if (f.ext === 'py') {
      const reClass = /^[ \t]*class\s+([A-Za-z_]\w*)\s*(?:\(([^)]*)\))?\s*:/gm
      while ((m = reClass.exec(src))) {
        const id = define(m[1], 'class', 'Class', m.index + m[0].indexOf(m[1]), 0, true)
        inherits.push({ source: id, project: f.project, bases: parseBases(m[2]) })
      }
      const reDef = /^[ \t]*(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(/gm
      while ((m = reDef.exec(src))) if (!/^__\w+__$/.test(m[1])) define(m[1], 'function', 'Function', m.index + m[0].indexOf(m[1]), 0, true)
    }

    if (JS_LANGS.has(f.ext)) {
      const reClass = /\bclass\s+([A-Za-z_$][\w$]*)(?:\s*<[^>{]*>)?\s*((?:extends|implements)[^{]*)?\{/g
      while ((m = reClass.exec(src))) {
        const id = define(m[1], 'class', 'Class', m.index + m[0].indexOf(m[1], 5), m.index)
        inherits.push({ source: id, project: f.project, bases: parseBases(m[2]) })
      }
      const reFn = /\bfunction\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/g
      while ((m = reFn.exec(src))) define(m[1], 'function', 'Function', m.index + m[0].lastIndexOf(m[1]), m.index)
      // const foo = (a) => …  |  const foo = async x => …  |  const foo = function (…)
      const reArrow = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=;\n]+)?=\s*(?:async\s+)?(?:function\b|\([^()]*\)\s*(?::[^=;{}\n]+)?=>|[A-Za-z_$][\w$]*\s*=>)/g
      while ((m = reArrow.exec(src))) define(m[1], 'function', 'Function', m.index + m[0].indexOf(m[1]), m.index)
    }

    if (f.ext === 'html') fileNode(f)

    if (f.ext === 'css') {
      const re = /\.(-?[_a-zA-Z][\w-]*)(?=[^{}]*\{)/g
      const seen = new Set()
      while ((m = re.exec(src))) {
        if (seen.has(m[1])) continue
        seen.add(m[1])
        const id = `css:${f.path}:${m[1]}`
        addNode(id, { label: `[CSS] .${m[1]} (${f.name})`, type: 'css', file: f.path, project: f.project })
        if (!cssIndex.has(m[1])) cssIndex.set(m[1], [])
        cssIndex.get(m[1]).push(id)
      }
    }

    defs.sort((a, b) => a.start - b.start)
    fileDefs.set(f.path, defs)
    onProgress?.(++step, total)
  }

  // Kế thừa: chỉ nối tới lớp cha có trong dự án (lớp của framework như ControllerBase bị bỏ qua)
  for (const { source, project, bases } of inherits) {
    for (const b of bases) {
      const target = resolve(b, project)
      if (target?.startsWith('class:')) addEdge(source, target, 'inherit')
    }
  }

  // ---------- BƯỚC 2: tìm lời gọi / tham chiếu → cạnh ----------
  for (const f of files) {
    const src = f.content

    if (BRACE_LANGS.has(f.ext) || f.ext === 'py') {
      const defs = fileDefs.get(f.path)
      const namePositions = new Set(defs.map((d) => d.namePos))
      const stack = []
      let next = 0
      const re = /[A-Za-z_$][\w$]*/g
      let m
      while ((m = re.exec(src))) {
        const target = resolve(m[0], f.project)
        if (!target) continue
        const pos = m.index
        const prev = src[pos - 1]
        if ((prev && /[\w$]/.test(prev)) || namePositions.has(pos)) continue

        // khối định nghĩa trong cùng đang chứa vị trí này (stack theo thứ tự lồng nhau)
        while (next < defs.length && defs[next].start <= pos) {
          while (stack.length && stack[stack.length - 1].end < defs[next].start) stack.pop()
          stack.push(defs[next++])
        }
        while (stack.length && stack[stack.length - 1].end < pos) stack.pop()

        // hàm: chỉ tính khi được gọi "foo(" ; class: mọi tham chiếu (new X(), X.Static, kiểu dữ liệu X)
        if (target.startsWith('function:')) {
          let j = pos + m[0].length
          while (src[j] === ' ' || src[j] === '\t') j++
          if (src[j] !== '(') continue
        }
        const source = stack.length ? stack[stack.length - 1].id : fileNode(f)
        addEdge(source, target, 'call')
      }
    }

    // HTML / Vue template: sự kiện gọi hàm và class CSS
    if (f.ext === 'html' || f.ext === 'vue') {
      const source = fileNode(f)
      let m
      const reEvt = /(?:\bon\w+|@[\w.:-]+|v-on:[\w.:-]+)\s*=\s*["']\s*([A-Za-z_$][\w$]*)/g
      while ((m = reEvt.exec(src))) {
        const t = resolve(m[1], f.project)
        if (t) addEdge(source, t, 'trigger')
      }
      const reCls = /\bclass\s*=\s*["']([^"']*)["']/g
      while ((m = reCls.exec(src))) {
        for (const c of m[1].split(/\s+/)) {
          const all = cssIndex.get(c)
          if (!all) continue
          const local = all.filter((id) => nodes.get(id).project === f.project) // ưu tiên CSS cùng project
          for (const t of local.length ? local : all) addEdge(source, t, 'style')
        }
      }
    }
    onProgress?.(++step, total)
  }

  return {
    nodes: [...nodes.values()],
    edges: [...edges.values()],
    stats: { files: files.length, nodes: nodes.size, edges: edges.size },
  }
}
