<template>
    <div class="menu-container">
        <div class="menu-section">
            <h5 class="section-title">Ziele / Projekte</h5>
            <div class="menu-item">
                <div class="icon" v-html="appType[1][1]"></div>
                <span>{{appType[1][0]}}</span>
            </div>
            <div class="menu-item">
                <div class="icon" v-html="appType[2][1]"></div>
                <span>{{appType[2][0]}}</span>
            </div>
            <div class="menu-item">
                <div class="icon" v-html="appType[3][1]"></div>
                <span>{{appType[3][0]}}</span>
            </div>
        </div>

        <div class="menu-section">
            <h5 class="section-title">Vorhaben</h5>
            <div class="menu-item">
                <div class="icon" v-html="appType[4][1]"></div>
                <span>{{appType[4][0]}}</span>
            </div>
            <div class="menu-item">
                <div class="icon" v-html="appType[5][1]"></div>
                <span>{{appType[5][0]}}</span>
            </div>
            <div class="menu-item">
                <div class="icon" v-html="appType[6][1]"></div>
                <span>{{appType[6][0]}}</span>
            </div>
            <div class="menu-item">
                <div class="icon" v-html="appType[7][1]"></div>
                <span>{{appType[7][0]}}</span>
            </div>
        </div>

        <div class="menu-section">
            <h5 class="section-title">Strategisches Management</h5>
            <div class="menu-item">
                <div class="icon" v-html="appType[8][1]"></div>
                <span>{{appType[8][0]}}</span>
            </div>
            <div class="menu-item">
                <div class="icon" v-html="appType[9][1]"></div>
                <span>{{appType[9][0]}}</span>
            </div>
            <div class="menu-item">
                <div class="icon" v-html="appType[10][1]"></div>
                <span>{{appType[10][0]}}</span>
            </div>
            <div class="menu-item">
                <div class="icon" v-html="appType[11][1]"></div>
                <span>{{appType[11][0]}}</span>
            </div>
        </div>

        <div class="menu-section">
            <h5 class="section-title">Themenfelder</h5>
            <div class="menu-item">
                <div class="icon" v-html="appType[12][1]"></div>
                <span>{{appType[12][0]}}</span>
            </div>
            <div class="menu-item">
                <div class="icon" v-html="appType[13][1]"></div>
                <span>{{appType[13][0]}}</span>
            </div>
        </div>

        <div class="menu-section">
            <h5 class="section-title">CRM</h5>
            <div class="menu-item">
                <div class="icon" v-html="appType[14][1]"></div>
                <span>{{appType[14][0]}}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useThemenStore } from '../stores/themen.js'
import { appType } from '../utils/utility.js'

const store = useThemenStore()

</script>
<style scoped>
.menu-container {
    background-color: #fff;
    width: 280px;
    position: absolute;
    top: 30px;
    left: 0;
    z-index: 1;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e0e0e0;
    overflow: hidden;
}

.menu-section {
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

.menu-section:last-child {
    border-bottom: none;
}

.section-title {
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
.section-title, .menu-item {
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