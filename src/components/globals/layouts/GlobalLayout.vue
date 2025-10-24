<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'

const emit = defineEmits(['create'])
</script>

<template>
  <div class="layout-container">
    <AppHeader @create="emit('create')" />
    <main class="layout-main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
  display: flex;
  flex-direction: column;
}
.layout-main {
  flex: 1;
  padding: 2rem 0;
}
</style>
