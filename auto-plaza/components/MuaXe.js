const KhuvucHangxeNamsx = {
    template: `#tmp-khuvuc-hangxe-namsx`,
    data() {
        const lsRegion = []
        for (let ii = 0; ii < 10; ii++) {
            lsRegion.push(this.$root.LsRegion[ii])
        }
        const lsBrand = []
        for (let ii = 0; ii < 7; ii++) {
            lsBrand.push(this.$root.LsBrand[ii])
        }
        const lsYear = []
        for (let ii = 0; ii < 10; ii++) {
            lsYear.push(this.$root.LsYear[ii])
        }
        return {
            IsExpand: true,
            LsRegion: lsRegion,
            LsBrand: lsBrand,
            LsYear: lsYear,
        }
    },
    methods: {
        selectIndex(ii, type){
            switch(type) {
                case 1: this.$root.IndexRegion = ii
                    break;
                case 2: this.$root.IndexBrand = ii
                    break;
                case 3: this.$root.IndexYear = ii
                    break;
                default: return;
            }
        },
        watchMore(type) {
            switch(type) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                default: return;
            }
        },
        styleWidths() {
            let lsWrap = []
            let maxW = 0
            this.$el.querySelectorAll('.wrap-local').forEach(wr => {
                lsWrap.push(wr)
                if (maxW < wr.offsetWidth) maxW = wr.offsetWidth
            })
            lsWrap.forEach(wr => {
                if (wr.offsetWidth < maxW) {
                    wr.style.width = `${maxW}px`
                }
            })

        },
    },
    mounted() {
       // this.$nextTick(this.styleWidths)
    },
}
export default {
    template: `#tmp-mua-xe`,
    components: {
        'khuvuc-hangxe-namsx': KhuvucHangxeNamsx,
        //draggable: VueDraggableNext,
    },
}