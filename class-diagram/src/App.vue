<template>
  <header style="display: flex;" :style="{ height: MinY + 'px' }">
    <nav class="ap-nav"
      style="flex-grow: 1;display: grid;grid-template-columns: calc(124px - 10px) auto;align-items: center;">
      <h4 style="margin: 0;font-size: 14px;"><span style="color: #4d6bfe;">Class</span>-diagram</h4>
      <h3 style="margin: 0;" contenteditable="true" @keypress="e => preventKeyPress(e, [13])"
        @blur="e => onBlurEdit(e, 'diagram name')">{{ DiagName }}</h3>
    </nav>
    <small style="width: 150px;display: inline-block;">
      Mouse: <small id="dnb-app-log">X: 0, Y: 0</small>
    </small>
  </header>
  <component :is="CompPage"></component>
  <div v-if="EditObject"
    style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #00000063;"></div>
  <form-edit v-if="EditObject" :entry="EditObject.cItem"></form-edit>
</template>

<script>
import { getListCls } from './repository.js'
import { setHeight, initPoint, getStringBetween, verifyExportTxt } from './common.js'
import CryptoJS from 'crypto-js'
import { isAbstract, isInterface, isClass, isEnum, isStruct, filterItems, mapItems } from './Appmixin.js';
import ViewDiagram from './Diagram.vue'
import FormEdit from './Formedit.vue'
export default {
  name: 'DaiNb.vApp',
  components: {
    'form-edit': FormEdit,
    'view-diagram': ViewDiagram,
  },
  data() {
    let MinX = 124
    let MaxX = MinX + 1754
    let MinY = 30
    let MaxY = 880
    let lsCls = getListCls()
    return {
      MinX, MaxX,
      MinY, MaxY,
      DiagName: 'Demo',
      MpClass: new Map(lsCls.map(x => [x.id, x])),
      MpPoints: new Map(),
      DynamicVar: new Map(), // PopMenu, Drop-Search, FViewCode, FrameCode: {top,left,html,type,item}, DragElm (Dùng kéo các khung class),
      NewClassName: null,
      PLang: 1,
      Langs: ['Uml', 'CSharp', 'Java'],
      KeyDraw: '',
      MpDiagram: new Map(), // [Diagram_Name, list_Class]
    }
  },
  computed: {
    OrthogonalConnector() { return function () { function t(t, s) { return { x: t, y: s } } class s { constructor(t, s, e, o) { this.left = t, this.top = s, this.width = e, this.height = o } static get empty() { return new s(0, 0, 0, 0) } static fromRect(t) { return new s(t.left, t.top, t.width, t.height) } static fromLTRB(t, e, o, n) { return new s(t, e, o - t, n - e) } contains(t) { return t.x >= this.left && t.x <= this.right && t.y >= this.top && t.y <= this.bottom } inflate(t, e) { return s.fromLTRB(this.left - t, this.top - e, this.right + t, this.bottom + e) } intersects(t) { let s = this.left, e = this.top, o = this.width, n = this.height, r = t.left, i = t.top, h = t.width, c = t.height; return r < s + o && s < r + h && i < e + n && e < i + c } union(t) { const e = [this.left, this.right, t.left, t.right], o = [this.top, this.bottom, t.top, t.bottom]; return s.fromLTRB(Math.min(...e), Math.min(...o), Math.max(...e), Math.max(...o)) } get center() { return { x: this.left + this.width / 2, y: this.top + this.height / 2 } } get right() { return this.left + this.width } get bottom() { return this.top + this.height } get location() { return t(this.left, this.top) } get northEast() { return { x: this.right, y: this.top } } get southEast() { return { x: this.right, y: this.bottom } } get southWest() { return { x: this.left, y: this.bottom } } get northWest() { return { x: this.left, y: this.top } } get east() { return t(this.right, this.center.y) } get north() { return t(this.center.x, this.top) } get south() { return t(this.center.x, this.bottom) } get west() { return t(this.left, this.center.y) } get size() { return { width: this.width, height: this.height } } } class e { constructor(t) { this.data = t, this.distance = Number.MAX_SAFE_INTEGER, this.shortestPath = [], this.adjacentNodes = new Map } } class o { constructor() { this.index = {} } add(t) { const { x: s, y: o } = t, n = s.toString(), r = o.toString(); n in this.index || (this.index[n] = {}), r in this.index[n] || (this.index[n][r] = new e(t)) } getLowestDistanceNode(t) { let s = null, e = Number.MAX_SAFE_INTEGER; for (const o of t) { const t = o.distance; t < e && (e = t, s = o) } return s } inferPathDirection(t) { return 0 == t.shortestPath.length ? null : this.directionOfNodes(t.shortestPath[t.shortestPath.length - 1], t) } calculateShortestPathFromSource(t, s) { s.distance = 0; const e = new Set, o = new Set; for (o.add(s); 0 != o.size;) { const t = this.getLowestDistanceNode(o); o.delete(t); for (const [s, n] of t.adjacentNodes) e.has(s) || (this.calculateMinimumDistance(s, n, t), o.add(s)); e.add(t) } return t } calculateMinimumDistance(t, s, e) { const o = e.distance, n = this.inferPathDirection(e), r = this.directionOfNodes(e, t), i = n && r && n != r ? Math.pow(s + 1, 2) : 0; if (o + s + i < t.distance) { t.distance = o + s + i; const n = [...e.shortestPath]; n.push(e), t.shortestPath = n } } directionOf(t, s) { return t.x === s.x ? "h" : t.y === s.y ? "v" : null } directionOfNodes(t, s) { return this.directionOf(t.data, s.data) } connect(t, s) { const e = this.get(t), o = this.get(s); if (!e || !o) throw new Error("A point was not found"); e.adjacentNodes.set(o, function (t, s) { return Math.sqrt(Math.pow(s.x - t.x, 2) + Math.pow(s.y - t.y, 2)) }(t, s)) } has(t) { const { x: s, y: e } = t, o = s.toString(), n = e.toString(); return o in this.index && n in this.index[o] } get(t) { const { x: s, y: e } = t, o = s.toString(), n = e.toString(); return o in this.index && n in this.index[o] ? this.index[o][n] : null } } function n(e) { const o = s.fromRect(e.shape); switch (e.side) { case "bottom": return t(o.left + o.width * e.distance, o.bottom); case "top": return t(o.left + o.width * e.distance, o.top); case "left": return t(o.left, o.top + o.height * e.distance); case "right": return t(o.right, o.top + o.height * e.distance) } } function r(s, e) { const { x: o, y: r } = n(s); switch (s.side) { case "top": return t(o, r - e); case "right": return t(o + e, r); case "bottom": return t(o, r + e); case "left": return t(o - e, r) } } function i(t) { return "top" == t || "bottom" == t } function h(s, e) { const o = []; for (const [t, e] of s.data) { const n = 0 == t, r = t == s.rows - 1; for (const [t, i] of e) { const e = 0 == t, h = t == s.columns - 1, c = n && h, a = r && h, u = r && e; e && n || c || a || u ? o.push(i.northWest, i.northEast, i.southWest, i.southEast) : n ? o.push(i.northWest, i.north, i.northEast) : r ? o.push(i.southEast, i.south, i.southWest) : e ? o.push(i.northWest, i.west, i.southWest) : h ? o.push(i.northEast, i.east, i.southEast) : o.push(i.northWest, i.north, i.northEast, i.east, i.southEast, i.south, i.southWest, i.west, i.center) } } return function (s) { const e = [], o = new Map; s.forEach(t => { const { x: s, y: e } = t; let n = o.get(e) || o.set(e, []).get(e); n.indexOf(s) < 0 && n.push(s) }); for (const [s, n] of o) for (const o of n) e.push(t(o, s)); return e }(o).filter(t => !(t => e.filter(s => s.contains(t)).length > 0)(t)) } function c(t, s, e) { const o = t.get(s), n = t.get(e); if (!o) throw new Error(`Origin node {${s.x},${s.y}} not found`); if (!n) throw new Error(`Origin node {${s.x},${s.y}} not found`); return t.calculateShortestPathFromSource(t, o), n.shortestPath.map(t => t.data) } function a(t, s, e) { const o = t.x === s.x && s.x === e.x, n = t.y === s.y && s.y === e.y, r = t.y === s.y, i = t.x === s.x, h = s.y === e.y, c = s.x === e.x; if (o || n) return "none"; if (!i && !r || !c && !h) return "unknown"; if (r && c) return e.y > s.y ? "s" : "n"; if (i && h) return e.x > s.x ? "e" : "w"; throw new Error("Nope") } class u { constructor() { this._rows = 0, this._cols = 0, this.data = new Map } set(t, s, e) { this._rows = Math.max(this.rows, t + 1), this._cols = Math.max(this.columns, s + 1), (this.data.get(t) || this.data.set(t, new Map).get(t)).set(s, e) } get(t, s) { const e = this.data.get(t); return e && e.get(s) || null } rectangles() { const t = []; for (const [s, e] of this.data) for (const [s, o] of e) t.push(o); return t } get columns() { return this._cols } get rows() { return this._rows } } class f { static route(e) { const { pointA: f, pointB: d, globalBoundsMargin: l } = e, g = [], p = [], m = [], x = i(f.side), w = i(d.side), y = n(f), b = n(d), M = s.fromRect(f.shape), E = s.fromRect(d.shape), R = s.fromRect(e.globalBounds); let S = e.shapeMargin, N = M.inflate(S, S), B = E.inflate(S, S); N.intersects(B) && (S = 0, N = M, B = E); const O = N.union(B).inflate(l, l), P = s.fromLTRB(Math.max(O.left, R.left), Math.max(O.top, R.top), Math.min(O.right, R.right), Math.min(O.bottom, R.bottom)); for (const t of [N, B]) p.push(t.left), p.push(t.right), m.push(t.top), m.push(t.bottom); (x ? p : m).push(x ? y.x : y.y), (w ? p : m).push(w ? b.x : b.y); for (const s of [f, d]) { const e = n(s), o = (s, o) => g.push(t(e.x + s, e.y + o)); switch (s.side) { case "top": o(0, -S); break; case "right": o(S, 0); break; case "bottom": o(0, S); break; case "left": o(-S, 0) } } p.sort((t, s) => t - s), m.sort((t, s) => t - s); const L = function (t, e, o) { const n = new u; t.sort((t, s) => t - s), e.sort((t, s) => t - s); let r = o.left, i = o.top, h = 0, c = 0; for (const a of e) { for (const e of t) n.set(c, h++, s.fromLTRB(r, i, e, a)), r = e; n.set(c, h, s.fromLTRB(r, i, o.right, a)), r = o.left, i = a, h = 0, c++ } r = o.left; for (const e of t) n.set(c, h++, s.fromLTRB(r, i, e, o.bottom)), r = e; return n.set(c, h, s.fromLTRB(r, i, o.right, o.bottom)), n }(p, m, P), T = h(L, [N, B]); g.push(...T); const { graph: W, connections: _ } = function (s) { const e = [], n = [], r = new o, i = []; s.forEach(t => { const { x: s, y: o } = t; e.indexOf(s) < 0 && e.push(s), n.indexOf(o) < 0 && n.push(o), r.add(t) }), e.sort((t, s) => t - s), n.sort((t, s) => t - s); const h = t => r.has(t); for (let s = 0; s < n.length; s++)for (let o = 0; o < e.length; o++) { const c = t(e[o], n[s]); if (h(c)) { if (o > 0) { const a = t(e[o - 1], n[s]); h(a) && (r.connect(a, c), r.connect(c, a), i.push({ a: a, b: c })) } if (s > 0) { const a = t(e[o], n[s - 1]); h(a) && (r.connect(a, c), r.connect(c, a), i.push({ a: a, b: c })) } } } return { graph: r, connections: i } }(g), A = r(f, S), D = r(d, S), k = n(f), F = n(d); return this.byproduct.spots = g, this.byproduct.vRulers = p, this.byproduct.hRulers = m, this.byproduct.grid = L.rectangles(), this.byproduct.connections = _, c(W, A, D).length > 0 ? function (t) { if (t.length <= 2) return t; const s = [t[0]]; for (let e = 1; e < t.length; e++) { const o = t[e]; if (e === t.length - 1) { s.push(o); break } "none" !== a(t[e - 1], o, t[e + 1]) && s.push(o) } return s }([k, ...c(W, A, D), F]) : [] } } return f.byproduct = { hRulers: [], vRulers: [], spots: [], grid: [], connections: [] }, f }() },
    CompPage() { return 'view-diagram' },
    ViewCode() {
      const dmVar = this.DynamicVar
      if (!dmVar.has('FViewCode')) return null
      return dmVar.get('FViewCode')
    },
    EditObject() {
      const dmVar = this.DynamicVar
      if (!dmVar.has('FrameCode')) return null
      return dmVar.get('FrameCode')
    },
  },
  methods: {
    buildMapPoints(rItem) {
      const typeDec = rItem.TypeDeclaration
      if (isEnum(typeDec)) return     // verify
      if (isStruct(typeDec)) return     // verify

      const mPoints = this.MpPoints
      const mapCls = this.MpClass

      const mClass = filterItems(mapCls, x => isClass(x.TypeDeclaration), 'map', 'Name')
      const mAbstrac = filterItems(mapCls, x => isAbstract(x.TypeDeclaration), 'map', 'Name')
      const mInterface = filterItems(mapCls, x => isInterface(x.TypeDeclaration), 'map', 'Name')

      let lsImpl = new Set()     // List<item>
      let lsExtn = []     // List<item>
      let lsComp = []     // List<[item, lsTxt]>
      let lsAggr = []     // List<[item, lsTxt]>
      if (isInterface(typeDec)) {
        buildLsImplment()
        setPoints()
        return
      }
      let mapField = new Map()        // [item, fieldName]
      let mStatic = new Map()        // [Name, item]
      for (let ff = rItem.Fields.length - 1, fld, type; -1 < ff; ff--) {
        fld = rItem.Fields[ff]
        type = getFieldType(fld.DataType)
        if (mClass.has(type)) {
          setMpFld(mClass.get(type), fld)
          continue
        }
        if (mAbstrac.has(type)) {
          setMpFld(mAbstrac.get(type), fld)
          continue
        }
        if (mInterface.has(type)) {
          setMpFld(mInterface.get(type), fld)
          continue
        }
      }
      if (isAbstract(typeDec)) {
        buildLsExtend(mAbstrac)
        buildLsImplment()
        pruneMap(mStatic)
        pruneMap(mapField)
        truncMpFld()

        buildLsComposition()
        buildLsAggregation()
        setPoints()
        return
      }
      if (isClass(typeDec)) {
        buildLsExtend(mAbstrac)
        buildLsExtend(mClass)
        buildLsImplment()
        pruneMap(mStatic)
        pruneMap(mapField)
        truncMpFld()

        buildLsComposition()
        buildLsAggregation()
        setPoints()
        return
      }
      function getFieldType(fType) {
        if (fType.includes('<')) { return getStringBetween(fType, '<', '>') }
        return fType
      }
      function setMpFld(item, fld) {
        if (isGlobal(fld.AccessModify)) {
          if (mStatic.has(item)) mStatic.get(item).push(fld.Name)
          else mStatic.set(item, [fld.Name])
          return
        }
        if (mapField.has(item)) {
          mapField.get(item).push(fld.Name)
        } else mapField.set(item, [fld.Name])
      }
      function pruneMap(mapFld) {
        for (const [item, fName] of mapFld) {
          if (lsExtn.find(x => x.id == item.id)) {
            mapFld.delete(item)
            continue
          }
          if (lsImpl.has(item.id)) {
            mapFld.delete(item)
            continue
          }
        }
      }
      function truncMpFld() {
        for (const [item, fName] of mapField) {
          if (mStatic.has(item)) { mapField.delete(item) }
        }
      }
      function isGlobal(vsble) {
        if (vsble.includes('static')) return true
        return false
      }
      function setPoints() {
        if (0 < lsImpl.size + lsExtn.length + lsComp.length + lsAggr.length) {
          const point = initPoint(rItem, [...lsImpl], lsExtn, lsComp, [], lsAggr)
          mPoints.set(rItem.id, point)
        } else if (mPoints.has(rItem.id)) {
          mPoints.delete(rItem.id)
        }
      }
      function buildLsImplment() {
        if (!rItem.toIds.length) return     // verify
        for (const [name, item] of mInterface) {
          if (item.id == rItem.id) continue // it-self
          if (!rItem.toIds.includes(item.id)) continue
          lsImpl.add(item)
        }
      }
      function buildLsExtend(mapCls) {
        if (!rItem.toIds.length) return     // verify
        for (const [name, item] of mapCls) {
          if (item.id == rItem.id) continue // it-self
          if (!rItem.toIds.includes(item.id)) continue
          lsExtn.push(item)
        }
      }
      function buildLsComposition() {
        for (const [item, fNames] of mStatic) {
          if (item.id == rItem.id) continue // it-self
          lsComp.push([item, fNames])
        }
      }
      function buildLsAggregation() {
        for (const [item, fNames] of mapField) {
          if (item.id == rItem.id) continue // it-self
          lsAggr.push([item, fNames])
        }
      }
    },
    buildAssociation() {
      const mPoints = this.MpPoints
      let item, agg
      for (const [id, point] of mPoints) {
        if (point.Aggregations.length < 2) continue;
        let lsAgg = []
        for (let ii = point.Aggregations.length - 1; -1 < ii; ii--) {
          agg = point.Aggregations[ii]
          item = agg[0]
          lsAgg.push(item)    // move ref
        }

        for (let ii = lsAgg.length - 1; 0 < ii; ii--) {
          item = lsAgg[ii]
          let lsAsso = []     // [item]
          for (let jj = ii - 1, oItem; -1 < jj; jj--) {
            oItem = lsAgg[jj]
            lsAsso.push(oItem)
          }
          if (mPoints.has(item.id)) {
            let aPoint = mPoints.get(item.id)
            for (let jj = lsAsso.length - 1, aso; -1 < jj; jj--) {
              aso = lsAsso[jj]
              if (aPoint.Extends.find(x => x.id == aso.id)) {
                lsAsso.splice(jj, 1)
                continue
              }
              if (aPoint.Implements.find(x => x.id == aso.id)) {
                lsAsso.splice(jj, 1)
                continue
              }
              if (aPoint.Compositions.find(x => x[0].id == aso.id)) {
                lsAsso.splice(jj, 1)
                continue
              }
              if (aPoint.Aggregations.find(x => x[0].id == aso.id)) {
                lsAsso.splice(jj, 1)
                continue
              }
            }
            for (let jj = 0; jj < lsAsso.length; jj++) { aPoint.Associations.push(lsAsso[jj]) }
          } else {
            let aPoint = initPoint(item, [], [], [], lsAsso, [])
            mPoints.set(item.id, aPoint)
          }
        }
      }
    },
    disableSrollDown(event) {
      if (event.keyCode === 32) {  // back-space
        event.preventDefault();
        return
      }
    },
    preventKeyPress(e, codes) {
      if (e.which === 13) {
        e.target.blur()
        e.preventDefault()
      }
      if (codes.includes(e.which)) e.preventDefault()
    },
    closePMenu(e) {
      const dmVar = this.DynamicVar
      if (dmVar.has('PopMenu')) {
        document.removeEventListener('click', this.closePMenu)
        const target = e.target
        if (!target.closest('.wrap-mnlist')) {
          let popM = dmVar.get('PopMenu')
          popM.emptySrc()
          dmVar.delete('PopMenu')
        }
      }
    },
    clearDyVar() { this.DynamicVar.clear() },
    closePopupForm() {
      const dmVar = this.DynamicVar
      dmVar.delete('FrameCode')
      dmVar.delete('FViewCode')
    },
    editObject(item) {
      // {id, type, Name, toIds, top, left, width, height, Fields, Properties }
      const dmVar = this.DynamicVar
      dmVar.delete('FViewCode')
      let cItem = JSON.parse(JSON.stringify(item))

      const entry = {
        item,
        cItem,
      }
      dmVar.set('FrameCode', entry)
      this.$nextTick(() => {
        document.body.querySelectorAll(`textarea.objedit-vwcode`).forEach(el => {
          let txt = el.value
          setHeight(el, txt)
        })
      })
    },
    getLsExtends(lsCls, lstItf, iLang) {
      let lst = []
      let arrExt = []
      switch (iLang) {
        case 1:     //  C#
          let extds = []
          if (lsCls.length) {
            extds = lsCls.map(xx => xx.Name)
          }
          if (lstItf.length) {
            lst = lstItf.map(xx => xx.Name)
            extds = extds.concat(lst)
          }
          arrExt.push([':', extds.join(', ')])
          return arrExt
        case 2:     // Java
          if (lsCls.length) {
            lst = lsCls.map(xx => xx.Name)
            arrExt.push([' extends', lst.join(', ')])
          }
          if (lstItf.length) {
            lst = lstItf.map(xx => xx.Name)
            arrExt.push([' implements', lst.join(', ')])
          }
          return arrExt
        default: return arrExt;
      }
    },
    updateMnmxXy() {
      const cvns = document.body.querySelector(`#dnb-mcanvas`)
      if (!cvns) return
      let minX = this.MinX
      let minY = this.MinY
      let minW = window.innerWidth - minX
      let minH = window.innerHeight - minY
      let ofSz = 12
      let mapCls = this.MpClass
      let mxX = Math.max(minW, ...mapItems(mapCls, x => x.left + x.width))

      let mxY = Math.max(minH, ...mapItems(mapCls, x => x.top + x.height))

      this.MaxX = mxX + minX - ofSz
      this.MaxY = mxY + minY - ofSz * 2

    },
    onBlurEdit(e, type) {
      const target = e.target
      let txtC = target.textContent
      txtC = txtC.trim()
      if ('diagram name' == type) {
        if (!txtC.length) {
          target.innerHTML = this.DiagName
          return
        }
        const oName = this.DiagName
        const nName = verifyExportTxt(txtC)
        const mapDiag = this.MpDiagram // Map [Diagram_Name, list_class]
        if (mapDiag.has(oName)) {
          mapDiag.set(nName, mapDiag.get(oName))
          this.MpDiagram = new Map(mapDiag)
        }
        this.DiagName = nName
      }
    },
    bindKeyDraw(mapCls) {
      let key = ''
      for (let [id, c] of mapCls) {
        key += `${c.Name};${c.top};${c.left};${c.width};${c.height};`
        for (let f of c.Fields) {
          key += `${f.Name};${f.DataType};${f.AccessModify};`
        }
        for (let f of c.Properties) {
          key += `${f.Name};${f.DataType};`
          for (let p of f.params) key += `${p[0]};${p[1]};`
        }
      }
      this.KeyDraw = CryptoJS.MD5(key).toString()
    },
  },
  //  beforeCreate() { },
  watch: {
    MpClass(mapCls) {
      this.MpPoints.clear()
      for (let [id, cls] of mapCls) this.buildMapPoints(cls)   // import
      this.buildAssociation()        // import
      this.updateMnmxXy()
      this.bindKeyDraw(mapCls)
    },
  },
  created() {
    const mapCls = this.MpClass
    for (let [id, cls] of mapCls) this.buildMapPoints(cls)      // create-d
    this.buildAssociation()         // create-d
    this.updateMnmxXy()
    this.bindKeyDraw(mapCls)
  },
  //beforeMount() { },
  mounted() {
    document.addEventListener('click', (e) => {
      const dmVar = this.DynamicVar
      if (dmVar.has('Drop-Search')) {
        const target = e.target
        if (!target.closest('h6.wrp-drpsearch')) {
          const fEdit = dmVar.get('Drop-Search')
          fEdit.hideDrpSearch()
        }
      }
      //console.log('click ', e, e.target, dmVar)
    })
  },
  //beforeUpdate() { },
  //updated() { },
};
</script>

<style>
body {
  scrollbar-width: thin;
}

#dnb-vwtab-left {
  display: inline-flex;
  flex-direction: column;
  row-gap: 8px;
}

.ctlmove,
.ctledit {
  width: 22px;
  height: calc(100% - 1px);
  position: absolute;
  top: 1px;
  background-color: white;
  display: none;
}

.vwheader {
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid black;
  padding-left: 24px;
  padding-right: 45px;
  position: relative;
}

.vwheader:hover>.ctlmove,
.vwheader:hover>.ctledit {
  display: inline-block;
}

.cpoint {
  cursor: pointer;
}

.p36 {
  padding: 3px 6px;
}

.p3-0 {
  padding: 3px 0;
}

[contenteditable="true"] {
  border-bottom: 1px solid #ffffff96;
}

[contenteditable="true"]:empty:before {
  content: attr(data-placeholder);
  color: #98989898;
  /* Màu placeholder */
}

.fbody {
  overflow: auto;
  scrollbar-width: thin;
  padding-right: 4px;
  max-height: calc(100vh - 30px - 38px - 36px);
}

.wrap-mnlist {
  position: relative;
  cursor: default;
  height: 20px;
}

.dnb-mnlst {
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  z-index: 1;
  background-color: white;
  top: -6px;
  width: max-content;
  box-shadow: 0 .125rem .25rem #00000030;
  border-radius: 6px;
}

.dnb-mnlst>*:hover {
  background-color: #efefef;
}

.wrp-drpsearch {
  display: inline-block;
  width: 12px;
  height: 24px;
  font-size: 12px;
  font-weight: normal;
  position: relative;
}

.drps-wrap {
  position: absolute;
  z-index: 1;
  top: 24px;
  right: -12px;
  display: flex;
  flex-direction: column;
  min-width: 66px;
  min-height: 66px;
  background-color: white;
  padding: 4px;
  border-radius: 5px;
  width: 174px;
}

.itmdrp {
  padding: 3px;
  cursor: pointer;
  margin-top: 1px;
  display: grid;
  grid-template-columns: auto 16px;
  border-radius: 4px;
}

.extdrp {
  position: absolute;
  top: -9px;
  right: -9px;
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  background-color: #fcfcfc;
  border-radius: 6px;
}

.itmmnls {
  border-bottom: solid 1px #e3e3e3;
  box-sizing: border-box;
  width: 100%;
  min-width: 105px;
}
</style>