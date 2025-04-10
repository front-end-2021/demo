const InfoXe = {
    template: `#tmp-info-xe`,
    name: 'info.xe',
    props: ['xe'],
    data() {
        return {
            ShowBrand: true,
            ShowLocal: true,
        }
    },
    watch: {
        '$root.IndexBrand'(ii) {
            if (ii < 0) {
                this.ShowBrand = true
            } else {
                let hangXe = this.$root.LsBrand[ii]
                this.ShowBrand = this.xe.HangXe.toLowerCase() == hangXe[0].toLowerCase()
            }
        },
        '$root.IndexRegion'(ii) {
            if (ii < 0) {
                this.ShowLocal = true
            } else {
                let local = this.$root.LsRegion[ii]
                this.ShowLocal = this.xe.Location.toLowerCase() == local.toLowerCase()
            }
        },
    },
}
const KhuvucHangxeNamsx = {
    template: `#tmp-khuvuc-hangxe-namsx`,
    name: 'khuvuc.hangxe.namsx',
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
        selectIndex(ii, type) {
            const root = this.$root
            switch (type) {
                case 1: root.IndexRegion = ii
                    break;
                case 2: root.IndexBrand = ii
                    break;
                case 3: root.IndexYear = ii
                    break;
                default: return;
            }
        },
        watchMore(type) {
            switch (type) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                default: return;
            }
        },
    },
    computed: {
        TxtKhuVuc() {
            if (this.IsExpand) return
            let ii = this.$root.IndexRegion
            if (ii < 0) return 'Tất cả'
            return this.$root.LsRegion[ii]
        },
        TxtHangXe() {
            if (this.IsExpand) return
            let ii = this.$root.IndexBrand
            if (ii < 0) return 'Tất cả'
            return this.$root.LsBrand[ii][0]
        },
        TxtNamSx() {
            if (this.IsExpand) return
            let ii = this.$root.IndexYear
            if (ii < 0) return 'Tất cả'
            return this.$root.LsYear[ii]
        },
    },
}
export default {
    template: `#tmp-mua-xe`,
    components: {
        'khuvuc-hangxe-namsx': KhuvucHangxeNamsx,
        'info-xe': InfoXe,
        //draggable: VueDraggableNext,
    },
}