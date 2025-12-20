<script>
import { StructTypes, getLstExt } from "./common.js";
import CommonClss from './CommonClss.vue';
import { MxRect } from './Appmixin.js';
export default {
    name: "Rect_Interface",
    display: "Rect.Interface",
    mixins: [CommonClss, MxRect],
    methods: {
        getCsFormat(prp) { return `${this.getAcModf(prp)};\n` },
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
                txtP = this.getCsFormat(prp)
                txtP = `  ${txtP}`
                txtFnc += `${txtP}\n`
            }
            let txt = `${clsName}${txtFnc}}`
            this.setFragViewCode(txt)
        },
    },
    computed: {
        FormatCode() {
            const item = this.item
            let clsName = item.Name
            const ii = this.$root.PLang
            clsName = `public ${StructTypes[0][ii]} ${clsName}`
            let extds = this.ViewExtends
            let exnd = ''
            if (extds.length) {
                switch (ii) {
                    case 1: exnd = extds.join(' ')
                        break;
                    case 2: exnd = extds[0].join(' ')
                        if (1 < extds.length) exnd += extds[1].join(' ')
                        break;
                    default: break;
                }
                clsName += exnd
            }
            clsName = `${clsName}\n{\n`
            return [clsName, '']
        },
        ExtProperties() {
            const item = this.item
            if (!item.toIds.length) return []
            const mPoints = this.$root.MpPoints
            if (!mPoints.has(item.id)) return []
            const point = mPoints.get(item.id)
            if (!point.Implements.length) return []
            return getLstExt(item.Properties, point.Implements)
        },
    },
}
</script>