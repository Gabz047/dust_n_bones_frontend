<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  searchTerm: String,
  selectedStatus: String,
  sortBy: String
})

const emit = defineEmits(['update:searchTerm', 'update:selectedStatus', 'update:sortBy', 'search'])

const localSearchTerm = ref(props.searchTerm)
let searchTimeout = null

watch(localSearchTerm, (newValue) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('update:searchTerm', newValue)
    emit('search')
  }, 500)
})

const updateStatus = (event) => {
  emit('update:selectedStatus', event.target.value)
  emit('search')
}

const updateSort = (event) => {
  emit('update:sortBy', event.target.value)
  emit('search')
}
</script>

<template>
  <div class="filters-section">
    <div class="search-wrapper">
      <div class="input-with-icon">
        <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="localSearchTerm" type="text" placeholder="Buscar por nome comum ou científico..."
          class="input-search" />
      </div>
    </div>

    <div class="filter-wrapper">
      <select :value="selectedStatus" @change="updateStatus" class="select-filter">
        <option value="all">Todos os Status</option>
        <option value="active">Ativos</option>
        <option value="inactive">Inativos</option>
      </select>
    </div>

    <div class="filter-wrapper">
      <select :value="sortBy" @change="updateSort" class="select-filter">
        <option value="name:ASC">Nome (A-Z)</option>
        <option value="name:DESC">Nome (Z-A)</option>
        <option value="totalQuantity:DESC">Maior Quantidade</option>
        <option value="totalQuantity:ASC">Menor Quantidade</option>
        <option value="createdAt:DESC">Mais Recentes</option>
        <option value="createdAt:ASC">Mais Antigos</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.filters-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  /* centraliza verticalmente os items */
}

/* breakpoint pequena: duas colunas para telas médias pequenas */
@media (min-width: 640px) {
  .filters-section {
    grid-template-columns: 1fr 1fr;
  }
}

/* breakpoint principal: manter 2fr 1fr 1fr para desktop */
@media (min-width: 768px) {
  .filters-section {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.search-wrapper {
  width: 100%;
  min-width: 0;
  /* importante para evitar overflow em flex/grid */
}

.input-with-icon {
  position: relative;
  width: 100%;
  z-index: 0;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #94a3b8;
  pointer-events: none;
  z-index: 2;
}

.input-search {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  height: 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  /* evita que padding aumente largura */
  min-width: 0;
  position: relative;
  z-index: 1;
}

.input-search:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.filter-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  min-width: 0;
  /* evita overflow em layouts de grid */
}

.select-filter {
  flex: 1;
  min-width: 0;
  /* cruciais para evitar que selects quebrem layout */
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  background: white;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  appearance: none;
  /* padrão moderno */
  -webkit-appearance: none;
  /* remove aparências nativas que podem mudar tamanho */
}

.select-filter:hover {
  border-color: #cbd5e1;
}

.select-filter:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

/* pequenas melhorias para evitar setas nativas quebrarem padding em alguns browsers */
.select-filter::-ms-expand {
  display: none;
}
</style>
