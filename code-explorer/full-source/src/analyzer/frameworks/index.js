// frameworks/index.js — Lớp nhận diện framework, chạy SAU language adapter trên unit đã parse.
//
// Interface: { id, appliesTo(unit, config) => boolean, run(unit, config) => void }
// run() bổ sung vào unit: symbol 'endpoint', ref 'type-ref'/'cs-type-ref' với edge 'injects',
// ref 'di-register', 'router-include', 'api-call' (Feign client), và vai trò (unit.roles).
//
// Framework front-end (React, Vue, Pinia, Router) được nhận diện ngay trong adapter JS/Vue
// vì chúng là mẫu cú pháp (JSX, defineEmits, defineStore...).

import { addSymbol, addRef, joinUrl, firstStringLiteral, normalizeUrlPattern } from '../utils.js'

// ---------------------------------------------------------------------------
// Spring (Java / Kotlin)
// ---------------------------------------------------------------------------
const SPRING_MAPPING = { GetMapping: 'GET', PostMapping: 'POST', PutMapping: 'PUT', DeleteMapping: 'DELETE', PatchMapping: 'PATCH', RequestMapping: 'REQUEST' }

export const springDetector = {
  id: 'spring',
  appliesTo: (unit) => !!unit.facts.jvm,
  run(unit) {
    for (const cls of unit.facts.jvm.classes) {
      const ann = new Set(cls.annotations.map((a) => a.name))
      const stereotype =
        ann.has('RestController') || ann.has('Controller') ? 'controller'
        : ann.has('Service') ? 'service'
        : ann.has('Repository') ? 'repository'
        : ann.has('Component') ? 'component-bean'
        : ann.has('Configuration') ? 'configuration'
        : ann.has('Entity') || ann.has('Document') || ann.has('Table') ? 'entity'
        : null
      if (stereotype) unit.roles.add(stereotype)
      if (ann.has('SpringBootApplication')) unit.roles.add('entry')
      const sym = unit.symbols.find((s) => s.kind === 'class' && s.name === cls.name)
      if (sym && stereotype) sym.meta.stereotype = stereotype

      // Spring Data: interface UserRepository : JpaRepository<User, Long> -> quản lý entity User
      const repo = /\b\w*Repository\s*<\s*([A-Z]\w*)/.exec(cls.header)
      if (repo) {
        addRef(unit, 'type-ref', { name: repo[1], edge: 'manages' }, cls.line)
        unit.roles.add('repository')
      }

      // Tiêm phụ thuộc: tham số constructor, field @Autowired/@Inject, field final + Lombok
      const injected = new Set(cls.ctorParamTypes)
      for (const m of cls.members) if (['Autowired', 'Inject', 'Resource'].includes(m.name) && m.member?.type) injected.add(m.member.type)
      if (ann.has('RequiredArgsConstructor') || ann.has('AllArgsConstructor')) cls.finalFieldTypes.forEach((t) => injected.add(t))
      for (const t of injected) addRef(unit, 'type-ref', { name: t, edge: 'injects' }, cls.line)

      // Endpoint (hoặc lời gọi API nếu là @FeignClient)
      const isFeign = ann.has('FeignClient')
      if (stereotype !== 'controller' && !isFeign && !ann.has('RequestMapping')) continue
      const classMapping = cls.annotations.find((a) => a.name === 'RequestMapping')
      const feign = cls.annotations.find((a) => a.name === 'FeignClient')
      const prefix = classMapping ? mappingPath(classMapping.args) : feign ? (/\bpath\s*=\s*"([^"]*)"/.exec(feign.args)?.[1] ?? '') : ''
      for (const m of cls.members) {
        const http = SPRING_MAPPING[m.name]
        if (!http) continue
        const method = http === 'REQUEST' ? (/RequestMethod\.(\w+)/.exec(m.args)?.[1] ?? 'ANY') : http
        const path = joinUrl(prefix, mappingPath(m.args))
        if (isFeign) addRef(unit, 'api-call', { method, url: path }, m.line, { confidence: 'inferred' })
        else addSymbol(unit, 'endpoint', `${method} ${normalizeUrlPattern(path)}`, m.line, { method, path, handler: `${cls.name}.${m.member?.name ?? '?'}`, framework: 'spring' })
      }
    }
  },
}

function mappingPath(args = '') {
  const named = /\b(?:value|path)\s*=\s*\{?\s*"([^"]*)"/.exec(args)
  if (named) return named[1]
  const t = args.trim()
  if (t.startsWith('"') || t.startsWith('{')) return firstStringLiteral(t) ?? ''
  return ''
}

// ---------------------------------------------------------------------------
// ASP.NET Core (C#)
// ---------------------------------------------------------------------------
export const aspnetDetector = {
  id: 'aspnet',
  appliesTo: (unit) => !!unit.facts.cs,
  run(unit) {
    const cs = unit.facts.cs
    if (/(^|\/)program\.cs$/i.test(unit.path)) unit.roles.add('entry')

    for (const t of cs.types) {
      for (const p of t.ctorParamTypes) addRef(unit, 'cs-type-ref', { name: p, edge: 'injects' }, t.line)

      const attrs = new Map(t.attributes.map((a) => [a.name, a.args]))
      const isController =
        attrs.has('ApiController') ||
        (/Controller$/.test(t.name) && t.supertypes.some((s) => /^(Controller|ControllerBase)$/.test(s)))
      if (!isController) continue
      unit.roles.add('controller')
      const controllerName = t.name.replace(/Controller$/, '')
      const prefix = firstStringLiteral(attrs.get('Route') ?? '') ?? ''

      for (const m of t.members) {
        let method = null
        let template = null
        for (const a of m.attributes) {
          const hm = /^Http(Get|Post|Put|Delete|Patch)$/.exec(a.name)
          if (hm) {
            method = hm[1].toUpperCase()
            template = firstStringLiteral(a.args) ?? template
          } else if (a.name === 'Route') template = firstStringLiteral(a.args) ?? template
        }
        if (!method && template == null) continue
        method ??= 'ANY'
        let path = template && /^~?\//.test(template) ? template.replace(/^~/, '') : joinUrl(prefix, template ?? '')
        path = path.replace(/\[controller\]/gi, controllerName).replace(/\[action\]/gi, m.method ?? '')
        addSymbol(unit, 'endpoint', `${method} ${normalizeUrlPattern(path)}`, m.line, { method, path, handler: `${t.name}.${m.method ?? '?'}`, framework: 'aspnet' })
      }
    }

    for (const r of cs.diRegistrations) addRef(unit, 'di-register', { iface: r.iface, impl: r.impl }, r.line)
    for (const e of cs.minimalApis) {
      addSymbol(unit, 'endpoint', `${e.method} ${normalizeUrlPattern(e.path)}`, e.line, { method: e.method, path: e.path, handler: 'Minimal API', framework: 'aspnet' })
    }
  },
}

// ---------------------------------------------------------------------------
// Flask / FastAPI / Django (Python)
// ---------------------------------------------------------------------------
export const pythonWebDetector = {
  id: 'python-web',
  appliesTo: (unit) => !!unit.facts.py,
  run(unit) {
    const py = unit.facts.py
    if (Object.values(py.routers).some((r) => r.type === 'app')) unit.roles.add('entry')

    for (const d of py.decorators) {
      const dot = d.target.lastIndexOf('.')
      if (dot < 0) continue
      const obj = d.target.slice(0, dot)
      const attr = d.target.slice(dot + 1)
      const router = py.routers[obj]
      if (!router && !/^(app|bp|blueprint|api|router|\w+_bp|\w+_router|\w+_api)$/.test(obj)) continue

      let methods
      if (attr === 'route' || attr === 'api_route') {
        const ms = /methods\s*=\s*[[(]([^\])]*)[\])]/.exec(d.args)
        methods = ms ? [...ms[1].matchAll(/['"](\w+)['"]/g)].map((x) => x[1].toUpperCase()) : ['GET']
      } else if (['get', 'post', 'put', 'delete', 'patch'].includes(attr)) methods = [attr.toUpperCase()]
      else continue

      const routePath = firstStringLiteral(d.args) ?? ''
      const routerPrefix = router?.prefix ?? ''
      const framework = router?.framework ?? (attr === 'route' ? 'flask' : 'fastapi')
      for (const method of methods) {
        const path = joinUrl(routerPrefix, routePath)
        addSymbol(unit, 'endpoint', `${method} ${normalizeUrlPattern(path)}`, d.line, {
          method, path, routePath, routerPrefix, routerVar: obj, handler: d.func, framework,
        })
      }
      unit.roles.add('controller')
    }

    // Tiền tố gắn khi đăng ký router ở file khác -> xử lý ở lượt 2 (05-pass2-resolve.js)
    for (const inc of py.includes) addRef(unit, 'router-include', { name: inc.name, prefix: inc.prefix }, inc.line)

    for (const p of py.djangoPaths) {
      const path = joinUrl(p.path)
      addSymbol(unit, 'endpoint', `ANY ${normalizeUrlPattern(path)}`, p.line, { method: 'ANY', path, handler: p.handler, framework: 'django' })
      unit.roles.add('controller')
    }
  },
}

export const frameworkDetectors = [springDetector, aspnetDetector, pythonWebDetector]
