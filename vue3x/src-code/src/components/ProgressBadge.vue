<template>
  <span v-if="value" class="progress-badge" :class="color">{{ value }}</span>
</template>

<script setup>
defineProps({ value: String, color: String })
</script>

<style scoped>
.progress-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
  white-space: nowrap;
  font-family: 'DM Mono', monospace;
}
.green  { background: #dcfce7; color: #15803d; }
.orange { background: #fff7ed; color: #c2410c; }
.red    { background: #fee2e2; color: #b91c1c; }
.blue   { background: #eff6ff; color: #1d4ed8; }
</style>
