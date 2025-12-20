<template>
    <!-- <div class="wrap-mnlist" :style="[ListSrc.length ? { minWidth: '82px' } : null]"> -->
    <div class="wrap-mnlist" :style="{ minWidth: ListSrc.length ? '82px' : '69px' }">
        <span v-if="!ListSrc.length" @click="openLstSrc">{{ value }}</span>
        <div v-else class="dnb-mnlst">
            <span v-for="acs in ListSrc" class="p36 itmmnls" @click.stop="e => changeValue(acs)" :style="[acs == this.value ? {
                backgroundColor: '#dbdbdb'
            } : null]">{{ acs }}</span>
            <span>
            </span>
        </div>
    </div>
</template>
<script>
export default {
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
        emptySrc() { this.ListSrc = [] },
        changeValue(val) {
            if (this.value != val) this.$emit('change:value', val)
            document.removeEventListener('click', this.$root.closePMenu)
            this.emptySrc()
            const dmVar = this.$root.DynamicVar
            dmVar.delete('PopMenu')
        },
    },
}
</script>