<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['changePage'])

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

function goToPage(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit('changePage', page)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="btn btn-outline pagination-btn"
    >
      <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 19l-7-7 7-7" />
      </svg>
      Anterior
    </button>

    <div class="pagination-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="['pagination-number', { active: page === currentPage }]"
      >
        {{ page }}
      </button>
    </div>

    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="btn btn-outline pagination-btn"
    >
      Próximo
      <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-outline:hover:not(:disabled) {
  background: #f1f5f9;
}

.pagination-btn {
  min-width: 100px;
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-number {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cbd5e1;
  background: white;
  color: #475569;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-number:hover {
  background: #f1f5f9;
}

.pagination-number.active {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
}

.icon-small {
  width: 1rem;
  height: 1rem;
}
</style>
