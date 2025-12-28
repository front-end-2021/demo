<template>
    <section class="wrp-enum">
        <div class="vwheader">
            <slot name="menu" :mddnd="onMouseDown" :ckedt="editCls" :ckdel="deleteCls"></slot>
            <span class="headname" style="font-weight: bold;">enum {{ item.Name }}</span>
        </div>
        <div class="vwfields">
            <div style="font-size: 16px; font-weight: 300;padding: 0 6px;">{{ TxtField }}</div>
        </div>
    </section>
</template>
<script>
import { MxRect } from './Appmixin.js';
export default {
    name: "Rect_Enum",
    display: "Rect.Enum",
    mixins: [MxRect],
    computed: {
        TxtField() { return this.item.Fields.map(x => x.Name).join(', ') },
    },
}
</script>