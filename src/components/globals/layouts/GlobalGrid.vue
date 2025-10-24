<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: 'Nenhum item encontrado',
  },
  emptyDescription: {
    type: String,
    default: 'Tente ajustar seus filtros ou critérios de busca',
  },
})

const emit = defineEmits(['clearFilters'])
</script>

<template>
  <!-- Estado de carregamento -->
  <div v-if="isLoading" class="loading-state">
    <div class="spinner"></div>
    <p>Carregando...</p>
  </div>

  <!-- Grid -->
  <div v-else-if="items.length > 0" class="grid">
    <slot v-for="item in items" :item="item" :key="item.id" />
  </div>

  <!-- Estado vazio -->
  <div v-else class="empty-state">
    <div class="empty-content">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0
          11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 class="empty-title">{{ emptyMessage }}</h3>
      <p class="empty-description">{{ emptyDescription }}</p>
      <button @click="emit('clearFilters')" class="btn btn-outline">
        Limpar Filtros
      </button>
    </div>
  </div>
</template>

<style scoped>
.loading-state {
  text-align: center;
  padding: 4rem 1rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e2e8f0;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.empty-state {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.empty-content {
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #cbd5e1;
  margin: 0 auto 1rem auto;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: #475569;
  margin: 0 0 1.5rem 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
}

.btn-outline {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-outline:hover {
  background: #f1f5f9;
}
</style>
