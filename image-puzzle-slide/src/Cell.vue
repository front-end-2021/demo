<template>
    <div class="wrapcell" v-bind:class="'w' + y" v-bind:style="[{
        width: $root.Size + 'px',
        height: $root.Size + 'px',
        top: (y * $root.Size + $root.Size) + 'px',
        left: (x * $root.Size) + 'px',
        backgroundColor: BgSelect,
        borderLeft: 0 < x ? '1px solid black' : '',
        opacity: -1 == id ? 0.01 : 1,
    }, StyleBgImg, StyleBgMode]" @click.stop="onSelect"></div>
</template>
<style>
.wrapcell {
    border-top: 1px solid #999999;
    box-sizing: border-box;
    position: absolute;
    cursor: default;
}

.w-1 {
    border: none;
}
</style>
<script>
export default {
    name: "Cell",
    display: "Cell",
    props: ['x', 'y', 'id'],
    //data() { return { } },
    computed: {
        BgSelect() {
            const root = this.$root
            if ('Completed' == root.GameStats && -1 < this.y) return 'white'
            if (null == root.ActiveNode) return '#e9e9e9'
            if (this.id == root.ActiveNode.id) return '#505050bf'
            return 'white'
        },
        StyleBgImg() {
            const root = this.$root
            const id = this.id
            if (!root.mImgIndex.has(id)) return null
            let src = root.mImgIndex.get(id)
            return { backgroundImage: `url(${src})` }
        },
        StyleBgMode() {
            const root = this.$root
            if ('Completed' == root.GameStats) return null
            return { backgroundBlendMode: 'multiply' }
        },
    },
    methods: {
        async onSelect() {
            const root = this.$root
            let countSolved = root.GameStats
            if ('Completed' == countSolved) return;
            let obj = root.genActvNode('get')
            if (obj && this.id == obj.id) {
                clearANode() // it-self or empty
                return
            }
            if (obj && -1 == this.id) {
                if (!obj.ArrNear.has(-1)) {
                    clearANode()
                    return
                }
                let neiTitle = root.CopTitles.values().next().value
                const neiStyle = neiTitle.$el.style
                if (neiTitle.x == this.x) {
                    if (neiTitle.y < this.y) { neiStyle.marginTop = `${root.Size}px` }
                    else { neiStyle.marginTop = `-${root.Size}px` }
                }
                if (neiTitle.y == this.y) {
                    if (neiTitle.x < this.x) { neiStyle.marginLeft = `${root.Size}px` }
                    else { neiStyle.marginLeft = `-${root.Size}px` }
                }
                setTimeout(() => {
                    let ids = new Set([this.id, obj.id])
                    if (1 < ids.size && ids.has(root.BlankPoint) && obj.ArrNear.has(this.id)) {
                        let grid = root.Grid
                        if (obj.y < 0 || this.y < 0) {
                            let id0 = grid[0][0]
                            grid[0][0] = root.ZeroId
                            root.ZeroId = id0
                        } else {
                            let node1 = grid[obj.y][obj.x]
                            grid[obj.y][obj.x] = grid[this.y][this.x]
                            grid[this.y][this.x] = node1
                        }

                        root.GameStats = root.checkGameStat(grid, countSolved)
                        root.Grid = [...grid]
                        clearANode()
                    }
                }, 102)
            } else if (-1 != this.id) {
                root.genActvNode('set', this)
                if (root.ActiveNode.ArrNear.has(-1)) {
                    root.SlideTitles = [{
                        id: this.id,
                        x: this.x,
                        y: this.y,
                    }]
                } else {
                    root.SlideTitles = []
                }
            }
            function clearANode() {
                root.ActiveNode = null
                root.CopTitles.clear()
                root.SlideTitles = []
            }
        },
    },
    //created(){ },
}
</script>