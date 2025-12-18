<template>
  <header style="display: flex;" :style="{ height: MinY + 'px' }">
    <nav class="ap-nav"
      style="flex-grow: 1;display: grid;grid-template-columns: calc(124px - 10px) auto;align-items: center;">
      <h4 style="margin: 0;font-size: 14px;"><span style="color: #4d6bfe;">Class</span>-diagram</h4>
      <h3 style="margin: 0;" contenteditable="true" @keypress="e => preventKeyPress(e, [13])"
        @blur="e => onBlurEdit(e, 'diagram name')">{{ DiagName }}</h3>
    </nav>
    <small style="width: 120px;display: inline-block;">
      Mouse: <small id="dnb-app-log"></small>
    </small>
  </header>
  <component :is="CompPage"></component>
  <div v-if="EditObject"
    style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #00000063;"></div>
  <form-edit v-if="EditObject" :entry="EditObject.cItem"></form-edit>
</template>

<script>
import { getListCls } from './repository.js'
import {
  setHeight, initPoint, getStringBetween,
  cellBlock, verifyExportTxt, doInRange, setCell, getArea,
  genBoards, getRows, getCols, cellSize, cellEmpty,
} from './common.js'
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
    const border = 2    // 1px * 2
    let rows = getRows(MaxX - MinX - border)
    let cols = getCols(MaxY - MinY - border)
    let Board = genBoards(rows, cols)
    let lsCls = getListCls()
    return {
      MinX, MaxX,
      MinY, MaxY,
      Board,
      BlokedMap: new Map(),
      DiagName: 'Demo',
      MpClass: new Map(lsCls.map(x => [x.id, x])),
      MpPoints: new Map(),
      DynamicVar: new Map(),
      /* PopMenu, Drop-Search,
      *  FViewCode, FrameCode: {top,left,html,type,item}, 
      *  DragElm (Dùng kéo các khung class),
      * */
      NewClassName: null,
      PLang: 1,
      Langs: ['Uml', 'CSharp', 'Java'],
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
    closeBlock(cls) {
      const grid = this.Board
      let area = getArea(cls)
      const mapBlk = this.BlokedMap
      doInRange(area, (ix, iy) => {
        setCell(grid, ix, iy, cellBlock)
      })
      mapBlk.set(cls.id, area)
    },
    openBlock(item) {
      const grid = this.Board
      let area = getArea(item)
      const mapBlk = this.BlokedMap
      doInRange(area, (ix, iy) => {
        setCell(grid, ix, iy, cellEmpty)
      })
      mapBlk.delete(item.id)
    },
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
        if (!rItem.toIds || !rItem.toIds.length) return     // verify
        for (const [name, item] of mInterface) {
          if (item.id == rItem.id) continue // it-self
          if (!rItem.toIds.includes(item.id)) continue
          lsImpl.add(item)
        }
      }
      function buildLsExtend(mapCls) {
        if (!rItem.toIds || !rItem.toIds.length) return     // verify
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
    drawInCnvs() {
      const c = document.getElementById('dnb-mcanvas');
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);

      const grid = this.Board
      let rows = grid.length      // x
      let cols = grid[0].length   // y
      drawGrid(rows * cellSize, cols * cellSize, cellSize, '#f5f5f5')
      const mapSides = new Map()
      const dicName = new Map(), mapCls = this.MpClass
      for (let [id, cls] of mapCls) { dicName.set(cls.Name, cls) }
      for (let [id, cls] of mapCls) {
        if (!mapSides.has(id)) mapSides.set(id, new Map())
        let clsB
        for (let pId of cls.toIds) {
          clsB = mapCls.get(pId)
          const { sideA, sideB } = this.buildSide(cls, clsB)
          addMapSide(id, sideA, mapSides, clsB.id)
          addMapSide(clsB.id, sideB, mapSides, id)
        }
        for (let f of cls.Fields) {
          if (dicName.has(f.DataType)) {
            clsB = dicName.get(f.DataType)
            const { sideA, sideB } = this.buildSide(cls, clsB)
            addMapSide(id, sideA, mapSides, clsB.id)
            addMapSide(clsB.id, sideB, mapSides, id)
          }
        }
      }
      for (let [id, map] of mapSides) { for (let [side, set] of map) { if (set.size < 2) map.delete(side) } }
      for (let [id, map] of mapSides) { if (map.size < 1) mapSides.delete(id) }
      let mapPoints = new Map()
      for (let [id, map] of mapSides) {
        let dicP = new Map()
        for (let [side, set] of map) {
          let dSep, shapeA = mapCls.get(id)
          if ('top' == side || 'bottom' == side) dSep = Math.round(shapeA.width / (set.size + 1))
          if ('left' == side || 'right' == side) dSep = Math.round(shapeA.height / (set.size + 1))
          let lsPoint = [], pX, pY
          switch (side) {
            case 'top': pY = shapeA.top
              break;
            case 'bottom': pY = shapeA.top + shapeA.height
              break;
            case 'left': pX = shapeA.left
              break;
            case 'right': pX = shapeA.left + shapeA.width
              break;
          }
          if ('top' == side || 'bottom' == side) {
            pX = shapeA.left
            for (let idB of set) {
              pX += dSep
              lsPoint.push([pX, pY])
            }
          }
          if ('left' == side || 'right' == side) {
            pY = shapeA.top
            for (let idB of set) {
              pY += dSep
              lsPoint.push([pX, pY])
            }
          }
          dicP.set(side, lsPoint)
        }
        mapPoints.set(id, dicP)
      }
      console.log('dic sides', mapSides, mapPoints)
      for (let [id, cls] of mapCls) {
        for (let pId of cls.toIds) {
          bindOrthoConnect.call(this, cls, mapCls.get(pId), ctx, [c.width, c.height], 0)
        }
        for (let f of cls.Fields) {
          if (dicName.has(f.DataType)) {
            bindOrthoConnect.call(this, cls, dicName.get(f.DataType), ctx, [c.width, c.height], 4)
          }
        }
      }
      return
      function drawGrid(bw, bh, size, color) {
        ctx.beginPath();
        ctx.setLineDash([]);
        const p = 0
        for (let x = 0; x <= bw; x += size) {
          ctx.moveTo(0.5 + x + p, p);
          ctx.lineTo(0.5 + x + p, bh + p);
        }
        for (let x = 0; x <= bh; x += size) {
          ctx.moveTo(p, 0.5 + x + p);
          ctx.lineTo(bw + p, 0.5 + x + p);
        }
        ctx.strokeStyle = color;
        ctx.stroke();
      }
      function addMapSide(id, side, map, idB) {
        if (!map.has(id)) map.set(id, new Map())
        let dicSide = map.get(id)
        if (dicSide.has(side)) dicSide.get(side).add(idB)
        else dicSide.set(side, new Set([idB]))
      }
      function bindOrthoConnect(shapeA, shapeB, context, [width, height], type = 0) {
        //https://gist.github.com/jose-mdz/4a8894c152383b9d7a870c24a04447e4
        const { sideA, sideB } = this.buildSide(shapeA, shapeB)
        const path = this.buildPath({ shapeA, sideA }, { shapeB, sideB }, { width, height })
        if (!Array.isArray(path) || !path.length) return;

        // #region draw shapes (debug)
        // context.beginPath();
        // context.setLineDash([])
        // context.strokeStyle = "black";
        // for (let shA of [shapeA, shapeB]) { context.strokeRect(shA.left, shA.top, shA.width, shA.height) }
        // let shA = shapeA
        // context.fillStyle = "#DEDEDE";
        // context.fillRect(shA.left, shA.top, shA.width, shA.height);
        // #endregion

        // 1=Association >, 2=Impliments, 3=Extention, 4=Aggregation ◇
        if (!type) {
          type = 3
          if (isInterface(shapeB.TypeDeclaration)) type = 2
        }
        let { x, y } = path.shift()
        if (1 < path.length) {
          if (mapPoints.has(shapeA.id)) {
            let setSides = mapPoints.get(shapeA.id)
            let [x0, y0, x1, y1] = verifyXy.call(this, x, y, setSides, sideA)
            x = x0
            y = y0
            path[0].x -= x1
            path[0].y -= y1
          }
          if (mapPoints.has(shapeB.id)) {
            let p3 = path[path.length - 1]
            if (p3) {
              let setSides = mapPoints.get(shapeB.id)
              let [x0, y0, x1, y1] = verifyXy.call(this, p3.x, p3.y, setSides, sideB)
              p3.x = x0
              p3.y = y0
              p3 = path[path.length - 2]
              if (p3) {
                p3.x -= x1
                p3.y -= y1
              }
            }
          }
        }
        this.drawPath(context, path, x, y, sideB, type)

        function verifyXy(x, y, setSides, sideA) {
          let x1 = 0, y1 = 0
          if (setSides.has(sideA)) {
            let poins = setSides.get(sideA)
            if (poins.length) {
              const cenA = { x: shapeA.left + shapeA.width / 2, y: shapeA.top + shapeA.height / 2 }
              const cenB = { x: shapeB.left + shapeB.width / 2, y: shapeB.top + shapeB.height / 2 }
              let x0, y0
              if ('top' == sideA || 'bottom' == sideA) {
                if (cenA.x <= cenB.x) [x0, y0] = poins.pop()
                else { [x0, y0] = poins.shift() }
                x1 = x - x0
              } else {
                if (cenA.y <= cenB.y) [x0, y0] = poins.pop()
                else { [x0, y0] = poins.shift() }
                y1 = y - y0
              }
              return [x0, y0, x1, y1]
            }
          }
          return [x, y, x1, y1]
        }
      }
    },
    drawPath(ctx, path, bX, bY, sideB, type = 1) {
      let color = 'black'
      ctx.strokeStyle = color;
      ctx.beginPath();
      const arrSize = 8
      if (2 != type) ctx.setLineDash([])
      else ctx.setLineDash([arrSize, arrSize / 2])
      ctx.moveTo(bX, bY);
      if (path.length < 3) {
        path.forEach(({ x, y }) => ctx.lineTo(x, y));
        ctx.stroke();
        drawArrow(path[path.length - 1], sideB, arrSize)
      } else {
        const round = 8
        let p1 = { x: bX, y: bY }
        let p2, p3
        for (let ii = 0; ii < path.length - 1; ii++) {
          if (0 < ii) p1 = path[ii - 1]
          p2 = path[ii]
          p3 = path[ii + 1]
          let cond1 = 2 * round <= Math.abs(p1.y - p2.y) && 2 * round <= Math.abs(p2.x - p3.x)
          let cond2 = 2 * round <= Math.abs(p1.x - p2.x) && 2 * round <= Math.abs(p2.y - p3.y)
          if (cond1 || cond2) {
            cond1 = false
            if (p1.x == p2.x) {
              if (p2.y < p1.y) ctx.lineTo(p2.x, p2.y + round)
              else ctx.lineTo(p2.x, p2.y - round)

              if (p1.x < p3.x) ctx.quadraticCurveTo(p2.x, p2.y, p2.x + round, p3.y)
              else ctx.quadraticCurveTo(p2.x, p2.y, p2.x - round, p3.y)
              cond1 = true
            } else if (p1.y == p2.y) {
              if (p2.x < p1.x) ctx.lineTo(p2.x + round, p2.y)
              else ctx.lineTo(p2.x - round, p2.y)
              if (p1.y < p3.y) ctx.quadraticCurveTo(p2.x, p2.y, p3.x, p2.y + round);
              else ctx.quadraticCurveTo(p2.x, p2.y, p3.x, p2.y - round);
              cond1 = true
            }
          } else cond1 = false
          if (!cond1) {
            ctx.lineTo(p2.x, p2.y)
          }
        }
        drawArrow(p3, sideB, arrSize)
      }
      function drawArrow(pointD, direct = "top", size = 10) {
        const offs = 4 != type ? 1.5 : 0.8
        let points = []
        let xy
        switch (direct) {
          case 'top': xy = pointD.y - size * offs; break;
          case 'bottom': xy = pointD.y + size * offs; break;
          case 'left': xy = pointD.x - size * offs; break;
          case 'right': xy = pointD.x + size * offs; break;
        }
        const isVertical = 'top' == direct || 'bottom' == direct
        switch (type) {
          case 4: // 4 points
            const dtXy = 'top' == direct || 'left' == direct ? -size * offs : size * offs
            if (isVertical) {
              points = [
                [pointD.x, xy + dtXy], [pointD.x - size / 2, xy], [pointD.x, pointD.y], [pointD.x + size / 2, xy]
              ]
            } else {
              points = [
                [xy + dtXy, pointD.y], [xy, pointD.y - size / 2], [pointD.x, pointD.y], [xy, pointD.y + size / 2]
              ]
            }
            break;
          case 2: // 3 points
            if (isVertical) {
              points = [[pointD.x - size / 2, xy], [pointD.x, pointD.y], [pointD.x + size / 2, xy]]
            } else {
              points = [[xy, pointD.y - size / 2], [pointD.x, pointD.y], [xy, pointD.y + size / 2]]
            }
            break;
          default: // 4 points
            if (isVertical) {
              points = [
                [pointD.x, xy], [pointD.x - size / 2, xy], [pointD.x, pointD.y], [pointD.x + size / 2, xy]
              ]
            } else {
              points = [
                [xy, pointD.y], [xy, pointD.y - size / 2], [pointD.x, pointD.y], [xy, pointD.y + size / 2]
              ]
            }
            break;
        }
        let point0 = 2 != type ? points[0] : points[1]
        ctx.lineTo(point0[0], point0[1]);

        ctx.stroke();
        ctx.beginPath();
        ctx.setLineDash([]);
        switch (type) {
          case 3: point0 = points[1]
            let region = new Path2D();
            region.moveTo(point0[0], point0[1])
            linesTo([[points[2][0], points[2][1]], [points[3][0], points[3][1]]], region)
            region.closePath();
            ctx.fillStyle = color;
            ctx.fill(region, "evenodd");
            break;
          case 2: point0 = points[0]
            ctx.moveTo(point0[0], point0[1])
            linesTo([[points[1][0], points[1][1]], [points[2][0], points[2][1]]])
            break;
          default: point0 = points[0]
            ctx.moveTo(point0[0], point0[1])
            let ls = []
            for (let ii = 1; ii < points.length; ii++) { ls.push(points[ii]) }
            ls.push(point0)
            linesTo(ls, ctx)
            break;
        }
        ctx.stroke();
        function linesTo(lines, pxt = ctx) { for (let [x, y] of lines) pxt.lineTo(x, y) }
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
    trackMouse(event) {
      let x = event.clientX;
      let y = event.clientY;
      const dmVar = this.DynamicVar
      if (dmVar.has('DragElm')) {
        const dgElm = dmVar.get('DragElm')
        const dItem = dgElm.Item
        let left = x + dgElm.offX
        let top = y + dgElm.offY
        left = Math.round(left / cellSize)
        left = left * cellSize
        top = Math.round(top / cellSize)
        top = top * cellSize

        if ('cls-classname' == dItem.id) {
          this.setTopLeft(dItem, left, top)
          return
        }

        if (x - 20 < this.MinX) return;
        if (y < this.MinY + 20) return;

        if (dItem.left != left || dItem.top != top) {
          this.setTopLeft(dItem, left, top)
          this.drawInCnvs()       // dragging item
        }
      }
      document.getElementById('dnb-app-log').innerText = `X: ${x}, Y: ${y}`
    },
    setTopLeft(dItem, left, top) {
      dItem.left = left
      dItem.top = top
    },
    disableSrollDown(event) {
      if (event.keyCode === 32) {  // back-space
        event.preventDefault();
        return
      }
    },
    onKeyUp(evt) {
      let wrp = document.body.querySelector(`#dnb-vw-main`)
      if (!wrp) return
      const dmVar = this.DynamicVar
      if (dmVar.has('DragElm')) {
        const dgElm = dmVar.get('DragElm')
        let itemEl = `#cls_${dgElm.Item.id}`
        itemEl = wrp.querySelector(itemEl)
        itemEl.style.zIndex = ''
        itemEl.style.backgroundColor = ''
        const dItem = dgElm.Item

        if ('cls-classname' == dgElm.Item.id) {
          this.editObject(dgElm.Item)
        }
        else if (isOverlap(dItem, this.MpClass)) {
          // revert
          this.setTopLeft(dItem, dgElm.Left, dgElm.Top)
          this.updateSizeCanvas()         // key up => end dnd item => revert
          this.$nextTick(this.drawInCnvs) // key up => end dnd item => revert

        } else {

          this.closeBlock(dItem)      // end dnd -> new pos

          this.updateSizeCanvas()             // key up => end dnd item
          this.drawInCnvs()    // key up => end dnd item

        }
        document.removeEventListener('keydown', this.disableSrollDown)

      }
      dmVar.delete('DragElm')
      function isOverlap(item, items = new Map()) {
        const lstArea = areaBlocks(item.id)
        let x = item.left,
          y = item.top,
          w = item.width,
          h = item.height

        for (let ii = 0; ii < lstArea.length; ii++) {
          const [x0, y0, w0, h0] = lstArea[ii]
          if (x + w < x0 - 30 || x0 + w0 < x - 30) continue
          if (y + h < y0 - 30 || y0 + h0 < y - 30) continue
          return true
        }
        return false
        function areaBlocks(id) {
          const lst = []
          for (let [_id, xx] of items) {
            if (xx.id === id) continue
            let x = xx.left
            let y = xx.top
            let w = xx.width
            let h = xx.height
            lst.push([x, y, w, h])
          }
          return lst
        }
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
    updateSizeCanvas() {
      const cvns = document.body.querySelector(`#dnb-mcanvas`)
      if (!cvns) return
      let wrp = document.body.querySelector(`#dnb-vw-main`)
      let minW = 1080, minH = 300
      if (wrp) {
        minW = wrp.offsetWidth
        minH = wrp.offsetHeight
      }
      let offXy = 180
      let mapCls = this.MpClass
      let mxX = Math.max(...mapItems(mapCls, x => x.left + x.width))
      mxX += offXy
      if (mxX < minW) mxX = minW - 21
      let mxY = Math.max(...mapItems(mapCls, x => x.top + x.height))
      mxY += offXy
      if (mxY < minH) mxY = minH

      this.MaxX = mxX + this.MinX
      this.MaxY = mxY + this.MinY

      cvns.setAttribute('width', mxX)
      cvns.setAttribute('height', mxY)
    },
    onBlurEdit(e, type) {
      const target = e.target
      let txtC = target.textContent
      txtC = txtC.trim()
      switch (type) {
        case 'diagram name':
          if (!txtC.length) {
            target.innerHTML = this.DiagName
            return
          }
          this.DiagName = verifyExportTxt(txtC)
          break;
        default: break;
      }
    },
    buildSide(shapeA, shapeB) {
      const centerA = { x: shapeA.left + shapeA.width / 2, y: shapeA.top + shapeA.height / 2 }
      const centerB = { x: shapeB.left + shapeB.width / 2, y: shapeB.top + shapeB.height / 2 }
      const dx = centerB.x - centerA.x
      const dy = centerB.y - centerA.y
      if (Math.abs(dx) > Math.abs(dy)) {  // horizontal
        if (dx > 0) return { sideA: 'right', sideB: 'left' }
        else return { sideA: 'left', sideB: 'right' }
      } else {    // vertical
        if (dy > 0) return { sideA: 'bottom', sideB: 'top' }
        else return { sideA: 'top', sideB: 'bottom' }
      }
    },
    buildPath({ shapeA, sideA }, { shapeB, sideB }, { width, height }) {
      const pointA = { shape: shapeA, side: sideA, distance: 0.5 }
      const pointB = { shape: shapeB, side: sideB, distance: 0.5 }
      return this.OrthogonalConnector.route({
        pointA,
        pointB,
        shapeMargin: 10,
        globalBoundsMargin: 10,
        globalBounds: { left: 0, top: 0, width, height },
      });
    },
    // equalHas(txt1, txt2) {
    //     let hash1 = CryptoJS.SHA256(txt1), hash2 = CryptoJS.SHA256(txt2)
    //     return hash1.toString(CryptoJS.enc.Hex) == hash2.toString(CryptoJS.enc.Hex)
    // },
  },
  //  beforeCreate() { },
  created() {
    for (let [id, cls] of this.MpClass) {
      this.closeBlock(cls)         // create-d
      this.buildMapPoints(cls)      // create-d
    }
    this.buildAssociation()         // create-d
  },
  //beforeMount() { },
  mounted() {

    document.addEventListener('mousemove', this.trackMouse)
    document.addEventListener("keyup", this.onKeyUp);
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
    });

    this.updateSizeCanvas()         // mount-ed
    this.$nextTick(this.drawInCnvs) // mount-ed
    this.$nextTick(this.drawBlocks) // mount-ed            
  },
  //beforeUpdate() { },
  //updated() { },
};
</script>

<style>
body,
#dnb-viewcode {
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

.wrprect {
  display: inline-block;
  border: 1px solid rgb(0, 0, 0);
  position: inherit;
  cursor: default;
  border-radius: 4px;
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