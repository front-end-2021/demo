<template>
    <div class="container a-down">
        <div class="m-section">
            <h5 class="sec-tlt">Ziele / Projekte</h5>
            <div class="menu-item" @click.stop="newItem(1)">
                <div class="icon" v-html="icType[1]"></div>
                <span>{{ aTyp[1]}}</span>
            </div>
            <div class="menu-item" @click.stop="newItem(2)">
                <div class="icon" v-html="icType[2]"></div>
                <span>{{ aTyp[2] }}</span>
            </div>
            <div class="menu-item" @click.stop="newItem(3)">
                <div class="icon" v-html="icType[3]"></div>
                <span>{{ aTyp[3] }}</span>
            </div>
        </div>

        <div class="m-section">
            <h5 class="sec-tlt">Vorhaben</h5>
            <div class="menu-item" @click.stop="newItem(4)">
                <div class="icon" v-html="icType[4]"></div>
                <span>{{ aTyp[4] }}</span>
            </div>
            <div class="menu-item" @click.stop="newItem(5)">
                <div class="icon" v-html="icType[5]"></div>
                <span>{{ aTyp[5] }}</span>
            </div>
            <div class="menu-item" @click.stop="newItem(6)">
                <div class="icon" v-html="icType[6]"></div>
                <span>{{ aTyp[6] }}</span>
            </div>
            <div class="menu-item" @click.stop="newItem(7)">
                <div class="icon" v-html="icType[7]"></div>
                <span>{{ aTyp[7] }}</span>
            </div>
        </div>

        <div class="m-section">
            <h5 class="sec-tlt">Strategisches Management</h5>
            <div class="menu-item" @click.stop="newItem(8)">
                <div class="icon" v-html="icType[8]"></div>
                <span>{{ aTyp[8] }}</span>
            </div>
            <div class="menu-item" @click.stop="newItem(9)">
                <div class="icon" v-html="icType[9]"></div>
                <span>{{ aTyp[9] }}</span>
            </div>
            <div class="menu-item" @click.stop="newItem(10)">
                <div class="icon" v-html="icType[10]"></div>
                <span>{{ aTyp[10] }}</span>
            </div>
            <div class="menu-item" @click.stop="newItem(11)">
                <div class="icon" v-html="icType[11]"></div>
                <span>{{ aTyp[11] }}</span>
            </div>
        </div>

        <div class="m-section">
            <h5 class="sec-tlt">Themenfelder</h5>
            <div class="menu-item" @click.stop="newItem(12)">
                <div class="icon" v-html="icType[12]"></div>
                <span>{{ aTyp[12] }}</span>
            </div>
            <div class="menu-item" @click.stop="newItem(13)">
                <div class="icon" v-html="icType[13]"></div>
                <span>{{ aTyp[13] }}</span>
            </div>
        </div>

        <div class="m-section">
            <h5 class="sec-tlt">CRM</h5>
            <div class="menu-item" @click.stop="newItem(14)">
                <div class="icon" v-html="icType[14]"></div>
                <span>{{ aTyp[14] }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useThemenStore } from '../stores/themen.js'
import { usePlanStore } from '../stores/plan.js'
import { icType, aTyp } from '../utils/utility.js'

const store = useThemenStore()
const planStore = usePlanStore()

function newItem(type) {
    let nItem = store.addItem(null, type)
    store.itemPanels = [nItem]
    planStore.bindPopMenu('', '')
}
</script>
<style scoped>
.container {
    background-color: #fff;
    width: 280px;
    position: absolute;
    top: 30px;
    left: 0;
    z-index: 2;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e0e0e0;
    overflow: hidden;
}

.m-section {
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

.m-section:last-child {
    border-bottom: none;
}

.sec-tlt {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin: 0;
}

.menu-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
    color: #1a1a1a;
    font-size: 12px;
    text-decoration: none;
}

.sec-tlt,
.menu-item {
    padding: 8px 8px 8px 26px;

}

.menu-item:hover {
    background-color: #f8f9fa;
}

.icon {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
}
</style>