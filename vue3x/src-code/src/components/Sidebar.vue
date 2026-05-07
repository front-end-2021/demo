<template>
  <aside class="sidebar" :style="{ width: planStore.gSize.wdthL + 'px' }">
    <div class="sb-logo">
      <div class="logo-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.9" />
          <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.5" />
          <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.5" />
          <rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.2" />
        </svg>
      </div>
    </div>

    <nav class="sb-nav">
      <button class="nav-icbtn" title="Home">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      </button>
      <button class="nav-icbtn active" title="Aufgaben">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 4v5M16 4v5" />
        </svg>
      </button>
      <button class="nav-icbtn" title="Kommunikation">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </button>
      <button class="nav-icbtn" title="Dashboard">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
    </nav>
  </aside>
</template>
<script setup>
import { ref } from 'vue'
// import { useThemenStore } from '../stores/themen.js'
import { usePlanStore } from '../stores/plan.js'

const planStore = usePlanStore()
//const store = useThemenStore()

</script>
<style scoped>
.sidebar {
  min-width: 52px;
  background: #1e2130;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  flex-shrink: 0;
  border-right: 1px solid #2d3148;
}

.sb-logo {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #2d3148;
  color: #6366f1;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.sb-nav {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  align-items: center;
}

.nav-icbtn {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7494;
  transition: all 0.15s;
}

.nav-icbtn:hover {
  background: #2d3148;
  color: #a0a4c0;
}

.nav-icbtn.active {
  background: #2d3148;
  color: #6366f1;
}
</style>
