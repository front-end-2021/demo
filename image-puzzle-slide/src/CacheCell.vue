<template>
    <div class="wrapcell chcell" 
    style="transition: margin-top 0.09s, margin-left 0.09s; margin-top: 0; margin-left: 0;opacity: 0.6;"
        v-bind:style="[{
            width: $root.Size + 'px',
            height: $root.Size + 'px',
            top: (y * $root.Size + $root.Size) + 'px',
            left: (x * $root.Size) + 'px',
            borderLeft: 0 < x ? '1px solid black' : ''
        }, StyleBgImg]"></div>
</template>
<script>
export default {
    name: "Cache.Cell",
    display: "Cache.Cell",
    props: ['x', 'y', 'id'],
    computed: {
        StyleBgImg() {
            const root = this.$root
            const id = this.id
            if (!root.mImgIndex.has(id)) return null
            let src = root.mImgIndex.get(id)
            return { backgroundImage: `url(${src})` }
        },
    },
    beforeMount() { this.$root.CopTitles.set(this.id, this) },
    beforeUnmount() { this.$root.CopTitles.delete(this.id) },
}
</script>