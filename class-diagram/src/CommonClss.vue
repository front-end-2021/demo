<template>
    <section class="wrp-cls">
        <div class="vwheader" style="min-height: 18px;">
            <slot name="menu" :mddnd="onMouseDown" :ckedt="editCls" :ckdel="deleteCls"></slot>
            <span class="headname" style="font-weight: bold;" @dblclick="e => onEditable(e, 'class name')"
                @keypress="e => $root.preventKeyPress(e, [13, 32])" @blur="e => onDoneEdit(e, 'class name')"
                @click="e => showCodeBody(-1989, -1989)">{{ ClassName }}</span>
            <span v-for="exv in ViewExtends" class="headextend">
                <small>{{ exv[0] }}&nbsp;</small><small>{{ exv[1] }}</small>
            </span>
        </div>
        <div v-if="0 < ExtendFields.length + item.Fields.length" class="vwfields">
            <i @click.stop="$root.clearDyVar" v-for="field in ExtendFields">
                <span>{{ vwVisible(field.AccessModify) }}&nbsp;{{ field.Name }}:&nbsp;</span>
                <small style="font-weight: bold;">{{ field.DataType }}</small>
            </i>
            <div v-for="field in item.Fields" @click.stop="e => clkField(field)">
                <span>{{ vwVisible(field.AccessModify) }}&nbsp;{{ field.Name }}:&nbsp;</span>
                <small style="font-weight: bold;">{{ field.DataType }}</small>
            </div>
        </div>
        <div class="vwprops">
            <div v-for="(prp, ii) in item.Properties" @click="e => showCodeBody(ii, 0)">
                <span style="padding-right: 6px;font-size: 12px;">{{ vwVisible(prp.AccessModify) }}</span>
                <span v-if="prp.DataType.length" style="font-size: 10px;padding-right: 6px;">{{ prp.DataType }}</span>
                <span @dblclick="e => onEditable(e, 'methd name')" @keypress="e => $root.preventKeyPress(e, [13, 32])"
                    @blur="e => onDoneEdit(e, 'methd name', ii)">{{ prp.Name }}</span>
                <span style="font-size: 10px;word-spacing: 0;">{{ propTostring(prp) }}</span>
            </div>
            <small v-for="(prp, ii) in ExtProperties" 
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
import { StructTypes, getPropKey } from "./common.js"
export default {    // class, abstract, interface
    props: ['item'],
    methods: {
        //onMouseDown() { }, editCls() { }, deleteCls() { }, showCodeBody() { },
        onEditable(e, type, ii) {
            const root = this.$root
            const dmVar = root.DynamicVar
            if (dmVar.has('FrameCode')) { return }
            root.closePopupForm()
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
        vwVisible(str) {
            let txt = str.trim()
            if (txt.includes('public')) return '+'
            if (txt.includes('private')) return '-'
            if (txt.includes('protected')) return '#'
            return ''
        },
        clkField(field) {
            const root = this.$root
            const dmVar = root.DynamicVar
            if (dmVar.has('FrameCode')) { return }
            root.clearDyVar()
        },
        propTostring(prp) { return getPropKey(prp) },
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
            dmVar.set('FViewCode', { top, left, html, type: 1 })
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
    },
    computed: {
        ClassName() { return this.item.Name },
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
        ExtendFields() { return [] },
        ExtProperties() { return [] },
    },
}
</script>
<style>
.vwprops { word-spacing: -6px; }
.vwfields {
    border-bottom: 1px solid black;
}
.vwprops, .vwfields {
    font-size: 14px; padding-left: 6px; padding-right: 6px;
    display: flex; flex-direction: column;
}
.vwfields>*, .vwprops>* {
    display: inline-block; width: fit-content;
}
</style>