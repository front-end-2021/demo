const mxVisible = {
    data() {
        return {
            Isvisible: true,
        }
    },
    methods: {
        visibleChanged(isVisible, entry) {
            this.Isvisible = isVisible
            // console.log('is visible:', isVisible, 'intersection:', Math.round(entry.intersectionRatio * 100) + '%')
        },
        styleSize() {
            const stl = getComputedStyle(this.$el)
            this.$el.style.width = `${stl.width}`
            this.$el.style.height = `${stl.height}`
        },
    },
    mounted() {
        this.styleSize()
    }
}
Vue.component('mf-vactivity', {
    mixins: [mxVisible],
    props: ['item'],
})
const mxExpand = {
    data() {
        return {
            IsExpand: true
        }
    },
    methods: {
        toggleExpand() {
            this.IsExpand = !this.IsExpand
            if (this.IsExpand) {
                this.$nextTick(() => {
                    const stl = getComputedStyle(this.$el)
                    this.$el.style.width = `${stl.width}`
                    this.$el.style.height = `${stl.height}`
                })
            } else {
                this.$el.style.width = ''
                this.$el.style.height = ''
            }
        },
    },
}
Vue.component('mf-viewgoal', {
    name: 'DnbViewGoal',
    mixins: [mxVisible, mxExpand],
    props: ['entry'],
    //beforeCreate(){ },
    computed: {
        Start() {
            const start = this.entry.Item.Start
            if (typeof start != 'string') return ''
            if (start.trim() == '') return ''
            return getDateStr(start, 'dd/MM/YYYY')
        },
        End() {
            const end = this.entry.Item.End
            if (typeof end != 'string') return ''
            if (end.trim() == '') return ''
            return getDateStr(end, 'dd/MM/YYYY')
        },
    },
    watch: {
        'entry.Item.Finish'(val, old) {
            if (val && !this.entry.End) {
                setStartEndNow.call(this, true)
            }
        },
    },
    // created() { },
    //beforeMount() { },
    //mounted() { },
    //beforeUpdate() { },
    //updated(){ },
    //beforeDestroy() { },
    //destroyed() { },
})
Vue.component('mf-vproduct', {
    name: 'DnbViewProduct',
    mixins: [mxVisible, mxExpand],
    props: ['prduct'],
    data() {
        return {
            Isvisible: false,
            disabled: false,
        }
    },
    methods: {
        visibleChanged(isVisible, entry) {
            this.Isvisible = isVisible
            if (isVisible) {
                this.$el.style.width = ''
                this.$el.style.height = ''
                this.disabled = true
            } else {
                this.$nextTick(this.styleSize)
            }
        },
    },
})