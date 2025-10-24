<template>
  <transition name="fade">
    <div v-if="visible" class="loader-overlay">
      <div class="spinner"></div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLoadingStore } from '@/stores/globals/loading'

const loadingStore = useLoadingStore()
const visible = ref(false)
let hideTimeout = null

// observa mudanças no estado global de carregamento
watch(
  () => loadingStore.isLoading,
  (newVal) => {
    if (newVal) {
      // se começou a carregar → mostra imediatamente
      clearTimeout(hideTimeout)
      visible.value = true
    } else {
      // se terminou de carregar → espera 500ms pra esconder
      hideTimeout = setTimeout(() => {
        visible.value = false
      }, 300)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 20, 30, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #3d5afe55;
  border-top-color: #3d5afe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
