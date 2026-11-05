<template>
    <div class="wrapcell posabsolute a" :class="['w' + y]" :style="[{
        width: Size + 'px', height: Size + 'px',
        top: top + 'px', left: left + 'px',
        borderLeft: 0 < x ? '1px solid black' : '',
        border: $root.SelectId == id ? '3px solid white' : '',
        opacity: -1 == id ? 0.01 : 1, transition: trans,
        zIndex: Zindex,
    }, StyleBgImg, StyleBgMode]" :data-testid="id" @click.stop="onSelect" @pointerdown.stop="onPointerDown"
        @pointerup.stop="onPointerUp" @pointercancel.stop="onPointerCancel"></div>
</template>
<style>
.w-1 {
    border: none;
}
</style>
<style scoped>
.a {
    touch-action: none;
    user-select: none;
}
</style>
<script>
export default {
    name: "Cell",
    display: "Cell",
    props: ['x', 'y', 'id'],
    data() {
        return {
            suppressClick: false,
            top: 0, left: 0, 
        }
    },
    computed: {
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
        Size() { return this.$root.Size },
        trans() {
            const time = this.$root.TimeMoving
            return `top ${time}ms, left ${time}ms`
        },
        Zindex() {
            const root = this.$root;
            if (root.SelectId == this.id) return '3'
            const source = root.DragNode;
            if (source && source.id == this.id) return '3'
            return
        },
    },
    methods: {
        onPointerDown(evt) {
            const root = this.$root;
            if (root.CellMoving) { return }
            const id = this.id, x = this.x, y = this.y
            if (evt.button !== 0 || id === -1 || root.GameStats === 'Completed') return;
            root.DragNode = { id, x, y, pointerId: evt.pointerId };
            this.suppressClick = false; 
        },
        onPointerUp(evt) {
            const root = this.$root;
            if (root.CellMoving) { return }
            const source = root.DragNode;
            if (!source || source.pointerId !== evt.pointerId) return;
            const id = this.id, x = this.x, y = this.y
            const moved = source.x !== x || source.y !== y;
            if (moved && id === -1) {
                const adjacent = Math.abs(source.x - x) + Math.abs(source.y - y) === 1;
                if (adjacent && source.y >= 0 && y >= 0) {
                    root.moveTileToBlank(source, { x, y });
                    this.suppressClick = true;
                }
            }
            root.DragNode = null
        },
        onPointerCancel() { this.$root.DragNode = null },
        onSelect() {
            const root = this.$root
            if (root.CellMoving) { return }
            //  console.log('onSelect', this.id, this.x, this.y)
            if (this.suppressClick) {
                this.suppressClick = false;
                return;
            }
            let countSolved = root.GameStats
            if ('Completed' == countSolved) return;

            let idSelecting = root.SelectId
            const setSelect = (id) => { root.SelectId = id }
            if (idSelecting < 0 && this.id < 0) { setSelect(this.id); return }
            if (idSelecting == this.id) { setSelect(-2); return }
            if (-1 < idSelecting) {
                if (-1 < this.id) { setSelect(this.id); return }
                // des blank
                let src = root.MpIdXy.get(idSelecting)
                let dest = this
                const blankId = dest.id
                let dx = dest.x - src.x
                let dy = dest.y - src.y
                const isDiagonal = 0 != dx && 0 != dy
                const is2X = 1 < Math.abs(dx)
                const is2Y = 1 < Math.abs(dy)
                if (isDiagonal || is2X || is2Y) {
                    setSelect(-2)
                    return
                }
                const dsx = dest.x, dsy = dest.y
                const srcx = src.x, srcy = src.y

                src.left = root.genLeft(dest.x)
                src.top = root.genTop(dest.y)
                root.CellMoving = true
                setTimeout(() => {
                    let grid = root.Grid
                    if (srcy < 0 || dsy < 0) {
                        let id0 = grid[0][0]
                        grid[0][0] = root.ZeroId
                        root.ZeroId = id0
                    } else {
                        root.logMoves([srcx, srcy], [dsx, dsy])
                        grid[srcy][srcx] = blankId
                        grid[dsy][dsx] = idSelecting
                    }
                    root.GameStats = root.checkGameStat(grid, countSolved)
                    setSelect(-2)
                    root.CellMoving = false
                }, root.TimeMoving)
            } else {
                setSelect(this.id)
            }
        },
        initX() { this.left = this.$root.genLeft(this.x) },
        initY() { this.top = this.$root.genTop(this.y) },
    },
    created() {
        this.initX()
        this.initY()
        this.$root.MpIdXy.set(this.id, this)
    },
    watch: {
        x() { this.initX() },
        y() { this.initY() },
    },
}
</script>