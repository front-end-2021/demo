// #region import
import { createApp } from 'vue'
import {
    drawExtension, drawImplement, drawGrid, fillCirle,
    drawComposition, drawAssociation, drawAggregation,
} from './mcanvas.js'
import { ViewDiagram } from './components/vw-diagram.js'
import { getListCls } from './repository.js'
import {
    verifySave, setHeight, isOverlap, initPoint, getStringBetween,
    isAbstract, isClass, isInterface, isStruct, isEnum, cellBlock,
    genBoards, getRows, getCols, cellSize, cellEmpty, build_xy,
    verifyExportTxt, doInRange, setCell, getArea,
} from './common.js'
import { FormEdit } from './components/minicontrols.js'
// #endregion
Promise.all([
    includeHTML(`./components/vw-diagram.html`),
]).then((values) => {
    const app = createApp({
        name: `app-main`,
        components: {
            'view-diagram': ViewDiagram,
            'form-edit': FormEdit,
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

            return {
                MinX, MaxX,
                MinY, MaxY,
                Board,
                BlokedMap: new Map(),

                DiagName: 'Demo',
                ListClass: getListCls(),

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
            CompPage() {
                return 'view-diagram';
            },
            ViewCode() {
                const dmVar = this.DynamicVar
                if (dmVar.has('FViewCode')) {
                    return dmVar.get('FViewCode')

                }
                return null
            },
            EditObject() {
                const dmVar = this.DynamicVar
                if (dmVar.has('FrameCode')) {
                    return dmVar.get('FrameCode')

                }
                return null
            },
        },
        watch: {
            //ListClass(val) { },
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
                if (isEnum(rItem.type)) return     // verify
                if (isStruct(rItem.type)) return     // verify

                const mPoints = this.MpPoints
                const lstCls = this.ListClass

                const mClass = new Map()        // [Name, item]
                const mAbstrac = new Map()
                const mInterface = new Map()
                const mEnum = new Map()
                const mStruct = new Map()
                // #region build map data
                for (let ii = lstCls.length - 1, item; -1 < ii; ii--) {
                    item = lstCls[ii]
                    if (isInterface(item.type)) {
                        mInterface.set(item.Name, item)
                        continue
                    }
                    if (isAbstract(item.type)) {
                        mAbstrac.set(item.Name, item)
                        continue
                    }
                    if (isClass(item.type)) {
                        mClass.set(item.Name, item)
                        continue
                    }
                    if (isEnum(item.type)) {
                        mEnum.set(item.Name, item)
                        continue
                    }
                    if (isStruct(item.type)) {
                        mStruct.set(item.Name, item)
                        continue
                    }
                }
                // #endregion
                let lsImpl = []     // List<item>
                let lsExtn = []     // List<item>
                let lsComp = []     // List<[item, lsTxt]>
                let lsAggr = []     // List<[item, lsTxt]>
                if (isInterface(rItem.type)) {
                    buildLsImplment()
                    setPoints()
                    return
                }
                let mapField = new Map()        // [item, fieldName]
                let mStatic = new Map()        // [Name, item]
                for (let ff = rItem.Fields.length - 1, fld, type; -1 < ff; ff--) {
                    fld = rItem.Fields[ff]
                    type = getFieldType(fld.Type)
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
                if (isAbstract(rItem.type)) {
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
                if (isClass(rItem.type)) {
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
                    if (fType.includes('<')) {
                        return getStringBetween(fType, '<', '>')
                    }
                    return fType
                }
                function setMpFld(item, fld) {
                    if (isGlobal(fld.Visible)) {
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
                        if (lsImpl.find(x => x.id == item.id)) {
                            mapFld.delete(item)
                            continue
                        }
                    }
                }
                function truncMpFld() {
                    for (const [item, fName] of mapField) {
                        if (mStatic.has(item)) {
                            mapField.delete(item)
                        }
                    }
                }
                function isGlobal(vsble) {
                    if (vsble.includes('static')) return true
                    return false
                }
                function setPoints() {
                    if (0 < lsImpl.length + lsExtn.length + lsComp.length + lsAggr.length) {
                        const point = initPoint(rItem, lsImpl, lsExtn, lsComp, [], lsAggr)

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
                        lsImpl.push(item)
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
                drawGrid.call(ctx, rows * cellSize, cols * cellSize, cellSize, '#f5f5f5')


                const mPoints = this.MpPoints
                if (mPoints.size < 1) return;
                let src, des
                let x0, y0, w0, h0
                let x1, y1, w1, h1
                for (const [id, point] of mPoints) {
                    src = point.item
                    x0 = src.left + 1;
                    y0 = src.top
                    w0 = src.width
                    h0 = src.height

                    for (let ii = point.Implements.length - 1; -1 < ii; ii--) {
                        des = point.Implements[ii]
                        x1 = des.left
                        y1 = des.top
                        w1 = des.width
                        h1 = des.height
                        drawImplement.call(ctx, [x0, y0, w0, h0], [x1, y1, w1, h1], 6, '#8b8b8b')
                    }
                    for (let ii = point.Extends.length - 1; -1 < ii; ii--) {
                        des = point.Extends[ii]
                        x1 = des.left
                        y1 = des.top
                        w1 = des.width
                        h1 = des.height
                        drawExtension.call(ctx, [x0, y0, w0, h0], [x1, y1, w1, h1], 6, '#8b8b8b')
                    }
                    for (let ii = point.Associations.length - 1; -1 < ii; ii--) {
                        des = point.Associations[ii]
                        x1 = des.left
                        y1 = des.top
                        w1 = des.width
                        h1 = des.height
                        drawAssociation.call(ctx, [x0, y0, w0, h0], [x1, y1, w1, h1], '#dddddd')
                    }
                    for (let ii = point.Compositions.length - 1, com; -1 < ii; ii--) {
                        com = point.Compositions[ii]
                        des = com[0]
                        x1 = des.left
                        y1 = des.top
                        w1 = des.width
                        h1 = des.height
                        drawComposition.call(ctx, [x0, y0, w0, h0], [x1, y1, w1, h1], 6, 18, '#8b8b8b', com[1])
                    }
                    for (let ii = point.Aggregations.length - 1, agg; -1 < ii; ii--) {
                        agg = point.Aggregations[ii]
                        des = agg[0]
                        x1 = des.left
                        y1 = des.top
                        w1 = des.width
                        h1 = des.height
                        drawAggregation.call(ctx, [x0, y0, w0, h0], [x1, y1, w1, h1], 6, 18, '#8b8b8b', agg[1])
                    }

                }

            },
            drawBlocks() {
                return;
                let color = '#00000057';
                const c = document.getElementById('dnb-mcanvas');
                const ctx = c.getContext("2d");
                ctx.fillStyle = color
                const mapBlk = this.BlokedMap
                for (const [id, area] of mapBlk) {
                    doInRange(area, (ix, iy) => {
                        let [x, y] = build_xy(ix, iy)
                        ctx.fillRect(x, y, cellSize, cellSize)
                    })
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
                            for (let jj = 0; jj < lsAsso.length; jj++) {
                                aPoint.Associations.push(lsAsso[jj])
                            }
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
                    else if (isOverlap(dItem, this.ListClass)) {
                        // revert
                        this.setTopLeft(dItem, dgElm.Left, dgElm.Top)
                        this.updateSizeCanvas()         // key up => end dnd item => revert
                        this.$nextTick(this.drawInCnvs) // key up => end dnd item => revert
                        this.$nextTick(this.drawBlocks) // key up => end dnd item => revert

                    } else {

                        this.closeBlock(dItem)      // end dnd -> new pos

                        this.updateSizeCanvas()             // key up => end dnd item
                        this.drawInCnvs()    // key up => end dnd item
                        this.drawBlocks()    // key up => end dnd item

                    }
                    document.removeEventListener('keydown', this.disableSrollDown)

                }
                dmVar.delete('DragElm')
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
                // {id, type, Name, toIds, top, left, width, height, Fields, Methods }
                const dmVar = this.DynamicVar
                dmVar.delete('FViewCode')
                let cItem = JSON.parse(JSON.stringify(item))
                verifySave(cItem, this.PLang)

                const entry = {
                    item,
                    cItem,
                }
                //if (item.toIds) entry.toIds = [...item.toIds]
                dmVar.set('FrameCode', entry)
                this.$nextTick(() => {
                    document.body.querySelectorAll(`textarea.objedit-vwcode`).forEach(el => {
                        let txt = el.value
                        setHeight(el, txt)
                    })
                })
            },
            getLsExtends(lsCls, lstItf, iLang) {
                let lst = []//this.ListClass
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
                const lst = this.ListClass
                let mxX = Math.max(...lst.map(x => x.left + x.width))
                mxX += offXy
                if (mxX < minW) mxX = minW - 21
                let mxY = Math.max(...lst.map(x => x.top + x.height))
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
            // equalHas(txt1, txt2) {
            //     let hash1 = CryptoJS.SHA256(txt1), hash2 = CryptoJS.SHA256(txt2)
            //     return hash1.toString(CryptoJS.enc.Hex) == hash2.toString(CryptoJS.enc.Hex)
            // },
        },
        //  beforeCreate() { },
        created() {
            let lsCls = this.ListClass
            for (let ii = lsCls.length - 1, cls; -1 < ii; ii--) {
                cls = lsCls[ii]

                this.closeBlock(cls)         // create-d
                this.buildMapPoints(cls)      // create-d
            }
            this.buildAssociation()         // create-d
        },
        //beforeMount() { },
        mounted() {
            values.forEach((path, ii) => {
                let pDom = document.body.querySelector(`.dnb-imp-html[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })

            // const message = "123456";
            // const hash = CryptoJS.SHA256(message);//CryptoJS.MD5(message);
            // console.log(hash.toString(CryptoJS.enc.Hex));
            // console.log(hash.toString(CryptoJS.enc.Base64));// speed > Hex

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
        beforeUpdate() {
            console.log('before updated')
        },
        updated() { console.log('updated') },
    })
    app.mount('#m-app')

}).catch(errStatus => { console.log('Woop!', errStatus) })

function includeHTML(path) {
    const items = document.body.getElementsByClassName("dnb-imp-html");
    path = path.trim()
    for (let i = 0; i < items.length; i++) {
        const elmnt = items[i];   /*search for elements with a certain atrribute:*/
        const file = elmnt.getAttribute("dnbpath");
        if (!file) continue
        if (file.trim() !== path) continue

        const xhr = new XMLHttpRequest(); /* Make an HTTP request using the attribute value as the file name: */
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 0 || (200 <= xhr.status && xhr.status < 400)) {
                        // The request has been completed successfully
                        document.body.innerHTML += `\n ${xhr.responseText}`
                        resolve(path, xhr.responseText)
                    } else {
                        reject(xhr.status) // There has been an error with the request!
                    }
                    elmnt.removeAttribute("dnbpath"); /* Remove the attribute, and call xhr function once more: */
                }
            }
            xhr.open("GET", file, true);
            xhr.send();
        })
    }
}