<template>
    <h6 class="wrp-drpsearch">
        <div class="drps-wrap">
            <input type="text" placeholder="typing to search by name..."
                style="width: calc(100% - 10px);border-color: transparent;height: 20px;" v-model="TxtSearch"
                @input="inSearch" />
            <div class="dr_lst-wrap" style="max-height: 120px; overflow: auto;">
                <div v-for="item in ListSrc" class="itmdrp" :key="item.id" :style="[bgSelect(item)]">
                    <span @click.stop="e => selectItem(item)">{{ item.Name }}</span>
                    <i class="bi bi-x" @click.stop="e => removeItem(item)"></i>
                </div>
            </div>
            <i class="bi bi-x-lg cpoint extdrp" @click.stop="e => $emit('on:exit')"></i>
        </div>
    </h6>
</template>
<script>
export default {
    name: "Drop_Search",
    display: "Drop.Search",
    props: ['ids', 'sources', 'type'],
    emits: ['select:id', 'remove:id', 'on:exit'],
    data() {
        return {
            TxtSearch: '',
            ListSrc: this.sources
        }
    },
    mounted() { document.addEventListener('keyup', this.pressEscKey) },
    methods: {
        bgSelect(item) {
            if (this.ids.includes(item.id)) return { backgroundColor: '#d1d1d1' }
        },
        inSearch(e) {
            const target = e.target
            let str = target.value
            str = str.trim()
            this.ListSrc = this.getLstSrc(str)
        },
        getLstSrc(str, sources) {
            if (!sources) sources = this.sources
            if (typeof str != 'string') return sources
            if (!str.length) return sources
            const lst = []
            for (let ii = 0, src, name; ii < this.sources.length; ii++) {
                src = this.sources[ii]
                name = src.Name
                name = name.toLowerCase()
                if (name.includes(str)) lst.push(src)
            }
            return lst
        },
        selectItem(item) { this.$emit('select:id', item.id) },
        removeItem(item) { this.$emit('remove:id', item.id) },
        pressEscKey(event) { if ('Escape' == event.key) { this.$emit('on:exit') } },
    },
    beforeUnmount() { document.removeEventListener('keyup', this.pressEscKey) },
    watch: {
        sources(vals) { this.ListSrc = this.getLstSrc(this.TxtSearch, vals) },
    },
}
</script>
<style>
.dr_lst-wrap {
    scrollbar-width: thin;
}

.dr_lst-wrap>*:hover {
    background-color: #efefef;
}
</style>