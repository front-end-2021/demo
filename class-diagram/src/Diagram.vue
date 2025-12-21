<script>
import { objNewCls, cellSize } from "./common.js";
import { isInterface } from './Appmixin.js';
import WrapRect from './Rectwrap.vue';
import MenuList from './Menulist.vue';
function getCenter(shp) { return { x: shp.left + shp.width / 2, y: shp.top + shp.height / 2 } }
function isVertical(sd) { return 'top' == sd || 'bottom' == sd }
function setTopLeft(dItem, left, top) { dItem.left = left; dItem.top = top }
export default {
    name: "View_Diagram",
    display: "View.Diagram",
    components: {
        'rect-wrap': WrapRect,
        'menu-list': MenuList,
    },
    //inject: [''], props: [''],
    data() {
        return {
            CurrentDiag: '--No select--',
        }
    },
    methods: {
        exportDiagram() {
            const root = this.$root
            let lstCls = this.convertClsDiag(root.MpClass)
            let Name = root.DiagName
            let entry = { Name, Classes: lstCls }
            let name = Name.replaceAll(' ', '-')
            let target = document.getElementById('dnb-vw-main')
            html2canvas(target).then(canvas => {
                const zip = new JSZip();
                canvas.toBlob(function (data) {
                    zip.file(`${name}.txt`, JSON.stringify(entry));
                    zip.file(`${name}.jpg`, data);
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, `${name}.zip`);
                    })
                })
            })
        },
        convertClsDiag(dataSet, type = 'map-array') {
            let dtOut = []
            if ('map-array' == type) {
                for (let [id, cls] of dataSet) {
                    dtOut.push([
                        id, cls.Name, cls.TypeDeclaration, cls.AccessModify,
                        cls.Fields.map(f => [f.Name, f.DataType, f.AccessModify]),
                        cls.Properties.map(p => [
                            p.Name, p.params, p.DataType, p.FuncBody, p.specialMe, p.AccessModify
                        ]), cls.top, cls.left, cls.width, cls.height, cls.toIds
                    ])
                }
                return dtOut
            }
            if ('array-map' == type) {
                dtOut = new Map()
                for (let cls of dataSet) {
                    let [id, Name, TypeDeclaration, AccessModify, fields,
                        props, top, left, width, height, toIds] = cls
                    let Fields = fields.map(f => {
                        return { Name: f[0], DataType: f[1], AccessModify: f[2] }
                    })
                    let Properties = props.map(p => {
                        return {
                            Name: p[0], params: p[1], DataType: p[2],
                            FuncBody: p[3], specialMe: p[4], AccessModify: p[5]
                        }
                    })
                    dtOut.set(id, {
                        id, Name, TypeDeclaration, AccessModify, Fields,
                        Properties, top, left, width, height, toIds
                    })
                }
                return dtOut
            }
        },
        importDiagram(event) {
            const file = event.target.files[0];
            const root = this.$root
            root.clearDyVar()
            // Validate file existence and type
            if (!file) {
                showMessage("No file selected. Please choose a file.", "error");
                return;
            }
            if (!file.type.startsWith("text")) {
                showMessage("Unsupported file type. Please select a text file.", "error");
                return;
            }
            // Read the file
            const reader = new FileReader();
            reader.onload = () => {
                const txt = reader.result;
                let entry = JSON.parse(txt)
                root.DiagName = entry.Name
                const mapCls = this.convertClsDiag(entry.Classes, 'array-map')
                root.MpClass = mapCls
                event.target.value = ''
            };
            reader.onerror = () => {
                showMessage("Error reading the file. Please try again.", "error");
            };
            reader.readAsText(file);
            function showMessage(txt) { alert(txt) }
        },
        msDwnNewCls(event) {
            const root = this.$root
            const dmVar = root.DynamicVar
            if (dmVar.has('DragElm')) return;
            if (dmVar.has('FrameCode')) return;
            dmVar.delete('FViewCode')
            let wrp = document.body.querySelector(`#dnb-vw-main`)
            if (!wrp) return
            document.addEventListener('keydown', root.disableSrollDown)
            const id = 'cls-classname'
            const tpNwItem = objNewCls(null, id, 10, 10)
            root.NewClassName = tpNwItem

            root.DynamicVar.set('DragElm', { Item: tpNwItem, offX: 0, offY: 0 })
            this.$nextTick(() => {
                const itemEl = wrp.querySelector(`#cls_${id}`)
                itemEl.style.zIndex = '1'
                itemEl.style.backgroundColor = 'white'
            })
        },
        changeLanguage(val) {
            const root = this.$root
            root.closePopupForm()
            const langs = root.Langs
            for (let ii = 0; ii < langs.length; ii++) {
                if (langs[ii] == val) {
                    root.PLang = ii
                    break;
                }
            }
        },
        saveDiagram() { this.setDiagToMap(true) },
        setDiagToMap(isSelect = false) {
            const root = this.$root
            let nameDiag = root.DiagName
            if ('New Diagram' == nameDiag) return
            const mapDiag = root.MpDiagram // Map [Diagram_Name, list_class]
            const mapCls = this.convertClsDiag(root.MpClass)
            mapDiag.set(nameDiag, mapCls)
            root.MpDiagram = new Map(mapDiag)
            if (isSelect) this.CurrentDiag = nameDiag
        },
        newDiagram() {
            this.setDiagToMap(false)
            const root = this.$root
            root.MpClass = new Map()
            root.MpPoints.clear()
            root.DiagName = 'New Diagram'
            root.clearDyVar()
            this.CurrentDiag = '--No select--'
        },
        drawInCnvs() {
            const c = document.getElementById('dnb-mcanvas');
            const ctx = c.getContext("2d");
            ctx.clearRect(0, 0, c.width, c.height);
            const root = this.$root
            drawGrid(c.width, c.height, cellSize, '#f5f5f5')
            const mapSides = new Map()
            const dicName = new Map()
            const mapCls = root.MpClass
            const drewPaths = []  // array of paths
            for (let [id, cls] of mapCls) { dicName.set(cls.Name, cls) }
            for (let [id, cls] of mapCls) {
                if (!mapSides.has(id)) mapSides.set(id, new Map())
                let clsB
                for (let pId of cls.toIds) {
                    clsB = mapCls.get(pId)
                    const { sideA, sideB } = buildSide.call(this, cls, clsB)
                    addMapSide(id, sideA, mapSides, clsB.id)
                    addMapSide(clsB.id, sideB, mapSides, id)
                }
                for (let f of cls.Fields) {
                    if (dicName.has(f.DataType)) {
                        clsB = dicName.get(f.DataType)
                        const { sideA, sideB } = buildSide.call(this, cls, clsB)
                        addMapSide(id, sideA, mapSides, clsB.id)
                        addMapSide(clsB.id, sideB, mapSides, id)
                    }
                }
            }
            function addMapSide(id, side, map, idB) {
                if (!map.has(id)) map.set(id, new Map())
                let dicSide = map.get(id)
                if (dicSide.has(side)) dicSide.get(side).push(idB)
                else dicSide.set(side, [idB])
            }
            for (let [id, map] of mapSides) { for (let [side, arrId] of map) { if (arrId.length < 2) map.delete(side) } }
            for (let [id, map] of mapSides) { if (map.size < 1) mapSides.delete(id) }
            let mapOrder = new Map()
            for (let [id, map] of mapSides) {
                let mSide = new Map()
                for (let [side, arrId] of map) {
                    let lsRec = []
                    for (let idB of arrId) lsRec.push(mapCls.get(idB))
                    lsRec = lsRec.map(x => [x.id, getCenter(x)])
                    if (isVertical(side)) lsRec.sort((a, b) => a[1].x - b[1].x)
                    else lsRec.sort((a, b) => a[1].y - b[1].y)
                    mSide.set(side, lsRec)
                }
                mapOrder.set(id, mSide)
            }
            for (let [id, map] of mapSides) {
                for (let [side, arrId] of map) {
                    let dSep, shapeA = mapCls.get(id)
                    if (isVertical(side)) dSep = Math.round(shapeA.width / (arrId.length + 1))
                    else dSep = Math.round(shapeA.height / (arrId.length + 1))
                    let pX, pY, lsPoint = []
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
                    if (isVertical(side)) {
                        pX = shapeA.left
                        for (let idB of arrId) {
                            pX += dSep
                            lsPoint.push([pX, pY])
                        }
                    } else {
                        pY = shapeA.top
                        for (let idB of arrId) {
                            pY += dSep
                            lsPoint.push([pX, pY])
                        }
                    }
                    let mSideO = mapOrder.get(id)
                    let arrO = mSideO.get(side) // [[id, {x, y}]]
                    for (let ii = 0; ii < lsPoint.length; ii++) {
                        arrO[ii][1].pX = lsPoint[ii][0]
                        arrO[ii][1].pY = lsPoint[ii][1]
                    }
                    mSideO.set(side, arrO.map(x => { return { id: x[0], pX: x[1].pX, pY: x[1].pY } }))
                }
            }
            //console.log('dic sides', mapSides, mapOrder)
            const arrPaths = []
            for (let [id, cls] of mapCls) {
                for (let pId of cls.toIds) {
                    buildOrthoPaths.call(this, cls, mapCls.get(pId), c.width, c.height, 0)
                }
                for (let f of cls.Fields) {
                    if (dicName.has(f.DataType)) {
                        buildOrthoPaths.call(this, cls, dicName.get(f.DataType), c.width, c.height, 4)
                    }
                }
            }
            function buildOrthoPaths(shapeA, shapeB, width, height, type = 0) {
                //https://gist.github.com/jose-mdz/4a8894c152383b9d7a870c24a04447e4
                const { sideA, sideB } = buildSide.call(this, shapeA, shapeB)
                const pointA = { shape: shapeA, side: sideA, distance: 0.5 }
                const pointB = { shape: shapeB, side: sideB, distance: 0.5 }
                const paths = this.OrthogonalConnector.route({
                    pointA,
                    pointB,
                    shapeMargin: cellSize,
                    globalBoundsMargin: cellSize,
                    globalBounds: { left: 0, top: 0, width, height },
                });
                if (!Array.isArray(paths) || paths.length < 2) return;
                let path0 = paths[0]
                if (mapOrder.has(shapeA.id)) {
                    let setSides = mapOrder.get(shapeA.id)
                    let [x0, y0, x1, y1] = verifyXy.call(this, path0.x, path0.y, setSides, sideA, shapeB.id)
                    path0.x = x0
                    path0.y = y0
                    paths[1].x -= x1
                    paths[1].y -= y1
                }
                if (mapOrder.has(shapeB.id)) {
                    let p3 = paths[paths.length - 1]
                    let setSides = mapOrder.get(shapeB.id)
                    let [x0, y0, x1, y1] = verifyXy.call(this, p3.x, p3.y, setSides, sideB, shapeA.id)
                    p3.x = x0
                    p3.y = y0
                    p3 = paths[paths.length - 2]
                    if (p3) {
                        p3.x -= x1
                        p3.y -= y1
                    }
                }
                arrPaths.push([shapeA, shapeB, paths, type, sideB])
                function verifyXy(x, y, setSides, sideA, idB) {
                    let x1 = 0, y1 = 0
                    if (setSides.has(sideA)) {
                        let arrPt = setSides.get(sideA) // [{id, pX, pY}]
                        if (0 < arrPt.length) {
                            let iiB = arrPt.findIndex(x => idB == x.id)
                            if (-1 < iiB) {
                                let ptXy = arrPt.splice(iiB, 1)[0]
                                let x0 = ptXy.pX
                                let y0 = ptXy.pY
                                if (isVertical(sideA)) { x1 = x - x0 }
                                else { y1 = y - y0 }
                                return [x0, y0, x1, y1]
                            }
                        }
                    }
                    return [x, y, x1, y1]
                }
            }
            for (let [shapeA, shapeB, paths, type, sideB] of arrPaths) {
                bindConnect.call(this, shapeA, shapeB, ctx, paths, sideB, type)
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
            function bindConnect(shapeA, shapeB, context, path, sideB, type = 0) {
                const round = 8
                // #region draw shapes (debug)
                // context.beginPath();
                // context.setLineDash([])
                // context.strokeStyle = "black";
                // for (let shA of [shapeA, shapeB]) { context.strokeRect(shA.left, shA.top, shA.width, shA.height) }
                // let shA = shapeA
                // context.fillStyle = "#DEDEDE";
                // context.fillRect(shA.left, shA.top, shA.width, shA.height);
                // #endregion

                // 1=Association, 2=Impliments >, 3=Extention, 4=Aggregation ◇
                if (!type) {
                    type = 3
                    if (isInterface(shapeB.TypeDeclaration)) type = 2
                }
                let { x, y } = path.shift()
                if (2 < path.length) {
                    let p3 = path[path.length - 1]
                    let minx = Math.min(x, p3.x)
                    let maxx = Math.max(x, p3.x)
                    let miny = Math.min(y, p3.y)
                    let maxy = Math.max(y, p3.y)
                    const obstacles = getObstacles({ x, y }, p3)
                    if (0 < obstacles.length) {
                        for (let ii = 1, pth1, pth2, ob1; ii < path.length - 1; ii++) {
                            pth1 = path[ii - 1]
                            pth2 = path[ii]
                            if (isVcx(pth1, pth2)) {  // vertical
                                ob1 = obsV(pth1, obstacles)
                                if (ob1) {
                                    let xx = ob1.x0 - cellSize
                                    if (isInMinMax(xx, minx, maxx)) { pth1.x = xx; pth2.x = xx }
                                }
                            } else {    // horizontal
                                ob1 = obsH(pth1, obstacles)
                                if (ob1) {
                                    let yy = ob1.y0 - cellSize
                                    if (isInMinMax(yy, miny, maxy)) { pth1.y = yy; pth2.y = yy }
                                }
                            }
                        }
                        function obsH(_p, ls) { return ls.find(o => o.y0 <= _p.y && _p.y <= o.y1) }
                        function obsV(_p, ls) { return ls.find(o => o.x0 <= _p.x && _p.x <= o.x1) }
                    } else if (0 < drewPaths.length) {
                        for (let ii = 1, pth1, pth2; ii < path.length - 1; ii++) {
                            pth1 = path[ii - 1]
                            pth2 = path[ii]
                            if (isVcx(pth1, pth2)) {  // vertical
                                let mxx = pth1.x
                                let pV = findV(mxx, drewPaths)
                                while (pV) {
                                    mxx -= cellSize
                                    if (!isInMinMax(mxx, minx, maxx)) { mxx += cellSize; break }
                                    pV = findV(mxx, drewPaths)
                                }
                                pth1.x = mxx
                                pth2.x = mxx
                            } else {    // horizontal
                                let mmy = pth1.y
                                let pH = findH(mmy, drewPaths)
                                while (pH) {
                                    mmy -= cellSize
                                    if (!isInMinMax(mmy, miny, maxy)) { mmy += cellSize; break }
                                    pH = findH(mmy, drewPaths)
                                }
                                pth1.y = mmy
                                pth2.y = mmy
                            }
                        }
                        function findV(x, ls) {
                            for (let arr of ls) {
                                for (let iiv = 1, p1, p2; iiv < arr.length; iiv++) {
                                    p1 = arr[iiv - 1]
                                    p2 = arr[iiv]
                                    if (isVcx(p1, p2) && Math.abs(p1.x - x) < 6) return [p1, p2]
                                }
                            }
                        }
                        function findH(y, ls) {
                            for (let arr of ls) {
                                for (let iiv = 1, p1, p2; iiv < arr.length; iiv++) {
                                    p1 = arr[iiv - 1]
                                    p2 = arr[iiv]
                                    if (!isVcx(p1, p2) && Math.abs(p1.y - y) < 6) return [p1, p2]
                                }
                            }
                        }
                    }
                    function isVcx(p1, p2) { return p1.x == p2.x }
                    function isInMinMax(p, min, max) { if (min <= p && p <= max) return true }
                }
                if (1 < path.length) { drewPaths.push(path) }

                drawPath.call(this, context, path, x, y, sideB, type)


                function drawPath(ctx, path, bX, bY, sideB, type = 1) {
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
                    function drawArrow(pointD, direct = "top", size = 8) {
                        const offs = 4 != type ? 1.5 : 0.8
                        let points = []
                        let xy
                        switch (direct) {
                            case 'top': xy = pointD.y - size * offs; break;
                            case 'bottom': xy = pointD.y + size * offs; break;
                            case 'left': xy = pointD.x - size * offs; break;
                            case 'right': xy = pointD.x + size * offs; break;
                        }
                        switch (type) {
                            case 4: // 4 points
                                const dtXy = 'top' == direct || 'left' == direct ? -size * offs : size * offs
                                if (isVertical(direct)) {
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
                                if (isVertical(direct)) {
                                    points = [[pointD.x - size / 2, xy], [pointD.x, pointD.y], [pointD.x + size / 2, xy]]
                                } else {
                                    points = [[xy, pointD.y - size / 2], [pointD.x, pointD.y], [xy, pointD.y + size / 2]]
                                }
                                break;
                            default: // 4 points
                                if (isVertical(direct)) {
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
                }
                function getObstacles(path0, path1) {
                    let minx = Math.min(path0.x, path1.x)
                    let maxx = Math.max(path0.x, path1.x)
                    let miny = Math.min(path0.y, path1.y)
                    let maxy = Math.max(path0.y, path1.y)
                    let lsObs = []
                    for (let [id, cls] of mapCls) {
                        if (id == shapeA.id) continue
                        if (id == shapeB.id) continue
                        let x0 = cls.left
                        if (maxx <= x0) continue;
                        let x1 = x0 + cls.width
                        if (x1 <= minx) continue
                        let y0 = cls.top
                        if (maxy <= y0) continue;
                        let y1 = y0 + cls.height
                        if (y1 <= miny) continue;
                        if (x0 < minx) x0 = minx
                        if (maxx < x1) x1 = maxx
                        if (y0 < miny) y0 = miny
                        if (maxy < y1) y1 = maxy
                        lsObs.push({ x0, x1, y0, y1 })
                    }
                    return lsObs
                }
            }
            function buildSide(shapeA, shapeB) {
                const centerA = getCenter(shapeA)
                const centerB = getCenter(shapeB)
                const dx = centerB.x - centerA.x
                const dy = centerB.y - centerA.y
                if (Math.abs(dx) > Math.abs(dy)) {  // horizontal
                    if (dx > 0) return { sideA: 'right', sideB: 'left' }
                    else return { sideA: 'left', sideB: 'right' }
                } else {    // vertical
                    if (dy > 0) return { sideA: 'bottom', sideB: 'top' }
                    else return { sideA: 'top', sideB: 'bottom' }
                }
            }

        },
        trackMouse(event) {
            const x = event.clientX;
            const y = event.clientY;
            document.getElementById('dnb-app-log').innerText = `X: ${x}, Y: ${y}`
            const root = this.$root
            const dmVar = root.DynamicVar
            if (dmVar.has('DragElm')) {

                const dgElm = dmVar.get('DragElm')
                const dItem = dgElm.Item
                const minX = root.MinX
                const minY = root.MinY
                const maxX = window.innerWidth - minX - 15
                const maxY = window.innerHeight - minY - 24

                let left = x + dgElm.offX
                let top = y + dgElm.offY

                if ('cls-classname' == dItem.id) {
                    const w2 = dItem.width / 2
                    const h2 = dItem.height / 2
                    left = x - w2
                    top = y - h2

                    if (x < minX) left = 0
                    else if (maxX < x + w2) left = dItem.left
                    if (y < minY) top = 0
                    else if (maxY < y + h2) top = dItem.top

                    setTopLeft(dItem, left, top)
                    return
                }

                if (x < minX || y < minY) return;

                if (dItem.left != left || dItem.top != top) {
                    setTopLeft(dItem, left, top)
                }
            }
        },
        onKeyUp(evt) {
            let wrp = document.body.querySelector(`#dnb-vw-main`)
            if (!wrp) return
            const root = this.$root
            const dmVar = root.DynamicVar
            if (dmVar.has('DragElm')) {
                const dgElm = dmVar.get('DragElm')
                const dItem = dgElm.Item
                let itemEl = `#cls_${dItem.id}`
                itemEl = wrp.querySelector(itemEl)
                itemEl.style.zIndex = ''
                itemEl.style.backgroundColor = ''

                if ('cls-classname' == dItem.id) { // new class
                    root.editObject(dgElm.Item)
                }
                root.updateMnmxXy()  // key up => end dnd item
                this.drawInCnvs()    // key up => end dnd item
                document.removeEventListener('keydown', root.disableSrollDown)

            }
            dmVar.delete('DragElm')
        },
        selectDiagram(name) {
            const root = this.$root
            const mapDiag = root.MpDiagram // Map [Diagram_Name, list_class]
            if (mapDiag.has(name)) {
                root.MpClass = this.convertClsDiag(mapDiag.get(name), 'array-map')
                root.DiagName = name
            }
            this.CurrentDiag = name
        },
    },
    computed: {
        OrthogonalConnector() { return function () { function t(t, s) { return { x: t, y: s } } class s { constructor(t, s, e, o) { this.left = t, this.top = s, this.width = e, this.height = o } static get empty() { return new s(0, 0, 0, 0) } static fromRect(t) { return new s(t.left, t.top, t.width, t.height) } static fromLTRB(t, e, o, n) { return new s(t, e, o - t, n - e) } contains(t) { return t.x >= this.left && t.x <= this.right && t.y >= this.top && t.y <= this.bottom } inflate(t, e) { return s.fromLTRB(this.left - t, this.top - e, this.right + t, this.bottom + e) } intersects(t) { let s = this.left, e = this.top, o = this.width, n = this.height, r = t.left, i = t.top, h = t.width, c = t.height; return r < s + o && s < r + h && i < e + n && e < i + c } union(t) { const e = [this.left, this.right, t.left, t.right], o = [this.top, this.bottom, t.top, t.bottom]; return s.fromLTRB(Math.min(...e), Math.min(...o), Math.max(...e), Math.max(...o)) } get center() { return { x: this.left + this.width / 2, y: this.top + this.height / 2 } } get right() { return this.left + this.width } get bottom() { return this.top + this.height } get location() { return t(this.left, this.top) } get northEast() { return { x: this.right, y: this.top } } get southEast() { return { x: this.right, y: this.bottom } } get southWest() { return { x: this.left, y: this.bottom } } get northWest() { return { x: this.left, y: this.top } } get east() { return t(this.right, this.center.y) } get north() { return t(this.center.x, this.top) } get south() { return t(this.center.x, this.bottom) } get west() { return t(this.left, this.center.y) } get size() { return { width: this.width, height: this.height } } } class e { constructor(t) { this.data = t, this.distance = Number.MAX_SAFE_INTEGER, this.shortestPath = [], this.adjacentNodes = new Map } } class o { constructor() { this.index = {} } add(t) { const { x: s, y: o } = t, n = s.toString(), r = o.toString(); n in this.index || (this.index[n] = {}), r in this.index[n] || (this.index[n][r] = new e(t)) } getLowestDistanceNode(t) { let s = null, e = Number.MAX_SAFE_INTEGER; for (const o of t) { const t = o.distance; t < e && (e = t, s = o) } return s } inferPathDirection(t) { return 0 == t.shortestPath.length ? null : this.directionOfNodes(t.shortestPath[t.shortestPath.length - 1], t) } calculateShortestPathFromSource(t, s) { s.distance = 0; const e = new Set, o = new Set; for (o.add(s); 0 != o.size;) { const t = this.getLowestDistanceNode(o); o.delete(t); for (const [s, n] of t.adjacentNodes) e.has(s) || (this.calculateMinimumDistance(s, n, t), o.add(s)); e.add(t) } return t } calculateMinimumDistance(t, s, e) { const o = e.distance, n = this.inferPathDirection(e), r = this.directionOfNodes(e, t), i = n && r && n != r ? Math.pow(s + 1, 2) : 0; if (o + s + i < t.distance) { t.distance = o + s + i; const n = [...e.shortestPath]; n.push(e), t.shortestPath = n } } directionOf(t, s) { return t.x === s.x ? "h" : t.y === s.y ? "v" : null } directionOfNodes(t, s) { return this.directionOf(t.data, s.data) } connect(t, s) { const e = this.get(t), o = this.get(s); if (!e || !o) throw new Error("A point was not found"); e.adjacentNodes.set(o, function (t, s) { return Math.sqrt(Math.pow(s.x - t.x, 2) + Math.pow(s.y - t.y, 2)) }(t, s)) } has(t) { const { x: s, y: e } = t, o = s.toString(), n = e.toString(); return o in this.index && n in this.index[o] } get(t) { const { x: s, y: e } = t, o = s.toString(), n = e.toString(); return o in this.index && n in this.index[o] ? this.index[o][n] : null } } function n(e) { const o = s.fromRect(e.shape); switch (e.side) { case "bottom": return t(o.left + o.width * e.distance, o.bottom); case "top": return t(o.left + o.width * e.distance, o.top); case "left": return t(o.left, o.top + o.height * e.distance); case "right": return t(o.right, o.top + o.height * e.distance) } } function r(s, e) { const { x: o, y: r } = n(s); switch (s.side) { case "top": return t(o, r - e); case "right": return t(o + e, r); case "bottom": return t(o, r + e); case "left": return t(o - e, r) } } function i(t) { return "top" == t || "bottom" == t } function h(s, e) { const o = []; for (const [t, e] of s.data) { const n = 0 == t, r = t == s.rows - 1; for (const [t, i] of e) { const e = 0 == t, h = t == s.columns - 1, c = n && h, a = r && h, u = r && e; e && n || c || a || u ? o.push(i.northWest, i.northEast, i.southWest, i.southEast) : n ? o.push(i.northWest, i.north, i.northEast) : r ? o.push(i.southEast, i.south, i.southWest) : e ? o.push(i.northWest, i.west, i.southWest) : h ? o.push(i.northEast, i.east, i.southEast) : o.push(i.northWest, i.north, i.northEast, i.east, i.southEast, i.south, i.southWest, i.west, i.center) } } return function (s) { const e = [], o = new Map; s.forEach(t => { const { x: s, y: e } = t; let n = o.get(e) || o.set(e, []).get(e); n.indexOf(s) < 0 && n.push(s) }); for (const [s, n] of o) for (const o of n) e.push(t(o, s)); return e }(o).filter(t => !(t => e.filter(s => s.contains(t)).length > 0)(t)) } function c(t, s, e) { const o = t.get(s), n = t.get(e); if (!o) throw new Error(`Origin node {${s.x},${s.y}} not found`); if (!n) throw new Error(`Origin node {${s.x},${s.y}} not found`); return t.calculateShortestPathFromSource(t, o), n.shortestPath.map(t => t.data) } function a(t, s, e) { const o = t.x === s.x && s.x === e.x, n = t.y === s.y && s.y === e.y, r = t.y === s.y, i = t.x === s.x, h = s.y === e.y, c = s.x === e.x; if (o || n) return "none"; if (!i && !r || !c && !h) return "unknown"; if (r && c) return e.y > s.y ? "s" : "n"; if (i && h) return e.x > s.x ? "e" : "w"; throw new Error("Nope") } class u { constructor() { this._rows = 0, this._cols = 0, this.data = new Map } set(t, s, e) { this._rows = Math.max(this.rows, t + 1), this._cols = Math.max(this.columns, s + 1), (this.data.get(t) || this.data.set(t, new Map).get(t)).set(s, e) } get(t, s) { const e = this.data.get(t); return e && e.get(s) || null } rectangles() { const t = []; for (const [s, e] of this.data) for (const [s, o] of e) t.push(o); return t } get columns() { return this._cols } get rows() { return this._rows } } class f { static route(e) { const { pointA: f, pointB: d, globalBoundsMargin: l } = e, g = [], p = [], m = [], x = i(f.side), w = i(d.side), y = n(f), b = n(d), M = s.fromRect(f.shape), E = s.fromRect(d.shape), R = s.fromRect(e.globalBounds); let S = e.shapeMargin, N = M.inflate(S, S), B = E.inflate(S, S); N.intersects(B) && (S = 0, N = M, B = E); const O = N.union(B).inflate(l, l), P = s.fromLTRB(Math.max(O.left, R.left), Math.max(O.top, R.top), Math.min(O.right, R.right), Math.min(O.bottom, R.bottom)); for (const t of [N, B]) p.push(t.left), p.push(t.right), m.push(t.top), m.push(t.bottom); (x ? p : m).push(x ? y.x : y.y), (w ? p : m).push(w ? b.x : b.y); for (const s of [f, d]) { const e = n(s), o = (s, o) => g.push(t(e.x + s, e.y + o)); switch (s.side) { case "top": o(0, -S); break; case "right": o(S, 0); break; case "bottom": o(0, S); break; case "left": o(-S, 0) } } p.sort((t, s) => t - s), m.sort((t, s) => t - s); const L = function (t, e, o) { const n = new u; t.sort((t, s) => t - s), e.sort((t, s) => t - s); let r = o.left, i = o.top, h = 0, c = 0; for (const a of e) { for (const e of t) n.set(c, h++, s.fromLTRB(r, i, e, a)), r = e; n.set(c, h, s.fromLTRB(r, i, o.right, a)), r = o.left, i = a, h = 0, c++ } r = o.left; for (const e of t) n.set(c, h++, s.fromLTRB(r, i, e, o.bottom)), r = e; return n.set(c, h, s.fromLTRB(r, i, o.right, o.bottom)), n }(p, m, P), T = h(L, [N, B]); g.push(...T); const { graph: W, connections: _ } = function (s) { const e = [], n = [], r = new o, i = []; s.forEach(t => { const { x: s, y: o } = t; e.indexOf(s) < 0 && e.push(s), n.indexOf(o) < 0 && n.push(o), r.add(t) }), e.sort((t, s) => t - s), n.sort((t, s) => t - s); const h = t => r.has(t); for (let s = 0; s < n.length; s++)for (let o = 0; o < e.length; o++) { const c = t(e[o], n[s]); if (h(c)) { if (o > 0) { const a = t(e[o - 1], n[s]); h(a) && (r.connect(a, c), r.connect(c, a), i.push({ a: a, b: c })) } if (s > 0) { const a = t(e[o], n[s - 1]); h(a) && (r.connect(a, c), r.connect(c, a), i.push({ a: a, b: c })) } } } return { graph: r, connections: i } }(g), A = r(f, S), D = r(d, S), k = n(f), F = n(d); return this.byproduct.spots = g, this.byproduct.vRulers = p, this.byproduct.hRulers = m, this.byproduct.grid = L.rectangles(), this.byproduct.connections = _, c(W, A, D).length > 0 ? function (t) { if (t.length <= 2) return t; const s = [t[0]]; for (let e = 1; e < t.length; e++) { const o = t[e]; if (e === t.length - 1) { s.push(o); break } "none" !== a(t[e - 1], o, t[e + 1]) && s.push(o) } return s }([k, ...c(W, A, D), F]) : [] } } return f.byproduct = { hRulers: [], vRulers: [], spots: [], grid: [], connections: [] }, f }() },
        VwHeight() { return `calc(100vh - 18px - ${this.$root.MinY}px)` },
        LisDiagram() { return ['--No select--', ...this.$root.MpDiagram.keys()] },
    },
    watch: {
        '$root.KeyDraw'() {
            this.$root.updateMnmxXy()
            this.drawInCnvs()
        },
    },
    mounted() {
        document.addEventListener('mousemove', this.trackMouse)
        document.addEventListener("keyup", this.onKeyUp);

        this.$root.updateMnmxXy()       // mount-ed
        this.$nextTick(this.drawInCnvs) // mount-ed
    },
    //beforeUpdate() { },
    updated() {
        this.drawInCnvs()
    },
    beforeUnmount() {
        document.removeEventListener('mousemove', this.trackMouse)
        document.removeEventListener("keyup", this.onKeyUp);
    }
}
</script>
<template>
    <div style="display: flex;" :minx="$root.MinX" :maxx="$root.MaxX" :miny="$root.MinY" :maxy="$root.MaxY">
        <aside id="dnb-vwtab-left" :style="[{ width: $root.MinX + 'px' }]">
            <div>
                <menu-list :value="CurrentDiag" :isfix="true" :sources="LisDiagram"
                    @change:value="$e => selectDiagram($e)"></menu-list>
            </div>
            <div style="cursor: default;">{{ $root.Langs[$root.PLang] }}
                <!--<menu-list :value="$root.Langs[$root.PLang]" :isfix="true" :sources="$root.Langs" @change:value="$e => changeLanguage($e)"></menu-list>-->
            </div>
            <div @mousedown="msDwnNewCls" class="cls-sample">
                <div class="cls-spname">ClassName</div>
                <div class="cls-spfields">&nbsp;+ Fields</div>
                <div class="cls-spprops">&nbsp;+ Properties</div>
            </div>
            <div class="btnsavediagram" @click.stop="saveDiagram">Save Diagram</div>
            <div class="btnnewdiagram" @click.stop="newDiagram">New Diagram</div>
            <div class="btnsavedata" @click.stop="exportDiagram">Save data</div>
            <div class="btnimport">
                <label for="f-import" style="cursor: pointer;">Import data</label>
                <input type="file" id="f-import" style="opacity: 0;" accept=".txt" @change="importDiagram" />
            </div>
        </aside>
        <article id="dnb-vw-main" :key="$root.KeyDraw" :style="{ height: VwHeight }">
            <canvas id="dnb-mcanvas" :width="$root.MaxX - $root.MinX" :height="$root.MaxY - $root.MinY">
                Your browser does not support the HTML canvas tag.
            </canvas>
            <div id="dnb-vwdiagrams"
                :style="[{ width: ($root.MaxX - $root.MinX) + 'px', height: ($root.MaxY - $root.MinY) + 'px' }]">
                <rect-wrap v-for="[id, wItm] in $root.MpClass"
                    :key="'id' + wItm.id + 'type' + wItm.TypeDeclaration + 'x' + wItm.left + 'y' + wItm.top + 'w' + wItm.width + 'h' + wItm.height"
                    :item="wItm"></rect-wrap>
                <rect-wrap v-if="$root.NewClassName != null" :item="$root.NewClassName"
                    :key="'id=' + $root.NewClassName.id"></rect-wrap>
            </div>
            <div v-if="$root.ViewCode" id="dnb-viewcode" :style="[{
                top: $root.ViewCode.top + 'px', left: $root.ViewCode.left + 'px',
            }]">
                <pre style="margin-top: 10px;"><code class="language-csharp" v-html="$root.ViewCode.html"></code></pre>
                <i class="bi bi-x-lg cpoint" style="width: 24px;height: 20px;display: inline-block;text-align: center;
                        background-color: white; border-radius: 6px;padding-top: 4px;
                        position: absolute;right: 3px;top: 2px;"
                    @click.stop="e => { $root.DynamicVar.delete('FViewCode') }"></i>
            </div>
        </article>
    </div>
</template>
<style>
#dnb-viewcode {
    scrollbar-width: thin;
    min-width: 360px;
    min-height: 250px;
    box-sizing: border-box;
    position: fixed;
    border-radius: 10px;
    background-color: #cde5f9;
    padding: 10px;
    left: calc(249px + 220px);
    top: calc(39px - 12px);
    max-height: calc(100vh - 69px);
    overflow: auto;
}

#dnb-vw-main {
    position: relative;
    border: 1px solid #dedede;
    overflow: auto;
    width: calc(100vw - 32px);
    scrollbar-width: thin;
}

#dnb-vwdiagrams {
    position: absolute;
    top: 0;
    left: 0;
    height: 870px;
}

.cls-sample {
    display: inline-block;
    border: 1px solid rgb(0, 0, 0);
    width: calc(100% - 10px);
    cursor: default;
    border-radius: 4px;
}

.cls-spname {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid black;
}

.cls-spprops,
.cls-spfields {
    font-size: 12px;
    font-weight: 300;
}

.cls-spfields {
    border-bottom: 1px solid black;
}

.btnnewdiagram,
.btnsavediagram,
.btnsavedata,
.btnimport {
    width: 108px;
    font-size: 14px;
    height: 28px;
    background-color: rgb(77, 107, 254);
    align-items: center;
    justify-content: center;
    color: white;
    border-radius: 6px;
    cursor: pointer;
}

.btnnewdiagram,
.btnsavediagram,
.btnsavedata {
    display: inline-flex;
}

.btnimport {
    display: grid;
    grid-template-columns: auto 0;
}
</style>