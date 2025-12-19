<template>
    <section class="wrp-cls">
        <div class="vwheader" style="min-height: 18px;">
            <slot name="menu" :mddnd="onMouseDown" :ckedt="editCls" :ckdel="deleteCls"></slot>
            <span style="font-weight: bold;" @dblclick="e => onEditable(e, 'class name')"
                @keypress="e => $root.preventKeyPress(e, [13, 32])" @blur="e => onDoneEdit(e, 'class name')"
                @click="e => showCodeBody(-1989, -1989)">{{ ClassName }}</span>
            <span v-for="exv in ViewExtends">
                <small>{{ exv[0] }}&nbsp;</small><small>{{ exv[1] }}</small>
            </span>
        </div>
        <div v-if="0 < ExtendFields.length + item.Fields.length"
            style="font-size: 14px; border-bottom: 1px solid black;">
            <i @click.stop="$root.clearDyVar" style="display: block;" v-for="field in ExtendFields">
                <span>&nbsp;{{ vwVisible(field.AccessModify) }}&nbsp;{{ field.Name }}:&nbsp;</span>
                <small style="font-weight: bold;">{{ field.DataType }}</small>
            </i>
            <div v-for="field in item.Fields" @click.stop="e => clkField(field)">
                <span>&nbsp;{{ vwVisible(field.AccessModify) }}&nbsp;{{ field.Name }}:&nbsp;</span>
                <small style="font-weight: bold;">{{ field.DataType }}</small>
            </div>
        </div>
        <div style="font-size: 14px;padding-right: 6px;padding-left: 6px;word-spacing: -6px;">
            <div v-for="(prp, ii) in item.Properties" @click="e => showCodeBody(ii, 0)">
                <span style="padding-right: 6px;font-size: 12px;">{{ vwVisible(prp.AccessModify) }}</span>
                <span style="font-size: 10px;padding-right: 6px;">{{ prp.DataType }}</span>
                <span @dblclick="e => onEditable(e, 'methd name')" @keypress="e => $root.preventKeyPress(e, [13, 32])"
                    @blur="e => onDoneEdit(e, 'methd name', ii)">{{ prp.Name }}</span>
                <span style="font-size: 10px;word-spacing: 0;">{{ propTostring(prp) }}</span>
            </div>
            <small v-for="(prp, ii) in ExtProperties" style="display: block;"
                @click.stop="e => showCodeBody(ii, item.Properties.length)">
                <i style="padding-right: 6px;font-size: 12px;">{{ vwVisible(prp.AccessModify) }}</i>
                <i style="padding-right: 6px;font-size: 10px;">{{ prp.DataType }}</i>
                <i style="padding-right: 0;">{{ prp.Name }}</i>
                <i style="font-size: 10px;word-spacing: 0;">{{ propTostring(prp) }}</i>
            </small>
        </div>
    </section>
</template>
<script>
import { StructTypes, getLstExt } from "./common.js";
import { MxRect, MxClsItf } from './Appmixin.js';
export default {
    name: "Rect_Interface",
    display: "Rect.Interface",
    mixins: [MxRect, MxClsItf],
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
        ClassName() { return this.item.Name },
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
        ExtendFields() { return [] },
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