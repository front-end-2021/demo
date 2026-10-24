// adapters/python.js — Python (.py). Parser nhẹ dựa trên regex.
//
//   symbol: class, function (cấp cao nhất)
//   ref:    py-import { module, level, names }, py-type-ref { name, edge: 'extends' }
//   facts.py = { imports, decorators: [{ target, args, func, line }],
//                routers: { tênBiến: { type: 'app'|'router', prefix, framework } },
//                includes: [{ name, prefix, line }], djangoPaths: [{ path, handler, line }] }
//
// Phần riêng của Flask / FastAPI / Django nằm ở frameworks/index.js.

import { createUnit, addSymbol, addRef, maskComments, makeLineLookup } from '../utils.js'

export const pythonAdapter = {
  id: 'python',
  extensions: ['.py'],
  analyze(sf, text) {
    const unit = createUnit(sf, 'python', 'python')
    const src = maskComments(text, { style: 'python' }) // che comment & docstring, giữ chuỗi thường
    const lineAt = makeLineLookup(src)

    // --- import ---
    const imports = []
    for (const m of src.matchAll(/^[ \t]*import[ \t]+([^\n]+)/gm)) {
      for (const part of m[1].split(',')) {
        const [mod, alias] = part.trim().split(/\s+as\s+/)
        if (/^[\w.]+$/.test(mod ?? '')) imports.push({ module: mod, level: 0, names: [], alias: alias?.trim() ?? null, line: lineAt(m.index) })
      }
    }
    for (const m of src.matchAll(/^[ \t]*from[ \t]+(\.*)([\w.]*)[ \t]+import[ \t]+(\([^)]*\)|[^\n]+)/gm)) {
      const names = m[3]
        .replace(/[()\\\n]/g, ' ')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const [name, alias] = s.split(/\s+as\s+/)
          return { name: name.trim(), alias: alias?.trim() ?? null }
        })
        .filter((n) => /^[\w*]+$/.test(n.name))
      imports.push({ module: m[2], level: m[1].length, names, alias: null, line: lineAt(m.index) })
    }
    for (const imp of imports) addRef(unit, 'py-import', { module: imp.module, level: imp.level, names: imp.names }, imp.line)

    // --- class / def cấp cao nhất ---
    for (const m of src.matchAll(/^(class|def|async[ \t]+def)[ \t]+(\w+)[ \t]*(?:\(([^)]*)\))?/gm)) {
      const kind = m[1] === 'class' ? 'class' : 'function'
      const line = lineAt(m.index)
      addSymbol(unit, kind, m[2], line)
      if (kind === 'class' && m[3]) {
        for (const b of m[3].split(',')) {
          const base = b.trim().split('[')[0]
          if (/^[A-Za-z_][\w.]*$/.test(base) && base !== 'object' && !b.includes('=')) addRef(unit, 'py-type-ref', { name: base, edge: 'extends' }, line)
        }
      }
    }

    // --- decorator: @app.route("/x", methods=["POST"]), @router.get("/y") ---
    const decorators = []
    for (const m of src.matchAll(/^[ \t]*@([\w.]+)[ \t]*(?:\((.*)\))?[ \t]*$/gm)) {
      const after = src.slice(m.index + m[0].length, m.index + m[0].length + 2000)
      const fn = /^[ \t]*(?:async[ \t]+)?def[ \t]+(\w+)/m.exec(after)
      decorators.push({ target: m[1], args: m[2] ?? '', func: fn?.[1] ?? null, line: lineAt(m.index) })
    }

    // --- biến app/router: app = Flask(__name__), bp = Blueprint(..., url_prefix='/api') ---
    const routers = {}
    for (const m of src.matchAll(/^[ \t]*(\w+)[ \t]*(?::[^=\n]*)?=[ \t]*(?:\w+\.)?(Flask|FastAPI|Blueprint|APIRouter)\(([^\n]*)/gm)) {
      const type = m[2]
      routers[m[1]] = {
        type: type === 'Flask' || type === 'FastAPI' ? 'app' : 'router',
        prefix: /(?:url_prefix|prefix)\s*=\s*['"]([^'"]*)['"]/.exec(m[3])?.[1] ?? '',
        framework: type === 'Flask' || type === 'Blueprint' ? 'flask' : 'fastapi',
      }
    }

    // --- gắn router vào app: register_blueprint / include_router ---
    const includes = []
    for (const m of src.matchAll(/\.(register_blueprint|include_router)\(\s*([\w.]+)([^\n]*)/g)) {
      includes.push({ name: m[2], prefix: /(?:url_prefix|prefix)\s*=\s*['"]([^'"]*)['"]/.exec(m[3])?.[1] ?? '', line: lineAt(m.index) })
    }

    // --- Django urls.py: path('api/x/', views.fn) ---
    const djangoPaths = []
    if (sf.name === 'urls.py') {
      for (const m of src.matchAll(/\b(?:re_)?path\(\s*r?['"]([^'"]*)['"]\s*,\s*([\w.]+)/g)) {
        if (m[2] !== 'include') djangoPaths.push({ path: m[1], handler: m[2], line: lineAt(m.index) })
      }
    }

    unit.facts.py = { imports, decorators, routers, includes, djangoPaths }
    return unit
  },
}
