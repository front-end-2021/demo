import {
    processLines, StructTypes, getLstExt,
    addStrFirst, cellSize, getPropKey
} from "./common.js"
export function isAbstract(t) { if (typeof t != 'string') return false; return t.includes('abstrac') }
export function isClass(t) { if (typeof t != 'string' || isAbstract(t)) return false; return t.includes('class') }
export function isInterface(t) { if (typeof t != 'string') return false; return t.includes('interf') }
export function isStruct(t) { if (typeof t != 'string') return false; return 'struct' == t }
export function isEnum(t) { if (typeof t != 'string') return false; return 'enum' == t }
export function filterItems(map, fnc, returnType = 'set', returnKey = 'id') {
    let ls = new Set()
    if (map instanceof Map) for (let [id, item] of map) { if (fnc(item)) ls.add(item) }
    else for (let item of map) { if (fnc(item)) ls.add(item) }
    if ('map' == returnType) return new Map([...ls].map(x => [x[returnKey], x]))
    if ('array' == returnType) return [...ls]
    return ls
}
export function mapItems(map, fn) {
    let ls = []
    if (map instanceof Map) for (let [id, item] of map) ls.push(item)
    else for (let item of map) ls.push(item)
    return ls.map(x => fn(x))
}
export const MxRect = {
    props: ['item'],
    methods: {
        onMouseDown(event) {
            const root = this.$root
            const dmVar = root.DynamicVar
            if (dmVar.has('DragElm')) return;
            if (dmVar.has('FrameCode')) return;
            dmVar.delete('FViewCode')
            const off = this.$el.getBoundingClientRect()
            let x = root.MinX
            let y = root.MinY
            let wrp = document.body.querySelector(`#dnb-vw-main`)
            if (!wrp) return
            x -= wrp.scrollLeft
            y -= wrp.scrollTop

            const item = this.item
            document.addEventListener('keydown', root.disableSrollDown)
            root.DynamicVar.set('DragElm', {
                Item: item,
                offX: off.left - event.clientX - x,
                offY: off.top - event.clientY - y,
                Top: item.top,
                Left: item.left
            })
            const itemEl = wrp.querySelector(`#cls_${item.id}`)
            itemEl.style.zIndex = '1'
            itemEl.style.backgroundColor = 'white'
        },
        setWidthHeight() {
            const item = this.item
            let w = item.width
            let cW = this.$el.offsetWidth
            cW = Math.ceil(cW / cellSize) * cellSize
            let isChange = false
            if (w != cW) {
                item.width = cW
                isChange = true
                this.$el.style.width = `${cW - 2}px`  // border
            }
            let h = item.height
            let cH = this.$el.offsetHeight
            cH = Math.ceil(cH / cellSize) * cellSize
            if (h != cH) {
                item.height = cH
                isChange = true
                this.$el.style.height = `${cH - 2}px`
            }
           // if (isChange) {
              //  console.log('chagne', item.id, item.Name)
              //  const root = this.$root
               // root.bindKeyDraw(root.MpClass)
           // }
        },
        deleteCls(item) {
            const root = this.$root
            const dmVar = root.DynamicVar
            if (dmVar.has('FrameCode')) {
                return
            }
            let mapCls = root.MpClass
            if (mapCls.has(item.id)) {
                root.MpPoints.clear()
                mapCls.delete(item.id)
                for (let [id, cls] of mapCls) {
                    if (!cls.toIds.length) continue
                    ii = cls.toIds.indexOf(item.id)
                    if (-1 < ii) cls.toIds.splice(ii, 1)
                }
                for (let [id, cls] of mapCls) {
                    root.buildMapPoints(cls)   // delete item
                }
                root.buildAssociation()               // delete item
                root.updateMnmxXy()               // delete item
                mapCls = new Map(mapCls)
            }
            root.MpClass = mapCls
        },
        editCls(item) {
            const dmVar = this.$root.DynamicVar
            if (dmVar.has('FrameCode')) { return }
            this.$root.editObject(item)
        },
    },
    mounted() { this.setWidthHeight() },
    beforeUpdate() {
        this.$el.style.width = ''
        this.$el.style.height = ''
    },
    updated() { this.setWidthHeight() },
}
export const MxOjClass = {
    methods: {
        getCsFormat(prp) {
            let acModify = prp.AccessModify
            let txt = this.getAcModf(prp)
            if (isAbstract(acModify) && !prp.specialMe) return `${txt};\n`
            return `${txt} {...}`
        },
        showCodeBody(ii, offI) {
            const dmVar = this.$root.DynamicVar
            if (dmVar.has('FrameCode')) { return }
            const item = this.item
            let clsName = this.FormatCode[0]
            let txtF = this.FormatCode[1]
            let txtFnc = `${txtF}\n`
            let lstPrp = [...item.Properties, ...this.ExtProperties]
            for (let jj = 0, txtP, prp; jj < lstPrp.length; jj++) {
                prp = lstPrp[jj]
                txtP = this.getCsFormat(prp);
                txtP = `  ${txtP}`
                if (-1989 == offI && ii === offI) {
                    let pCode = prp.FuncBody
                    if (typeof pCode != 'string') {
                        pCode = '/* empty */'
                        txtP = txtP.replace(`{...}`, `{ ${pCode} }`)
                    } else {
                        let hasEnter = pCode.includes('\n')
                        if (hasEnter) txtP = txtP.replace(`{...}`, `{\n${addStrFirst(pCode, '     ')}\n  }`)
                        else if (pCode[0] !== '' || pCode[1] !== '' || pCode[2] !== '') pCode = '   ' + pCode
                        {
                            txtP = txtP.replace(`{...}`, `{\n ${pCode}\n  }`)
                        }
                    }
                } else if (jj - offI === ii) {
                    let pCode = prp.FuncBody
                    let hasEnter = false
                    if (!pCode) pCode = '/* empty */'
                    else if (isAbstract(pCode)) pCode = ''
                    else {
                        hasEnter = pCode.includes('\n')
                        if (!hasEnter) pCode += ';'
                        else pCode = processLines(pCode)
                    }
                    if (txtP.includes(`{...}`)) {
                        if (hasEnter) {
                            txtP = txtP.replace(`{...}`, `{\n${addStrFirst(pCode, '     ')}\n  }`)
                        } else if (pCode == '/* empty */') {
                            txtP = txtP.replace(`{...}`, `{ ${pCode} }`)
                        } else {
                            txtP = txtP.replace(`{...}`, `{\n    ${pCode}\n  }`)
                        }
                    }
                } else {
                    txtP = txtP.replace(`{...}`, `{ ... }`)
                }
                txtFnc += `${txtP}\n`
            }
            let txt = `${clsName}${txtFnc}}`
            this.setFragViewCode(txt)

        },
    },
    computed: {
        ExtendFields() {
            let tIds = this.item.toIds
            if (!tIds.length) return []
            const root = this.$root
            let fields = []
            let mapCls = root.MpClass
            for (let id of tIds) {
                if (mapCls.has(id)) {
                    let parent = mapCls.get(id)
                    for (let f of parent.Fields) fields.push(f)
                }
            }
            return fields
        },
        FormatCode() {
            const item = this.item
            let clsName = item.Name
            const ii = this.$root.PLang
            switch (item.TypeDeclaration) {
                case StructTypes[1][0]: // 'abstract class'
                    clsName = `public ${StructTypes[1][ii]} ${clsName}`
                    break;
                case StructTypes[2][0]: // 'class'
                    clsName = `public ${StructTypes[2][ii]} ${clsName}`
                    break;
                default: break;
            }
            let extds = this.ViewExtends
            let exnd = ''
            if (extds.length) {
                switch (ii) {
                    case 1: exnd += extds[0][0]
                        exnd += ` ${extds[0][1]}`
                        break;
                    case 2: exnd += extds[0].join(' ')
                        if (1 < extds.length) exnd += extds[1].join(' ')
                        break;
                    default: break;
                }
                clsName += exnd
            }
            clsName = `${clsName}\n{\n`
            let txtF = this.getTxtFields(item, this.ExtendFields)
            return [clsName, txtF]
        },
        ExtProperties() {
            const item = this.item
            if (!item.toIds.length) return []
            const mPoints = this.$root.MpPoints
            if (!mPoints.has(item.id)) return []
            const point = mPoints.get(item.id)
            if (point.Extends.length + point.Implements.length < 1) return []
            let lst = getLstExt(item.Properties, point.Extends)
            let lst2 = getLstExt(item.Properties, point.Implements)
            for (let ii = 0; ii < lst2.length; ii++) { lst.push(lst2[ii]) }
            return lst
        },
    },
}
export const MxClsItf = {      // mixin: Class, Abstract, Interface
    methods: {
        setFragViewCode(txt) {
            let off = this.$el.getBoundingClientRect()
            let top = off.top - 12
            let left = off.left + off.width
            left = Math.ceil(left)
            if (window.innerWidth < left + 360) {
                left -= 360
                left -= off.width
            }
            let html = hljs.highlight(txt, { language: 'cs' }).value
            const dmVar = this.$root.DynamicVar
            dmVar.delete('FrameCode')
            dmVar.set('FViewCode', {
                top, left, html, type: 1
            })
            this.$root.$nextTick(() => {
                let vwFcode = document.body.querySelector(`#dnb-viewcode`)
                if (vwFcode) {
                    let frmCode = dmVar.get('FViewCode')
                    let offF = vwFcode.getBoundingClientRect()
                    let maxY = offF.top + offF.height
                    if (window.innerHeight - 39 < maxY) {
                        frmCode.top -= (maxY - window.innerHeight + 6 + 18)
                        vwFcode.style.top = `${frmCode.top}px`
                    }
                }
            })
        },
        onEditable(e, type, ii) {
            const dmVar = this.$root.DynamicVar
            if (dmVar.has('FrameCode')) { return }
            this.$root.closePopupForm()
            const target = e.target
            switch (type) {
                case 'class name':
                case 'methd name':
                    target.setAttribute('contenteditable', 'true')
                    target.focus()
                    break;
                default: break;
            }
        },
        onDoneEdit(e, type, ii) {
            const root = this.$root
            const target = e.target
            const item = this.item
            let name = target.textContent
            name = name.trim()
            switch (type) {
                case 'class name':
                    target.removeAttribute('contenteditable')
                    if (!name.length) {
                        target.innerHTML = item.Name
                    } else {
                        if (StructTypes[1][0] == item.TypeDeclaration)
                            name = name.replace('abstract', '');
                        name = name.replaceAll(' ', '')
                        item.Name = name
                    }
                    break;
                case 'methd name':
                    target.removeAttribute('contenteditable')
                    const prp = this.item.Properties[ii]
                    if (!name.length) {
                        target.innerHTML = prp.Name
                    } else {
                        prp.Name = name
                    }
                    break;
                default: break;
            }
        },
        getAcModf(prp) { return `${prp.AccessModify} ${prp.DataType} ${getPropKey(prp, prp.Name)}` },
        getTxtFields(item, extnFields) {
            let txtF = ''
            let lstF = [...item.Fields, ...extnFields]
            for (let jj = 0, field; jj < lstF.length; jj++) {
                field = lstF[jj]
                txtF += `  ${field.AccessModify} ${field.DataType} ${field.Name};\n`
            }
            return txtF
        },
        vwVisible(str) {
            let txt = str.trim()
            if (txt.includes('public')) return '+'
            if (txt.includes('private')) return '-'
            if (txt.includes('protected')) return '#'
            return ''
        },
        clkField(field) {
            const dmVar = this.$root.DynamicVar
            if (dmVar.has('FrameCode')) { return }
            this.$root.clearDyVar()
        },
        propTostring(prp) { return getPropKey(prp) },
    },
    computed: {
        ViewExtends() {
            const tIds = this.item.toIds
            if (!tIds || !tIds.length) return ''
            const root = this.$root
            const mPoints = root.MpPoints
            const itemId = this.item.id
            if (!mPoints.has(itemId)) return ''
            let point = mPoints.get(itemId)
            return root.getLsExtends(point.Extends, point.Implements, root.PLang)
        },
    },
}