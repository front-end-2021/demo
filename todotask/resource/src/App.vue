<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useUiStore } from './stores/ui'
import TopBar from './components/TopBar.vue'
import SideBar from './components/SideBar.vue'
import OverviewView from './components/OverviewView.vue'
import TaskDrawer from './components/TaskDrawer.vue'
import Icon from './components/Icon.vue'
import { VIEWTYPE } from './utils/common.js'

const ui = useUiStore()

let timer
onMounted(() => (timer = setInterval(ui.tick, 30000)))
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="app">
    <TopBar />
    <div class="body">
      <SideBar />
      <main class="main">
        <div class="card">
          <OverviewView v-if="ui.activeTab === VIEWTYPE.ovview" />
          <div v-else class="soon">
            <Icon name="check-circle" :size="34" />
            <p>This section is coming soon.</p>
          </div>
        </div>
      </main>
      <TaskDrawer />
    </div>
  </div>
</template>

<style scoped>
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--app-bg); /* nền phẳng */
}
.body {
  flex: 1;
  min-height: 0;
  display: flex;
}
.main {
  flex: 1;
  min-width: 0;
  padding: 10px;
}
.card {
  height: 100%;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 6px 30px rgba(52, 38, 120, 0.16);
  overflow: hidden;
}
.soon {
  height: 100%;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  color: var(--muted);
}
</style>
