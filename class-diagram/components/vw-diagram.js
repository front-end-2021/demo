import { setHeight, processLines } from "../common.js";
const MxRect = {
    props: ['item'],
    methods: {
        onMouseDown(event) {
            if (null !== this.$root.DragElm) return;
            const off = this.$el.getBoundingClientRect()
            let x = this.$root.MinX
            let y = this.$root.MinY
            this.$root.DragElm = {
                Item: this.item,
                offX: off.left - event.clientX - x,
                offY: off.top - event.clientY - y
            }
        },
        setWidth() {
            let w = this.item.width
            let cW = this.$el.offsetWidth
            cW = Math.ceil(cW)
            if (w != cW) {
                this.item.width = cW
                this.$root.drawLines(this.$root.getPoints())
                this.$root.updateLastArea()
            }
        },
        editObject() {
            const item = this.item
            // {id, type, Name, toIds, top, left, width, height, Fields, Properties }

            this.$root.FrameCode = {
                type: 2, item
            }
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
        this.setWidth()
    },
    updated() {
        this.setWidth()

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
        getProperty(prp) {
            let acModify = prp[0]
            acModify = acModify.replace(' override', '')
            acModify = acModify.replace(' virtual', '')
            acModify = acModify.replace(' abstract', '')
            let name = prp[1]
            let type = prp[2]
            let returnType = prp[3]
            returnType = returnType.toLowerCase()
            let txt = `${acModify} ${type} ${name}`
            if (returnType.includes('init')) txt = `${acModify} ${name}`
            else if (returnType.includes('get'))
                txt = `${acModify} ${name}: ${type}`
            return `${txt} {...}`
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
                    else if (pCode == 'abstract') pCode = ''
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
                this.$root.FrameCode = {
                    top, left, html, type: 1
                }
                this.$root.$nextTick(() => {
                    let vwFcode = document.body.querySelector(`#dnb-viewcode`)
                    if (vwFcode) {
                        let frmCode = this.$root.FrameCode
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

    },
    computed: {
        ClassName() {
            const item = this.item
            let clsName = item.Name
            switch (item.type) {
                case 'abstract class': return `abstract ${clsName}`
                case 'instant class': return clsName
                case 'interface': return clsName
                default: return '';
            }
        },
        FormCsFormat() {
            const item = this.item
            let clsName = item.Name
            switch (item.type) {
                case 'abstract class': clsName = `public abstract class ${clsName}`
                    break;
                case 'instant class': clsName = `public class ${clsName}`
                    break;
                case 'interface': clsName = `public interface ${clsName}`
                    break;
                default: break;
            }
            if (this.ExtendsView) clsName += `: ${this.ExtendsView}`
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
            let tIds = this.item.toIds
            if (!tIds || !tIds.length) return null
            let lstCls = this.$root.ListClass.filter(xx => tIds.includes(xx.id))
            lstCls = lstCls.map(xx => xx.Name)
            return `${lstCls.join(', ')}`
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

            this.$root.updateLastArea()
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