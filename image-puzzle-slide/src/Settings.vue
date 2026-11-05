<template>
    <div class="flex hcenter vcenter"
        style="width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; background-color: #00000080;"
        @click.self="closePanel">
        <div class="flex hcenter vcenter panelbody">
            <h2 style="margin-top: 0; margin-bottom: 0;">Settings</h2>
            <div class="flex h24 vcenter" style="gap: 8px;">
                <strong class="a">Cols</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeCols(-1)">-</div>
                <strong class="b">{{ Cols }}</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeCols(1)">+</div>
                <span class="c"></span>
            </div>
            <div class="flex h24 vcenter" style="gap: 8px;">
                <strong class="a">Rows</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeRows(-1)">-</div>
                <strong class="b">{{ Rows }}</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeRows(1)">+</div>
                <span class="c"></span>
            </div>
            <div class="flex h24 vcenter" style="gap: 8px;">
                <strong class="a">Level</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeLevel(-1)">-</div>
                <strong class="b">{{ Level }}</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeLevel(1)">+</div>
                <span class="c"></span>
            </div>
            <div class="flex h24 vcenter" style="gap: 8px;">
                <strong class="a">Time replay</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeTimeReplay(-10)">-</div>
                <strong class="b">{{ TimeReplay }}</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeTimeReplay(10)">+</div>
                <span class="c">milisec</span>
            </div>
            <div class="flex h24 vcenter" style="gap: 8px;">
                <strong class="a">Time slide</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeTimeSlide(-10)">-</div>
                <strong class="b">{{ TimeMoving }}</strong>
                <div class="w24 h24 inline-flex mini_btn hcenter" @click.stop="changeTimeSlide(10)">+</div>
                <span class="c">milisec</span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.panelbody {
width: 300px; height: 240px; flex-direction: column;gap: 6px;
background-color: white; border-radius: 24px; 
}
.a { width: 97px; text-align: right; }
.b { width: 30px; text-align: center; }
.c { width: 62px; text-align: left; }
</style>
<script>
export default {
    name: "Settings",
    display: "Settings",
    props: ['entry'],
    data() {
        let root = this.$root
        return {
            Cols: root.Cols,
            Rows: root.Rows,
            Level: root.Level,
            TimeReplay: root.TimeReplay,
            TimeMoving: root.TimeMoving,
        }
    },
    methods: {
        changeCols(v) {
            let newVal = this.Cols + v
            if (newVal < 3) return
            this.Cols = newVal
        },
        changeRows(v) {
            let newVal = this.Rows + v
            if (newVal < 4) return
            this.Rows = newVal
        },
        changeLevel(v) {
            let newVal = this.Level + v
            if (newVal < 1) return
            this.Level = newVal
        },
        changeTimeReplay(v) {
            let newVal = this.TimeReplay + v
            if (newVal < 20) return
            this.TimeReplay = newVal
        },
        closePanel() {
            let root = this.$root
            root.TempObj = null
            let cols = this.Cols
            let rows = this.Rows
            root.Level = this.Level
            root.TimeReplay = this.TimeReplay
            root.TimeMoving = this.TimeMoving
            if (cols != root.Cols || rows != root.Rows) {
                if (0 < root.Grid.length) root.rejectGame()
                root.Cols = cols
                root.Rows = rows
                root.onChangeSize()
                let img = document.querySelector("img#dnbPicQuest")
                root.fillImgTitles(img)
            }
        },
        changeTimeSlide(t){
            let v = this.TimeMoving + t
            if (v < 10) return
            this.TimeMoving = v
        },
    },
}
</script>