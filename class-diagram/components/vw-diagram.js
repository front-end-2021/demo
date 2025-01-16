import { setHeight, processLines, StructTypes } from "../common.js";
export const MenuList = {
    template: `#tmp-menu-list`,
    name: "Menu_List",
    display: "Menu.List",
    props: ['value', 'sources', 'isfix'],
    emits: ['change:value'],
    data() {
        return {
            ListSrc: [],
        }
    },
    methods: {
        openLstSrc() {
            const dmVar = this.$root.DynamicVar
            let popM = dmVar.get('PopMenu')
            if (popM) {
                document.removeEventListener('click', this.$root.closePMenu)
                if (popM !== this) popM.emptySrc()
                else return
            }
            dmVar.set('PopMenu', this)

            this.ListSrc = this.sources
            if (!this.isfix) {
                let xx = this.sources.indexOf(this.value)
                if (0 < xx) {
                    let top = 12
                    this.$nextTick(() => {
                        top += 24 * xx
                        let spn = this.$el.querySelector(`.dnb-mnlst`)
                        if (spn) spn.style.top = `-${top}px`
                    })
                }
            }
            this.$nextTick(() => {
                setTimeout(() => {
                    document.addEventListener('click', this.$root.closePMenu)
                }, 696)
            })
        },
        emptySrc() {
            this.ListSrc = []
        },
        changeValue(val) {
            if (this.value != val) this.$emit('change:value', val)
            document.removeEventListener('click', this.$root.closePMenu)
            this.emptySrc()
            const dmVar = this.$root.DynamicVar
            dmVar.delete('PopMenu')
        },
    },
    //beforeUnmount(){ },
}
const MxRect = {
    props: ['item'],
    methods: {
        onMouseDown(event) {
            const dmVar = this.$root.DynamicVar
            if (dmVar.has('DragElm')) return;
            const off = this.$el.getBoundingClientRect()
            let x = this.$root.MinX
            let y = this.$root.MinY
            this.$root.DynamicVar.set('DragElm', {
                Item: this.item,
                offX: off.left - event.clientX - x,
                offY: off.top - event.clientY - y,
                Top: this.item.top,
                Left: this.item.left
            })
            const itemEl = document.body.querySelector(`#dnb-vw-main #${this.item.id}`)
            itemEl.style.zIndex = '1'
            itemEl.style.backgroundColor = 'white'
        },
        setWidthHeight() {
            let w = this.item.width
            let cW = this.$el.offsetWidth
            cW = Math.ceil(cW)
            let isChange = false
            if (w != cW) {
                this.item.width = cW
                isChange = true
            }
            let h = this.item.height
            let cH = this.$el.offsetHeight
            cH = Math.ceil(cH)
            if (h != cH) {
                this.item.height = cH
                isChange = true
            }
            if (isChange) {
                this.$root.drawLines(this.$root.getPoints())

            }
        },
        editObject() {
            const item = this.item
            // {id, type, Name, toIds, top, left, width, height, Fields, Properties }
            const dmVar = this.$root.DynamicVar
            dmVar.delete('FViewCode')
            dmVar.set('FrameCode', {
                type: 2, item,
                iFields: JSON.parse(JSON.stringify(item.Fields)),
                iPropes: JSON.parse(JSON.stringify(item.Properties)),
            })
            this.$root.$nextTick(() => {
                document.body.querySelectorAll(`textarea.objedit-vwcode`).forEach(el => {
                    let txt = el.value
                    setHeight(el, txt)
                })
            })
        },
    },
    mounted() {
        const off = this.$el.getBoundingClientRect()
        this.item.height = off.height
        this.setWidthHeight()
    },
    updated() {
        this.setWidthHeight()

    },
    // beforeUnmount() { },
}
const RectEnum = {
    template: `#tmp-rect-enum`,
    name: "Rect_Class",
    display: "Rect.Class",
    mixins: [MxRect],
    //methods: { },
    computed: {
        TxtField() {
            return this.item.Fields.map(x => x.Name).join(', ')
        },
    },
}
const RectClass = {
    template: `#tmp-rect-class`,
    name: "Rect_Class",
    display: "Rect.Class",
    //props: [],
    mixins: [MxRect],
    components: {
        'rect-enum': RectEnum,
    },
    methods: {
        getFragProp(prp) {
            let acModify = prp[0]
            acModify = acModify.replace(' override', '')
            acModify = acModify.replace(' virtual', '')
            acModify = acModify.replace(' abstract', '')
            let name = prp[1]
            let type = prp[2]
            let returnType = prp[3]
            returnType = returnType.toLowerCase()
            let txt = [`${acModify} ${type}`, name, `{...}`]     // set
            if (returnType.includes('init')) txt = [`${acModify}`, name, `{...}`]
            else if (returnType.includes('get'))
                txt = [`${acModify}`, name, `: ${type} {...}`]
            return txt
        },
        getCsFormat(prp) {
            let acModify = prp[0]
            let name = prp[1]
            let type = prp[2]
            let txt = `${acModify} ${type} ${name}`
            if ('interface' == this.item.type) return `${txt};\n`
            if (acModify.includes('abstract') && !prp[4]) return `${txt};\n`
            let returnType = prp[3]
            returnType = returnType.toLowerCase()
            if (returnType.includes('init')) {
                txt = `${acModify} ${name}`
            }
            return `${txt} {...}`
        },
        showCodeBody(ii, offI) {
            const item = this.item
            let clsName = this.FormCsFormat[0]
            let txtF = this.FormCsFormat[1]
            let txtFnc = `${txtF}\n`
            let lstPrp = [...item.Properties, ...this.ExtendProperties]
            for (let jj = 0, txtP, prp; jj < lstPrp.length; jj++) {
                prp = lstPrp[jj]
                txtP = this.getCsFormat(prp)
                txtP = txtP.replace('+', '  public')
                txtP = txtP.replace('-', '  private')
                txtP = txtP.replace('#', '  protected')
                if (jj - offI == ii) {
                    let pCode = prp[4]
                    let hasEnter = false
                    if ('interface' == item.type) { pCode = '' }
                    else if (!pCode) pCode = '/* empty */'
                    else if ('abstract' == pCode) pCode = ''
                    else {
                        hasEnter = pCode.includes('\n')
                        if (!hasEnter) pCode += ';'
                        else pCode = processLines(pCode)
                    }
                    if (txtP.includes(`{...}`)) {
                        if (hasEnter) {
                            txtP = txtP.replace(`{...}`, `{\n${pCode}\n  }\n`)
                        } else {
                            txtP = txtP.replace(`{...}`, `{\n    ${pCode}\n  }\n`)
                        }
                    }
                } else if (txtP.includes(`{...}`)) {
                    txtP = txtP.replace(`{...}`, `{ ... }\n`)
                }
                txtFnc += `${txtP}`
            }
            let txt = `${clsName}${txtFnc}}`
            //console.log(txt)
            setFragViewCode.call(this, txt)
            function setFragViewCode(txt) {
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
                        if (window.innerHeight < maxY) {
                            frmCode.top -= (maxY - window.innerHeight + 6)
                            vwFcode.style.top = `${frmCode.top}px`
                        }
                    }
                })
            }
        },
        onEditable(e, type, ii) {
            const target = e.target
            switch (type) {
                case 'class name':
                    target.setAttribute('contenteditable', 'true')
                    target.focus()
                    break;
                default: break;
            }
        },
        onDoneEdit(e, type, ii) {
            const target = e.target
            const item = this.item
            let name = target.textContent
            name = name.trim()
            switch (type) {
                case 'class name':
                    target.removeAttribute('contenteditable')
                    if (StructTypes[1][0] == item.type)
                        name = name.replace('abstract', '');
                    name = name.replaceAll(' ', '')
                    item.Name = name
                    break;
                case 'property':
                    const prp = this.item.Properties[ii]
                    prp[1] = name
                    break;
                default: break;
            }
            const dmVar = this.$root.DynamicVar
            dmVar.delete('FrameCode')
        },
    },
    computed: {
        ClassName() {
            const item = this.item
            let clsName = item.Name
            switch (item.type) {
                case StructTypes[1][0]:
                    return `abstract ${clsName}`
                case StructTypes[2][0]: // 'instant class'
                case StructTypes[0][0]: //'interface'
                    return clsName
                default: return '';
            }
        },
        ListProperty() {
            const lst = []
            for (let ii = 0, prp; ii < this.item.Properties.length; ii++) {
                prp = this.item.Properties[ii]
                let txt = this.getFragProp(prp)
                lst.push(txt)
            }
            return lst
        },
        FormCsFormat() {
            const item = this.item
            let clsName = item.Name
            const ii = this.$root.PLang
            switch (item.type) {
                case StructTypes[1][0]: // 'abstract class'
                    clsName = `public ${StructTypes[1][ii]} ${clsName}`
                    break;
                case StructTypes[2][0]: // 'class'
                    clsName = `public ${StructTypes[2][ii]} ${clsName}`
                    break;
                case StructTypes[0][0]: // 'interface'
                    clsName = `public ${StructTypes[0][ii]} ${clsName}`
                    break;
                default: break;
            }
            let extend = ''
            const tIds = item.toIds
            if (tIds && tIds.length) {
                let lst = this.$root.ListClass
                const lsCls = []
                const lstItf = []
                for (let jj = 0, cls; jj < lst.length; jj++) {
                    cls = lst[jj]
                    if (item.id == cls.id) continue;  // it-self
                    if (!tIds.includes(cls.id)) continue;
                    switch (cls.type) {
                        case StructTypes[0][0]: // 'interface'
                            lstItf.push(cls)
                            break;  // switch
                        case StructTypes[1][0]: // 'abstract class'
                        case StructTypes[2][0]: // 'class'
                            lsCls.push(cls)
                            break;  // switch
                        default: break;  // switch
                    }
                }
                if (2 == ii) {    // java
                    let tag = ''
                    if (lsCls.length) {
                        lst = lsCls.map(xx => xx.Name)
                        tag = `extends`
                        extend = `${tag} ${lst.join(', ')}`
                    }
                    if (lstItf.length) {
                        lst = lstItf.map(xx => xx.Name)
                        tag = `implements`
                        if (extend.length)
                            extend += ` ${tag} ${lst.join(', ')}`
                        else extend = `${tag} ${lst.join(', ')}`
                    }
                    if (extend.length) extend = ' ' + extend
                } else {
                    if (lsCls.length) {
                        lst = lsCls.map(xx => xx.Name)
                        extend = `${lst.join(', ')}`
                    }
                    if (lstItf.length) {
                        lst = lstItf.map(xx => xx.Name)
                        if (extend.length) extend += `, ${lst.join(', ')}`
                        else extend = `${lst.join(', ')}`
                    }
                    if (extend.length) { extend = `: ${extend}` }
                }
            }
            if (extend.length) clsName += extend
            clsName = `${clsName}\n{\n`
            let txtF = ``
            let lstF = [...item.Fields, ...this.ExtendFields]
            for (let jj = 0, field; jj < lstF.length; jj++) {
                field = lstF[jj]
                switch (field.AcModify) {
                    case '#': txtF += `  protected ${field.Type} ${field.Name};\n`
                        break;
                    case '+': txtF += `  public ${field.Type} ${field.Name};\n`
                        break;
                    case '-': txtF += `  private ${field.Type} ${field.Name};\n`
                        break;
                    default: break;
                }
            }
            return [clsName, txtF]
        },
        ExtendsView() {
            if (StructTypes[3][0] == this.item.type) return null
            const tIds = this.item.toIds
            if (!tIds || !tIds.length) return null
            let lst = this.$root.ListClass
            const itemId = this.item.id
            const lsCls = []
            const lstItf = []
            for (let ii = 0, cls; ii < lst.length; ii++) {
                cls = lst[ii]
                if (itemId == cls.id) continue;  // it-self
                if (!tIds.includes(cls.id)) continue;
                switch (cls.type) {
                    case StructTypes[0][0]: // 'interface'
                        lstItf.push(cls)
                        break;  // switch
                    case StructTypes[1][0]: // 'abstract class'
                    case StructTypes[2][0]: // 'instant'
                        lsCls.push(cls)
                        break;  // switch
                    default: break;  // switch
                }
            }
            let extend = ''
            if (2 == this.$root.PLang) {    // java
                let tag = ''
                if (lsCls.length) {
                    lst = lsCls.map(xx => xx.Name)
                    tag = `<small>extends</small>`
                    extend = `${tag} ${lst.join(', ')}`
                } else extend = ''
                if (lstItf.length) {
                    lst = lstItf.map(xx => xx.Name)
                    tag = `<small>implements</small>`
                    if (extend.length)
                        extend += ` ${tag} ${lst.join(', ')}`
                    else extend = `${tag} ${lst.join(', ')}`
                }
                if (extend.length) extend = ' ' + extend
            } else if (1 == this.$root.PLang) {  // CSharp
                if (lsCls.length) {
                    lst = lsCls.map(xx => xx.Name)
                    extend = `${lst.join(', ')}`
                }
                if (lstItf.length) {
                    lst = lstItf.map(xx => xx.Name)
                    if (extend.length) extend += `, ${lst.join(', ')}`
                    else extend = `${lst.join(', ')}`
                }
                if (extend.length) { extend = `: <i>${extend}</i>` }
            }
            if (!extend.length) return null
            return extend
        },
        ExtendFields() {
            let tIds = this.item.toIds
            if (!tIds || !tIds.length) return []
            let parent = this.$root.ListClass.find(xx => tIds.includes(xx.id))
            if (!parent) return []
            return parent.Fields
        },
        ExtendProperties() {
            const item = this.item
            if ('interface' == item.type) return []
            let tIds = item.toIds
            if (!tIds || !tIds.length) return []
            const lstCls = this.$root.ListClass
            const prps = item.Properties
            const lst = []
            for (let ii = 0, xx, oPrp; ii < lstCls.length; ii++) {
                xx = lstCls[ii]
                if (xx.id == item.id) continue   // it-self
                if (!xx.Properties || !xx.Properties.length) continue;
                if (!tIds.includes(xx.id)) continue
                if ('interface' == xx.type) continue
                for (let jj = 0, prp; jj < xx.Properties.length; jj++) {
                    prp = xx.Properties[jj]
                    const name = prp[1]
                    oPrp = prps.find(xx => name == xx[1])
                    if (oPrp) {
                        if (oPrp[0].includes('override')) continue
                        lst.push(prp)
                    } else {
                        lst.push(prp)
                    }
                }
            }
            return lst
        },
    },
    beforeMount() {
        const item = this.item
        if ('interface' != item.type) {
            // extend Properties
            let tIds = item.toIds
            if (tIds && tIds.length) {
                const lstCls = this.$root.ListClass
                const prps = item.Properties
                const lst = []
                for (let ii = 0, xx; ii < lstCls.length; ii++) {
                    xx = lstCls[ii]
                    if (xx.id == item.id) continue   // it-self
                    if (!xx.Properties || !xx.Properties.length) continue;
                    if (!tIds.includes(xx.id)) continue
                    for (let jj = 0, prp, oPrp; jj < xx.Properties.length; jj++) {
                        prp = xx.Properties[jj]
                        oPrp = prps.find(pp => prp[1] == pp[1])
                        if (oPrp && oPrp[0].includes('override')) continue
                        if (xx.type.includes('instant')) continue
                        lst.push(prp)
                    }
                }
                const extendPrps = this.ExtendProperties
                for (let ii = lst.length - 1, prp; -1 < ii; ii--) {
                    prp = lst[ii]
                    if (extendPrps.find(pp => prp[1] == pp[1])) continue
                    prps.unshift(JSON.parse(JSON.stringify(prp)))
                }
            }
        }
    },
}
export const ViewDiagram = {
    template: `#tmp-vw-diagram`,
    name: "View_Diagram",
    display: "View.Diagram",
    components: {
        'rect-class': RectClass,
        'menu-list': MenuList,
    },
    //inject: [''],

    // props: ['item'],
    data() {
        return {}
    },
    methods: {
        buildLines() {
            const points = this.$root.getPoints()
            this.$root.drawLines(points)

        },
        setWithCanvas() {
            const vwM = document.getElementById('dnb-vw-main')
            if (vwM) {
                const offW = vwM.offsetWidth
                const cv = document.getElementById(`dnb-mcanvas`);
                if (cv.width != offW) {
                    cv.width = offW
                    return true
                }
            }
            return false
        },
        onMouseDown(event) {
            // if(null !== this.$root.NewClassName) return;
            const dmVar = this.$root.DynamicVar
            if (dmVar.has('DragElm')) return;
            const off = this.$el.querySelector('#cls-sample').getBoundingClientRect()
            let x = this.$root.MinX
            let y = this.$root.MinY
            let left = off.left - x
            let top = off.top - y
            const id = 'cls-classname'
            this.$root.NewClassName = {
                id, type: 'instant class', Name: 'ClassName',
                top, left, width: 220, height: 100,
                Fields: [
                    { AcModify: '#', Name: 'fieldName', Type: 'String' },
                ], Properties: [
                    ['+', 'ClassName', '', 'init'],
                    ['+', 'GetFunction()', 'String', 'get'],
                    ['+', 'SetFunction()', 'void', 'set'],
                ]
            }
            this.$root.DynamicVar.set('DragElm', {
                Item: this.$root.NewClassName,
                offX: left - event.clientX,
                offY: top - event.clientY
            })
            const itemEl = document.body.querySelector(`#dnb-vw-main #${id}`)
            itemEl.style.zIndex = '1'
            itemEl.style.backgroundColor = 'white'
        },
        changeLanguage(val) {
            this.$root.clearDyVar()
            const langs = this.$root.Langs
            for (let ii = 0; ii < langs.length; ii++) {
                if (langs[ii] == val) {
                    this.$root.PLang = ii
                    break;
                }
            }
        },
    },
    //beforeUnmount() { },
    mounted() {
        this.setWithCanvas()
        this.buildLines()
    },
    updated() {
        if (this.setWithCanvas()) this.buildLines()
    },
}