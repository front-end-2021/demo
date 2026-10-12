<script setup>
import { useUiStore } from '../stores/ui'
import Icon from './Icon.vue'
import Avatar from './Avatar.vue'
import { CURRENT_USER } from '../stores/tasks'

const ui = useUiStore()

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'projects', label: 'Projects' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'reports', label: 'Reports' },
]
</script>

<template>
  <header class="topbar">
    <div class="brand">
      <svg class="logo" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#2b7be4" />
        <path d="m9 16.5 4.5 4.5L23 11" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="brand-name">Taskflow</span>
    </div>

    <nav class="tabs" aria-label="Main">
      <button
        v-for="t in tabs"
        :key="t.key"
        class="tab"
        :class="{ active: ui.activeTab === t.key }"
        @click="ui.activeTab = t.key"
      >{{ t.label }}</button>
    </nav>

    <div class="actions">
      <button class="icon-btn" title="Settings" aria-label="Settings"><Icon name="gear" :size="18" /></button>
      <button class="user-btn" :title="CURRENT_USER" aria-label="Account"><Avatar :name="CURRENT_USER" :size="30" /></button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: var(--topbar-h);
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 14px 0 9px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  position: relative;
  z-index: 20;
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  justify-self: start;
  min-width: 0;
}
.logo {
  width: 32px;
  height: 32px;
  flex: none;
}
.brand-name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.tabs {
  display: flex;
  gap: 4px;
  justify-self: center;
}
.tab {
  height: 32px;
  padding: 0 14px;
  border-radius: 8px;
  color: var(--muted);
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}
.tab:hover {
  color: var(--text);
  background: rgba(20, 27, 45, 0.05);
}
.tab.active {
  color: var(--text);
  background: #fff;
  box-shadow: 0 1px 2px rgba(20, 27, 45, 0.12), 0 0 0 1px rgba(20, 27, 45, 0.04);
}

.actions {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-self: end;
}
.icon-btn {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--text-2);
}
.icon-btn:hover {
  background: rgba(20, 27, 45, 0.06);
}
.user-btn {
  display: grid;
  border-radius: 50%;
}

@media (max-width: 640px) {
  .topbar {
    padding: 0 8px;
  }
  .brand-name {
    display: none;
  }
  /* gọn lại để cột trái/phải đủ rộng, giữ cho tab ở giữa đúng tâm màn hình */
  .tab {
    padding: 0 6px;
    font-size: 12.5px;
  }
  .actions {
    gap: 0;
  }
  .icon-btn {
    width: 28px;
  }
}
</style>
