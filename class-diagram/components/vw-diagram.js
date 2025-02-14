import {
    isInterface, processLines, StructTypes, objNewCls,
    isAbstract, convertSymb, truncateIds, hasnMethod, getLstExt,
    verifyExportTxt, verifyName,
} from "../common.js";
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
}
const MxRect = {
    props: ['item'],
    methods: {
        onMouseDown(event) {
            const dmVar = this.$root.DynamicVar
            if (dmVar.has('DragElm')) return;
            if (dmVar.has('FrameCode')) return;
            dmVar.delete('FViewCode')
            const off = this.$el.getBoundingClientRect()
            let x = this.$root.MinX
            let y = this.$root.MinY
            let wrp = document.body.querySelector(`#dnb-vw-main`)
            if (!wrp) return
            x -= wrp.scrollLeft
            y -= wrp.scrollTop

            document.addEventListener('keydown', this.$root.disableSrollDown)
            this.$root.DynamicVar.set('DragElm', {
                Item: this.item,
                offX: off.left - event.clientX - x,
                offY: off.top - event.clientY - y,
                Top: this.item.top,
                Left: this.item.left
            })
            const itemEl = wrp.querySelector(`#cls_${this.item.id}`)
            itemEl.style.zIndex = '1'
            itemEl.style.backgroundColor = 'white'
        },
        setWidthHeight() {
            let w = this.item.width
            let cW = this.$el.offsetWidth
            cW = Math.ceil(cW)
            if (w != cW) {
                this.item.width = cW
            }
            let h = this.item.height
            let cH = this.$el.offsetHeight
            cH = Math.ceil(cH)
            if (h != cH) {
                this.item.height = cH
            }
        },
        deleteCls(item) {
            const lstCls = this.$root.ListClass
            let ii = lstCls.findIndex(x => x.id == item.id)
            if (-1 < ii) {
                this.$root.MpPoints.clear()
                lstCls.splice(ii, 1)
                for (let jc = 0, cls; jc < lstCls.length; jc++) {
                    cls = lstCls[jc]
                    if (!cls.toIds) continue
                    if (!cls.toIds.length) continue
                    ii = cls.toIds.indexOf(item.id)
                    if (-1 < ii) cls.toIds.splice(ii, 1)
                }

                for (ii = lstCls.length - 1; -1 < ii; ii--) {
                    this.$root.buildMapPoints(lstCls[ii])   // delete item
                }
                this.$root.updateSizeCanvas()               // delete item
                this.$root.$nextTick(this.$root.drawInCnvs) // delete item

            }
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

}
const RectEnum = {
    template: `#tmp-rect-enum`,
    name: "Rect_Enum",
    display: "Rect.Enum",
    mixins: [MxRect],

    computed: {
        TxtField() {
            return this.item.Fields.map(x => x.Name).join(', ')
        },
    },
}

const MxClsItf = {      // mixin: Class, Abstract, Interface
    methods: {
        getFragProp(prp) {
            let acModify = this.vwVisible(prp[0])
            // acModify = acModify.replace(' override', '')
            // acModify = acModify.replace(' virtual', '')
            // acModify = acModify.replace(' abstract', '')
            let name = prp[1]
            let type = prp[2]
            let returnType = prp[3]
            returnType = returnType.toLowerCase()
            let minCxt = `{...}`
            if (isInterface(this.item.type)) minCxt = ''
            let txt = [`${acModify} ${type}`, name, minCxt]     // set
            if (returnType.includes('init')) txt = [`${acModify}`, name, minCxt]
            else if (returnType.includes('get'))
                txt = [`${acModify}`, name, `: ${type} {...}`]
            return txt
        },
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
                    if (window.innerHeight < maxY) {
                        frmCode.top -= (maxY - window.innerHeight + 6)
                        vwFcode.style.top = `${frmCode.top}px`
                    }
                }
            })
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
                    const prp = this.item.Methods[ii]
                    prp[1] = name
                    break;
                default: break;
            }
            this.$root.closePopupForm()
        },
        getAcModf(prp) {
            let acModify = prp[0]
            let name = prp[1]
            let type = prp[2]
            return `${acModify} ${type} ${name}`
        },
        getTxtFields(item, extnFields) {
            let txtF = ''
            let lstF = [...item.Fields, ...extnFields]
            for (let jj = 0, field; jj < lstF.length; jj++) {
                field = lstF[jj]
                switch (field.Visible) {
                    case '#': txtF += `  protected ${field.Type} ${field.Name};\n`
                        break;
                    case '+': txtF += `  public ${field.Type} ${field.Name};\n`
                        break;
                    case '-': txtF += `  private ${field.Type} ${field.Name};\n`
                        break;
                    default: break;
                }
            }
            return txtF
        },
        vwVisible(str) {
            let txt = str.replaceAll('static', '')
            txt = txt.replaceAll('override', '')
            txt = txt.replaceAll('virtual', '')
            txt = txt.replaceAll('abstract', '')
            return txt.trim()
        },
    },
    computed: {
        // ViewExtends() {
        //     const tIds = this.item.toIds
        //     if (!tIds || !tIds.length) return ''
        //     let lst = this.$root.ListClass
        //     const itemId = this.item.id
        //     const lsCls = []
        //     const lstItf = []
        //     for (let ii = 0, cls; ii < lst.length; ii++) {
        //         cls = lst[ii]
        //         if (itemId == cls.id) continue;  // it-self
        //         if (!tIds.includes(cls.id)) continue;
        //         if (isInterface(cls.type)) lstItf.push(cls)
        //         else lsCls.push(cls)
        //     }
        //     return this.$root.getLsExtends(lsCls, lstItf, this.$root.PLang)
        // },
        ViewExtends() {
            const tIds = this.item.toIds
            if (!tIds || !tIds.length) return ''
            const mPoints = this.$root.MpPoints
            const itemId = this.item.id
            if (!mPoints.has(itemId)) return ''
            let point = mPoints.get(itemId)
            return this.$root.getLsExtends(point.Extends, point.Implements, this.$root.PLang)
        },
        ListProperty() {
            const lst = []
            for (let ii = 0, prp; ii < this.item.Methods.length; ii++) {
                prp = this.item.Methods[ii]
                let txt = this.getFragProp(prp)
                lst.push(txt)
            }
            return lst
        },
    },
}
const RectInterface = {
    template: `#tmp-rect-class`,
    name: "Rect_Interface",
    display: "Rect.Interface",
    mixins: [MxRect, MxClsItf],
    methods: {
        getCsFormat(prp) {
            let txt = this.getAcModf(prp)
            return `${txt};\n`
        },
        showCodeBody(ii, offI) {
            const item = this.item
            let clsName = this.FormatCode[0]
            let txtF = this.FormatCode[1]
            let txtFnc = `${txtF}\n`
            let lstPrp = [...item.Methods, ...this.ExtProperties]
            for (let jj = 0, txtP, prp; jj < lstPrp.length; jj++) {
                prp = lstPrp[jj]
                txtP = this.getCsFormat(prp)
                txtP = `  ${convertSymb(txtP)}` // txtP.replace('+', '  public')
                txtFnc += `${txtP}\n`
            }
            let txt = `${clsName}${txtFnc}}`
            this.setFragViewCode(txt)
        },
    },
    computed: {
        ClassName() {
            const item = this.item
            let clsName = item.Name
            return clsName
        },
        FormatCode() {
            const item = this.item
            let clsName = item.Name
            const ii = this.$root.PLang
            clsName = `public ${StructTypes[0][ii]} ${clsName}`
            let extds = this.ViewExtends
            let exnd = ''
            if (extds.length) {
                switch (ii) {
                    case 1:
                        exnd = extds.join(' ')
                        break;
                    case 2:
                        exnd = extds[0].join(' ')
                        if (1 < extds.length) exnd += extds[1].join(' ')
                        break;
                    default: break;
                }
                clsName += exnd
            }
            clsName = `${clsName}\n{\n`
            return [clsName, '']
        },
        ExtendFields() { return [] },
        ExtProperties() {
            const item = this.item
            if (!item.toIds || !item.toIds.length) return []
            const mPoints = this.$root.MpPoints
            if (!mPoints.has(item.id)) return []
            const point = mPoints.get(item.id)
            if (!point.Implements.length) return []
            return getLstExt(item.Methods, point.Implements)
        },
    },
}
const MxOjClass = {
    methods: {
        getCsFormat(prp) {
            let acModify = prp[0]
            let name = prp[1]
            let txt = this.getAcModf(prp)
            if (isAbstract(acModify) && !prp[4]) return `${txt};\n`
            let returnType = prp[3]
            returnType = returnType.toLowerCase()
            if (returnType.includes('init')) {
                txt = `${acModify} ${name}`
            }
            return `${txt} {...}`
        },
        showCodeBody(ii, offI) {
            const item = this.item
            let clsName = this.FormatCode[0]
            let txtF = this.FormatCode[1]
            let txtFnc = `${txtF}\n`
            let lstPrp = [...item.Methods, ...this.ExtProperties]
            for (let jj = 0, txtP, prp; jj < lstPrp.length; jj++) {
                prp = lstPrp[jj]
                txtP = this.getCsFormat(prp); 
                txtP = `  ${convertSymb(txtP)}`
                if (jj - offI === ii) {
                    let pCode = prp[4]
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
                            txtP = txtP.replace(`{...}`, `{\n${pCode}\n  }`)
                        } else if (pCode == '/* empty */') {
                            txtP = txtP.replace(`{...}`, `{ ${pCode} }`)
                        } else {
                            txtP = txtP.replace(`{...}`, `{\n    ${pCode}\n  }`)
                        }
                    }
                } else if (txtP.includes(`{...}`)) {
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
            if (!tIds || !tIds.length) return []
            let parent = this.$root.ListClass.find(xx => tIds.includes(xx.id))
            if (!parent) return []
            return parent.Fields
        },
        FormatCode() {
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
                default: break;
            }
            let extds = this.ViewExtends
            let exnd = ''
            if (extds.length) {
                switch (ii) {
                    case 1:
                        exnd += extds[0][0]
                        exnd += ` ${extds[0][1]}`
                        break;
                    case 2:
                        exnd += extds[0].join(' ')
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
            if (!item.toIds || !item.toIds.length) return []
            const mPoints = this.$root.MpPoints
            if (!mPoints.has(item.id)) return []
            const point = mPoints.get(item.id)
            if (point.Extends.length + point.Implements.length < 1) return []
            let lst = getLstExt(item.Methods, point.Extends)
            let lst2 = getLstExt(item.Methods, point.Implements)
            for (let ii = 0; ii < lst2.length; ii++) {
                lst.push(lst2[ii])
            }
            return lst
        },
    },
   // beforeMount() {
       // const item = this.item
        //// extend Method_s
      //  let tIds = item.toIds
       // if (tIds && tIds.length) {
            // const lstCls = this.$root.ListClass
            // const prps = item.Methods
            // const lst = []
            // for (let ii = 0, xx; ii < lstCls.length; ii++) {
            //     xx = lstCls[ii]
            //     if (xx.id == item.id) continue   // it-self
            //     if (hasnMethod(xx)) continue;
            //     if (!tIds.includes(xx.id)) continue
            //     for (let jj = 0, prp, oPrp; jj < xx.Methods.length; jj++) {
            //         prp = xx.Methods[jj]
            //         oPrp = prps.find(pp => prp[1] == pp[1])
            //         if (oPrp && oPrp[0].includes('override')) continue
            //         if (xx.type.includes('instant')) continue
            //         lst.push(prp)
            //     }
            // }
            //const extendPrps = this.ExtProperties
            // for (let ii = lst.length - 1, prp; -1 < ii; ii--) {
            //     prp = lst[ii]
            //     if (extendPrps.find(pp => prp[1] == pp[1])) continue
            //     prps.unshift(JSON.parse(JSON.stringify(prp)))
            // }
       // }
   // },
}
const RectAbstract = {
    template: `#tmp-rect-class`,
    name: "Rect_Abstract",
    display: "Rect.Abstract",
    mixins: [MxRect, MxClsItf, MxOjClass],
    computed: {
        ClassName() {
            const item = this.item
            let clsName = item.Name
            return `abstract ${clsName}`
        },
    },
}
const RectClass = {
    template: `#tmp-rect-class`,
    name: "Rect_Insclass",
    display: "Rect.Insclass",
    mixins: [MxRect, MxClsItf, MxOjClass],
    computed: {
        ClassName() {
            const item = this.item
            let clsName = item.Name
            return clsName
        },
    },

}
const WrapRect = {
    template: `#tmp-wrap-rect`,
    name: "Rect_Wrap",
    display: "Rect.Wrap",
    props: ['item'],
    components: {
        'rect-interface': RectInterface,
        'rect-abstract': RectAbstract,
        'rect-class': RectClass,
        'rect-enum': RectEnum,
        'rect-struct': RectClass,
    },
    computed: {
        CompRect() {
            switch (this.item.type) {
                case StructTypes[0][0]:
                    return 'rect-interface'
                case StructTypes[1][0]:
                    return 'rect-abstract'
                case StructTypes[2][0]:
                    return 'rect-class'
                case StructTypes[3][0]:
                    return 'rect-enum'
                case StructTypes[4][0]:
                    return 'rect-struct'
                default: return null;
            }
        },
    },
}
export const ViewDiagram = {
    template: `#tmp-vw-diagram`,
    name: "View_Diagram",
    display: "View.Diagram",
    components: {
        'rect-wrap': WrapRect,
        'rect-class': RectClass,
        'menu-list': MenuList,
    },
    //inject: [''],

    // props: ['item'],
    data() {
        return {}
    },
    methods: {
        verifyLst(list, isDel) {
            if (isDel) {
                for (let ii = list.length - 1, item; - 1 < ii; ii--) {
                    item = list[ii]
                    if (isInterface(item.type)) delete item.Fields
                    else if (item.Methods && !item.Methods.length) delete item.Methods
                    else if (!item.Fields.length) delete item.Fields
                }
                return
            }
            for (let ii = list.length - 1, item; - 1 < ii; ii--) {
                item = list[ii]
                if (!item.Methods) item.Methods = []
                if (!item.Fields) item.Fields = []
            }
        },
        exportDiagram() {
            let lstCls = truncateIds(this.$root.ListClass)  // copy
            this.verifyLst(lstCls, true)
            let Name = this.$root.DiagName
            let entry = {
                Name,
                Classes: lstCls,
            }
            download(JSON.stringify(entry), `${Name.replaceAll(' ', '-')}.txt`, "text/plain");
        },
        importDiagram(event) {
            const file = event.target.files[0];
            const $root = this.$root
            $root.clearDyVar()
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
                $root.DiagName = entry.Name
                const lst = truncateIds(entry.Classes)    // copy
                this.verifyLst(lst)
                // #region verify name
                let lstNo = lst.map(x => x.Name)
                for (let ii = lst.length - 1, nItm; -1 < ii; ii--) {
                    nItm = lst[ii]
                    let vNm = verifyName(nItm.Name, lstNo)
                    if (nItm.Name !== vNm) {
                        nItm.Name = vNm
                        lstNo = lst.map(x => x.Name)
                    }
                }
                // #endregion

                $root.ListClass = lst
                $root.MpPoints.clear()
                for (let ii = lst.length - 1; -1 < ii; ii--) {
                    $root.buildMapPoints(lst[ii])   // import
                }
                $root.updateSizeCanvas()          // import
                $root.$nextTick($root.drawInCnvs) // import
                event.target.value = ''
            };
            reader.onerror = () => {
                showMessage("Error reading the file. Please try again.", "error");
            };
            reader.readAsText(file);
            function showMessage(txt) { alert(txt) }
        },
        onBlurEdit(e, type) {
            const target = e.target
            let txtC = target.textContent
            txtC = txtC.trim()
            if (!txtC.length) {
                target.innerHTML = this.$root.DiagName
                return
            }
            switch (type) {
                case 'diagram name':
                    this.$root.DiagName = verifyExportTxt(txtC)
                    break;
                default: break;
            }
        },
        onMouseDown(event) {
            const dmVar = this.$root.DynamicVar
            if (dmVar.has('DragElm')) return;
            if (dmVar.has('FrameCode')) return;
            dmVar.delete('FViewCode')
            let wrp = document.body.querySelector(`#dnb-vw-main`)
            if (!wrp) return
            document.addEventListener('keydown', this.$root.disableSrollDown)
            const off = this.$el.querySelector('#cls-sample').getBoundingClientRect()
            let x = this.$root.MinX
            let y = this.$root.MinY
            let left = off.left - x
            let top = off.top - y
            const id = 'cls-classname'
            const tpNwItem = objNewCls(null, id, top, left)
            this.$root.NewClassName = tpNwItem

            this.$root.DynamicVar.set('DragElm', {
                Item: tpNwItem,
                offX: left - event.clientX,
                offY: top - event.clientY
            })
            this.$nextTick(() => {
                const itemEl = wrp.querySelector(`#cls_${id}`)
                itemEl.style.zIndex = '1'
                itemEl.style.backgroundColor = 'white'
            })
        },
        changeLanguage(val) {
            this.$root.closePopupForm()
            const langs = this.$root.Langs
            for (let ii = 0; ii < langs.length; ii++) {
                if (langs[ii] == val) {
                    this.$root.PLang = ii
                    this.$root.updateSizeCanvas()               // change lang
                    this.$root.$nextTick(this.$root.drawInCnvs) // change lang

                    break;
                }
            }
        },
    },
    computed: {
        VwHeight() { return `calc(100vh - 18px - ${this.$root.MinY}px)` },
    },
}