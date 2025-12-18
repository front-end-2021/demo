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
import { MxRect, MxOjClass, MxClsItf } from './Appmixin.js';
export default {
    name: "Rect_Abstract",
    display: "Rect.Abstract",
    mixins: [MxRect, MxClsItf, MxOjClass],
    computed: {
        ClassName() { return `abstract ${this.item.Name}` },
    },
}
</script>