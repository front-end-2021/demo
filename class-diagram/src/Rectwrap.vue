<template>
    <div :id="'cls_' + item.id" :w="item.width" :h="item.height" :x="item.left" :y="item.top" class="wrprect"
        :style="{ top: item.top + 'px', left: item.left + 'px', minWidth: item.width + 'px', height: item.height + 'px' }">
        <component v-bind:is="CompRect" :item="item">
            <template #menu="sPrp">
                <i class="bi bi-arrows-move cpoint ctlmove" style="left: 0;" @mousedown="sPrp.mddnd"></i>
                <i class="bi bi-pen cpoint ctledit" style="right:24px" @click.stop="e => sPrp.ckedt(item)"></i>
                <i class="bi bi-x-lg cpoint ctledit" style="right: 0;" @click.stop="e => sPrp.ckdel(item)"></i>
            </template>
        </component>
    </div>
</template>
<script>
import { isAbstract, isInterface, isClass, isEnum, isStruct } from './Appmixin.js';
import RectInterface from './Rectinterface.vue';
import RectAbstract from './Rectabstract.vue';
import RectClass from './Rectclass.vue';
import RectEnum from './Rectenum.vue';
export default {
    name: "Rect_Wrap",
    display: "Rect.Wrap",
    props: ['item'],
    components: {
        'rect-interface': RectInterface,
        'rect-abstract': RectAbstract,
        'rect-enum': RectEnum,
        'rect-class': RectClass,
    },
    computed: {
        CompRect() {
            const type = this.item.TypeDeclaration
            if (isInterface(type)) return 'rect-interface'
            if (isAbstract(type)) return 'rect-abstract'
            if (isEnum(type)) return 'rect-enum'
            if (isClass(type)) return 'rect-class'
            if (isStruct(type)) return 'rect-class'
            return null;
        },
    },
}
</script>
<style>
.wrprect {
    display: inline-block;
    border: 1px solid rgb(0, 0, 0);
    position: inherit;
    cursor: default;
    border-radius: 4px;
}
</style>