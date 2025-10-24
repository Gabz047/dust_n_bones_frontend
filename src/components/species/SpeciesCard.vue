<script setup>
const props = defineProps({
  specie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'viewBones'])

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="species-card">
    <div class="card-header">
      <div class="card-header-content">
        <div class="card-title-section">
          <h3 class="card-title">{{ specie.name }}</h3>
          <p v-if="specie.scientificName" class="card-subtitle">{{ specie.scientificName }}</p>
        </div>
        <div class="card-status">
          <span :class="['status-badge', specie.active ? 'status-active' : 'status-inactive']">
            {{ specie.active ? 'Ativo' : 'Inativo' }}
          </span>
        </div>
      </div>
    </div>

    <div class="card-body">
      <p v-if="specie.description" class="card-description">{{ specie.description }}</p>
      <p v-else class="card-description no-description">Sem descrição</p>

      <div class="quantity-section">
        <label class="quantity-label">Quantidade Total</label>
        <div class="quantity-value">
          <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span class="quantity-number">{{ specie.totalQuantity }}</span>
        </div>
      </div>

      <div class="update-info">
        Atualizado em <span class="update-date">{{ formatDate(specie.updatedAt) }}</span>
      </div>
    </div>

    <div class="card-footer">
      <button @click="emit('edit', specie)" class="btn btn-outline btn-edit">
        <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Editar
      </button>

      <button @click="emit('viewBones', specie)" class="btn btn-outline btn-view">
        <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
        </svg>
        Ver Ossos
      </button>

      <button @click="emit('delete', specie)" class="btn btn-outline btn-delete">
        <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Remover
      </button>
    </div>
  </div>
</template>

<style scoped>
.species-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.species-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-header {
  background: linear-gradient(to right, #f0fdf4, #dcfce7);
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-title-section {
  flex: 1;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #475569;
  font-style: italic;
  margin: 0;
}

.card-status {
  display: flex;
  align-items: center;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.card-body {
  padding: 1.5rem;
}

.card-description {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.no-description {
  font-style: italic;
  color: #94a3b8;
}

.quantity-section {
  margin-bottom: 1rem;
}

.quantity-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.5rem;
}

.quantity-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #16a34a;
}

.quantity-number {
  font-size: 1.25rem;
  font-weight: 700;
}

.update-info {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.update-date {
  font-weight: 500;
}

.card-footer {
  background: #f8fafc;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
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

.btn-outline {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-outline:hover {
  background: #f1f5f9;
}

.btn-edit {
  flex: 1;
  justify-content: center;
  border-color: #cbd5e1;
  color: #475569;
}

.btn-edit:hover {
  background: #f1f5f9;
}

.btn-view {
  flex: 1;
  justify-content: center;
  border-color: #cbd5e1;
  color: #475569;
}

.btn-view:hover {
  background: #f1f5f9;
}

.btn-delete {
  flex: 1;
  justify-content: center;
  border-color: #fca5a5;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fef2f2;
}

.icon-small {
  width: 1rem;
  height: 1rem;
}
</style>
