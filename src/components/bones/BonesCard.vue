<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  bone: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'updateQuantity'])

const isUpdating = ref(false)
const quantity = computed(() => props.bone.quantity || 0)

async function increaseQuantity() {
  if (isUpdating.value) return
  isUpdating.value = true

  try {
    await emit('updateQuantity', props.bone, quantity.value + 1)
  } finally {
    isUpdating.value = false
  }
}

async function decreaseQuantity() {
  if (isUpdating.value || quantity.value <= 0) return
  isUpdating.value = true

  try {
    await emit('updateQuantity', props.bone, quantity.value - 1)
  } finally {
    isUpdating.value = false
  }
}

function handleEdit() {
  emit('edit', props.bone)
}

function handleDelete() {
  emit('delete', props.bone)
}
</script>

<template>
  <div class="bone-card">
    <div class="card-header">
      <h3 class="bone-name">{{ bone.name }}</h3>
      <div class="actions">
        <button @click="handleEdit" class="btn-icon" title="Editar">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
        </button>
        <button @click="handleDelete" class="btn-icon btn-danger" title="Remover">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" x2="10" y1="11" y2="17"/>
            <line x1="14" x2="14" y1="11" y2="17"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="card-body">
      <p v-if="bone.description" class="bone-description">
        {{ bone.description }}
      </p>

      <div v-if="bone.specie" class="specie-info">
        <span class="label">Espécie:</span>
        <span class="value">{{ bone.specie.name }}</span>
        <span v-if="bone.specie.scientificName" class="scientific">
          ({{ bone.specie.scientificName }})
        </span>
      </div>

      <div class="quantity-section">
        <span class="label">Quantidade em estoque:</span>
        <div class="quantity-controls">
          <button
            @click="decreaseQuantity"
            class="btn-quantity"
            :disabled="isUpdating || quantity <= 0"
            :class="{ 'disabled': quantity <= 0 }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
            </svg>
          </button>
          <span class="quantity-display" :class="{ 'zero': quantity === 0 }">
            {{ quantity }}
          </span>
          <button
            @click="increaseQuantity"
            class="btn-quantity"
            :disabled="isUpdating"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="status-badge" :class="{ 'active': bone.active, 'inactive': !bone.active }">
        {{ bone.active ? 'Ativo' : 'Inativo' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.bone-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bone-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .card-header {
    padding: 1.25rem;
    gap: 1rem;
  }
}

.bone-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex: 1;
  word-break: break-word;
}

@media (min-width: 640px) {
  .bone-name {
    font-size: 1.125rem;
  }
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-icon {
  padding: 0.5rem;
  background: #f1f5f9;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #e2e8f0;
}

.btn-danger:hover {
  background: #fee2e2;
}

.btn-icon svg {
  display: block;
}

.card-body {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .card-body {
    padding: 1.25rem;
  }
}

.bone-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
}

.specie-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
}

@media (min-width: 640px) {
  .specie-info {
    font-size: 0.875rem;
  }
}

.label {
  font-weight: 600;
  color: #475569;
}

.value {
  color: #1e293b;
  word-break: break-word;
}

.scientific {
  color: #64748b;
  font-style: italic;
  font-size: 0.75rem;
}

@media (min-width: 640px) {
  .scientific {
    font-size: 0.8125rem;
  }
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #fefce8;
  border-radius: 0.5rem;
  border: 2px solid #fde047;
}

@media (min-width: 640px) {
  .quantity-section {
    padding: 1rem;
  }
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .quantity-controls {
    gap: 1rem;
  }
}

.btn-quantity {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .btn-quantity {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.btn-quantity:hover:not(:disabled) {
  background: #2563eb;
  transform: scale(1.05);
}

.btn-quantity:active:not(:disabled) {
  transform: scale(0.95);
}

.btn-quantity:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-quantity.disabled {
  background: #e2e8f0;
  color: #94a3b8;
}

.quantity-display {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  min-width: 2.5rem;
  text-align: center;
}

@media (min-width: 640px) {
  .quantity-display {
    font-size: 1.5rem;
    min-width: 3rem;
  }
}

.quantity-display.zero {
  color: #dc2626;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}
</style>
