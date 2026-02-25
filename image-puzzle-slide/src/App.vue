<script>
//import CryptoJS from 'crypto-js'
import Cell from './Cell.vue';
import CacheCell from './CacheCell.vue';
import SlidingPuzzle from './ImagePuzzle.js'
import Settings from './Settings.vue'

export default {
    name: 'DaiNb.vApp',
    components: {
        'cell-node': Cell,
        'cache-cell': CacheCell,
        'settings-panel': Settings,
    },
    data() {
        return {
            Size: 150,
            Cols: 3,
            Rows: 4,
            ActiveNode: null,
            Level: 1,
            Grid: [],
            ZeroId: 0,
            GameStats: 'Get Start',
            mImgIndex: new Map(),
            ImgSrc: 'https://m.media-amazon.com/images/M/MV5BNmFiM2FkYTYtY2FiOS00ZWJkLTkyOTgtNmFmODI4NjcwNDgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            SlideTitles: [],
            CopTitles: new Map(),
            TempObj: null,
        }
    },
    computed: {
        BoardWidth() { return this.Cols * this.Size },
        BaordHeight() { return this.Rows * this.Size },
        BlankPoint() { return -1 },
        StyleThumb() {
            const size = this.Size
            let width = this.BoardWidth / this.Rows * 0.96
            let height = size * 0.96
            let left = this.BoardWidth - 8 - width
            if ('Completed' != this.GameStats) return {
                width: `${width}px`,
                height: `${height}px`,
                left: `${left}px`
            }
            left = (size - width) / 2
            return {
                width: `${width}px`,
                height: `${height}px`,
                left: `${left}px`
            }
        },
    },
    methods: {
        rejectGame() {
            this.Grid = []
            this.ZeroId = 0
            this.GameStats = 'Get Start'
        },
        startGame() {
            this.ActiveNode = null
            let puzzle = new SlidingPuzzle(this.Rows, this.Cols, this.BlankPoint);
            let level = this.Level
            if (level < 1) level = 1
            this.Grid = puzzle.scramble(level * 33);
            this.ZeroId = 0
            this.GameStats = 0
        },
        genActvNode(type = 'set', node) {
            let obj = this.ActiveNode
            if ('set' == type) {
                const neibours = getNeibours.call(this, node.x, node.y)
                obj = {
                    id: node.id, x: node.x, y: node.y,
                    ArrNear: neibours
                }
            }
            if ('get' == type) return obj
            this.ActiveNode = obj

            function getNeibours(iix, iiy) {
                const grid = this.Grid
                if (iiy < 0) {
                    if (this.BlankPoint == grid[0][0]) return new Set([-1])
                    return new Set([grid[0][0]])
                }
                let ls = [
                    [iix - 1, iiy], [iix + 1, iiy], [iix, iiy - 1], [iix, iiy + 1]
                ]
                ls = ls.filter(p => 0 <= p[0] && 0 <= p[1])
                ls = ls.filter(p => p[0] < this.Cols && p[1] < this.Rows)

                let set = new Set(ls.map(([x, y]) => grid[y][x]))
                if (0 == iix && 0 == iiy) {
                    if (0 == grid[0][0]) {
                        set.add(-1)
                        set.delete(0)
                    } else if (this.BlankPoint == grid[0][0]) {
                        set.delete(-1)
                        set.add(0)
                    }
                }
                return set
            }
        },
        checkGameStat(grid, count = 0) {
            let index = 0
            for (let row of grid) {
                for (let id of row) {
                    if (index != id) return count + 1
                    index++
                }
            }
            return 'Completed'
        },
        async splitImage(event) {
            const file = event.target.files[0];
            if (!file) return;
            const root = this
            const rows = root.Rows // số hàng
            const cols = root.Cols // số cột
            let tileSize = root.Size
            let _width = cols * tileSize
            let _height = rows * tileSize

            const imgURL = URL.createObjectURL(file);
            const img = new Image();
            img.onload = (evt) => {
                let resizedCanvas = root.resizeImage(img, _width, _height);
                root.ImgSrc = resizedCanvas.toDataURL('image/jpeg')
                URL.revokeObjectURL(imgURL);
            }
            img.src = imgURL;
        },
        resizeImage(image, maxWidth, maxHeight) {
            const canvas = document.createElement('canvas');
            canvas.width = maxWidth;
            canvas.height = maxHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, maxWidth, maxHeight); // Draw the resized image onto the canvas
            return canvas;
        },
        async imageReady(e) {
            let img = e.target
            img.crossOrigin = "anonymous";
            this.fillImgTitles(img)
        },
        onChangeSize() {
            const bodyMargin = 2 * 6
            const viewW = window.innerWidth - 2 - bodyMargin
            const viewH = window.innerHeight - bodyMargin - 30 - 57
            let maxW = viewH, maxH = viewW
            if (viewW < viewH) {
                maxW = viewW
                maxH = viewH
            }
            let width = 450
            if (maxW < width) width = maxW
            let height = 750
            if (maxH < height) height = maxH

            let size1 = Math.floor(width / this.Cols)
            let size2 = Math.floor(height / (this.Rows + 1))
            this.Size = Math.min(size1, size2)
        },
        onClkGear(e) {
            let temp = this.TempObj
            if (!temp) {
                temp = {
                    type: 'settings',
                }

                this.TempObj = temp
            }
        },
        fillImgTitles(img) {
            const root = this
            const rows = root.Rows // số hàng
            const cols = root.Cols // số cột
            let tileSize = root.Size
            let _width = cols * tileSize
            let _height = rows * tileSize
            let id = 0
            let resizedCanvas = root.resizeImage(img, _width, _height);
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    let canvas = document.createElement('canvas');
                    canvas.width = tileSize;
                    canvas.height = tileSize;
                    let ctx = canvas.getContext('2d');
                    // Cắt phần ảnh tương ứng
                    ctx.drawImage(
                        resizedCanvas,
                        c * tileSize, r * tileSize, tileSize, tileSize, // vùng nguồn (src)
                        0, 0, tileSize, tileSize                        // vùng đích (dest)
                    );
                    let src = canvas.toDataURL('image/jpeg')
                    root.mImgIndex.set(id++, src)
                }
            }
        },
    },
    watch: {
        //GameStats(stat) { },
    },
    created() {
        this.onChangeSize()
    },
    //beforeMount() {  },
    //mounted() { },
    //beforeUpdate() { },
    //updated() { },
    //beforeUnmout(){},
    //unmouted(){}
};
</script>
<template>
    <div class="h24 inline-flex vcenter" style="justify-content: space-between;margin-bottom: 6px;"
        v-bind:style="{ width: (BoardWidth) + 'px' }">
        <strong v-if="typeof GameStats == 'number'">Your moves: {{ GameStats }}</strong>
        <strong v-else>Game status: {{ GameStats }}</strong>
        <span class="w24 h24 inline-flex vcenter hcenter" @click.stop="onClkGear">
            <i v-if="TempObj != null && TempObj.type == 'settings'" class="bi bi-gear-fill"></i>
            <i v-else class="bi bi-gear"></i>
        </span>
    </div>
    <section>
        <div class="posrelative flex">
            <div class="posrelative wrapboard" v-bind:style="{
                width: (Cols * Size) + 'px',
                height: (Rows * Size + Size) + 'px'
            }">
                <div class="posabsolute" style="top: 6px;" v-bind:style="{
                    left: (Size + 6) + 'px',
                }">
                    <div>Grid: {{ Cols }} x {{ Rows }}</div>
                    <div>Level: {{ Level }}</div>
                </div>

                <cache-cell v-for="cell in SlideTitles" :key="'s' + cell.id" :id="cell.id" :x="cell.x"
                    :y="cell.y"></cache-cell>
                <cell-node v-if="Grid.length" :id="ZeroId" :x="0" :y="-1"></cell-node>
                <template v-for="(row, y) in Grid">
                    <cell-node v-for="(id, x) in row" :key="id" :id="id" :x="x" :y="y"></cell-node>
                </template>
                <div class="thumb posabsolute" :style="StyleThumb">
                    <img :src="ImgSrc" id="dnbPicQuest" style="width: inherit; height: inherit;" @load="imageReady">
                </div>
            </div>
            <div v-if="!Grid.length" class="posabsolute wrapboardguide" 
                v-bind:style="{
                    width: (Cols * Size) + 'px',
                    height: (Rows * Size) + 'px',
                    top: (Size + 1) + 'px',
                }">
                <div v-for="r in Rows" class="flex wrprow">
                    <div v-for="c in Cols" class="wrpguide"
                        v-bind:style="{
                            width: (Size) + 'px', height: (Size-1) + 'px',
                        }"></div>
                </div>
            </div>
        </div>
    </section>
    <div class="vcenter" style="margin-top: 12px; display: flex; gap: 10px;justify-content: space-between;"
        v-bind:style="{ width: (BoardWidth) + 'px' }">
        <div class="inline-flex vcenter" style="gap: 10px;">
            <span v-if="Grid.length < 1 || 'Completed' == GameStats" class="btn_" @click.stop="startGame">Start
                game</span>
            <span v-else class="btn_" @click.stop="rejectGame">Reject</span>

            <div class="btn_">
                <label for="fileInput">Upload image</label>
                <input type="file" id="fileInput" accept="image/*" @change="splitImage" style="display:none;" />
            </div>
        </div>
    </div>
    <settings-panel v-if="TempObj != null && TempObj.type == 'settings'" :entry="TempObj"></settings-panel>
</template>
<style>
body {
    scrollbar-width: thin;
}
.wrapboard {
    border: 1px solid #959595; border-radius: 2px;
}
.wrapboardguide {border-top: 1px solid #959595;left: 1px;}
.h24 {
    height: 24px;
}
.wrapcell {
    border-top: 1px solid #999999;
    box-sizing: border-box;
    cursor: default;
}
.wrprow{border-bottom: 1px solid #999999;box-sizing: border-box;}
.wrprow:last-child{border-bottom: none;}
.wrpguide{border-right: 1px solid #999999;box-sizing: border-box;}
.wrpguide:last-child{border-right: none;}
.vcenter {
    align-items: center;
}

.hcenter {
    justify-content: center;
}

.w24 {
    width: 24px;
}

.posabsolute {
    position: absolute;
}

.thumb {
    top: 2px;
    transition: left 0.9s;
}

.inline-flex {
    display: inline-flex;
}

.flex {
    display: flex;
}

.posrelative {
    position: relative;
}

.btn_ {
    display: inline-block;
    padding: 6px 10px;
    background-color: blueviolet;
    color: white;
    border-radius: 6px;
    cursor: pointer;
}

.mini_btn {
    background-color: blueviolet;
    border-radius: 6px;
    color: white;
    font-weight: bold;
    cursor: pointer;
}
</style>