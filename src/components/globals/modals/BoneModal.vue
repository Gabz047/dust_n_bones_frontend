<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBoneStore } from '@/stores/bone'
import { useSpecieStore } from '@/stores/specie'

const props = defineProps({
  bone: {
    type: Object,
    default: null
  },
  specieId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const boneStore = useBoneStore()
const specieStore = useSpecieStore()

// State
const form = ref({
  name: '',
  description: '',
  quantity: 0,
  specieId: props.specieId || '',
  active: true
})

const errors = ref({})
const isLoading = ref(false)
const speciesList = ref([])

// Computed
const isEditMode = computed(() => !!props.bone)
const modalTitle = computed(() => isEditMode.value ? 'Editar Osso' : 'Novo Osso')

// Methods
async function loadSpecies() {
  try {
    const species = await specieStore.getAll({ limit: 100, active: true })
    speciesList.value = species || []
  } catch (error) {
    console.error('Erro ao carregar espécies:', error)
  }
}

function validateForm() {
  errors.value = {}

  if (!form.value.name || form.value.name.trim() === '') {
    errors.value.name = 'Nome é obrigatório'
  }

  if (!form.value.specieId) {
    errors.value.specieId = 'Espécie é obrigatória'
  }

  if (form.value.quantity < 0) {
    errors.value.quantity = 'Quantidade não pode ser negativa'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description?.trim() || '',
      quantity: parseInt(form.value.quantity) || 0,
      specieId: form.value.specieId,
      active: form.value.active
    }

    if (isEditMode.value) {
      await boneStore.update(props.bone.id, payload)
    } else {
      await boneStore.create(payload)
    }

    emit('saved')
  } catch (error) {
    console.error('Erro ao salvar osso:', error)
    alert('Erro ao salvar osso. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

function handleClose() {
  emit('close')
}

function increaseQuantity() {
  form.value.quantity = (parseInt(form.value.quantity) || 0) + 1
}

function decreaseQuantity() {
  const current = parseInt(form.value.quantity) || 0
  if (current > 0) {
    form.value.quantity = current - 1
  }
}

// Lifecycle
onMounted(() => {
  loadSpecies()

  if (isEditMode.value) {
    form.value = {
      name: props.bone.name || '',
      description: props.bone.description || '',
      quantity: props.bone.quantity || 0,
      specieId: props.bone.specieId || props.specieId || '',
      active: props.bone.active ?? true
    }
  }
})
</script>

<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ modalTitle }}</h2>
        <button @click="handleClose" class="btn-close" aria-label="Fechar">
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Nome -->
        <div class="form-group">
          <label for="name" class="form-label">
            Nome <span class="required">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-input"
            :class="{ 'input-error': errors.name }"
            placeholder="Ex: Fêmur"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <!-- Descrição -->
        <div class="form-group">
          <label for="description" class="form-label">Descrição</label>
          <textarea
            id="description"
            v-model="form.description"
            class="form-textarea"
            rows="3"
            placeholder="Descrição do osso..."
          />
        </div>

        <!-- Espécie -->
        <div class="form-group">
          <label for="specieId" class="form-label">
            Espécie <span class="required">*</span>
          </label>
          <select
            id="specieId"
            v-model="form.specieId"
            class="form-select"
            :class="{ 'input-error': errors.specieId }"
            :disabled="!!specieId"
          >
            <option value="">Selecione uma espécie</option>
            <option v-for="specie in speciesList" :key="specie.id" :value="specie.id">
              {{ specie.name }}
              <span v-if="specie.scientificName">({{ specie.scientificName }})</span>
            </option>
          </select>
          <span v-if="errors.specieId" class="error-message">{{ errors.specieId }}</span>
        </div>

        <!-- Quantidade -->
        <div class="form-group">
          <label for="quantity" class="form-label">Quantidade em Estoque</label>
          <div class="quantity-input-group">
            <button
              type="button"
              @click="decreaseQuantity"
              class="btn-quantity"
              :disabled="form.quantity <= 0"
            >
              −
            </button>
            <input
              id="quantity"
              v-model.number="form.quantity"
              type="number"
              class="form-input quantity-input"
              :class="{ 'input-error': errors.quantity }"
              min="0"
            />
            <button
              type="button"
              @click="increaseQuantity"
              class="btn-quantity"
            >
              +
            </button>
          </div>
          <span v-if="errors.quantity" class="error-message">{{ errors.quantity }}</span>
        </div>

        <!-- Status -->
        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="form.active"
              type="checkbox"
              class="form-checkbox"
            />
            <span>Osso ativo</span>
          </label>
        </div>
      </form>

      <div class="modal-footer">
        <button @click="handleClose" type="button" class="btn-secondary">
          Cancelar
        </button>
        <button @click="handleSubmit" type="button" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.btn-close {
  padding: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1;
}

.btn-close:hover {
  color: #1e293b;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  width: 90%;
}

.form-group {
  margin-bottom: 1.5rem;

}

.form-label {
  display: block;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input {
width: 95%;
}

.form-textarea {
width: 95%;
}

.form-select {
width: 100%;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.quantity-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.quantity-input {
  flex: 1;
  text-align: center;
  font-weight: 600;
}

.btn-quantity {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-quantity:hover:not(:disabled) {
  background: #2563eb;
}

.btn-quantity:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #475569;
}

.form-checkbox {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
</style>
