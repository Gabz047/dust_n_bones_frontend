<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          {{ isEditing ? 'Editar Espécie' : 'Nova Espécie' }}
        </h2>
        <button @click="closeModal" class="btn-close" type="button">
          <svg class="icon-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Name Field -->
        <div class="form-group">
          <label for="name" class="form-label">
            Nome da Espécie <span class="required">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-input"
            :class="{ 'input-error': errors.name }"
            placeholder="Ex: Cão, Gato, Coelho..."
            required
            minlength="2"
            maxlength="255"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <!-- Scientific Name Field -->
        <div class="form-group">
          <label for="scientificName" class="form-label">
            Nome Científico
          </label>
          <input
            id="scientificName"
            v-model="form.scientificName"
            type="text"
            class="form-input"
            :class="{ 'input-error': errors.scientificName }"
            placeholder="Ex: Canis lupus familiaris"
            minlength="2"
            maxlength="255"
          />
          <span v-if="errors.scientificName" class="error-message">{{ errors.scientificName }}</span>
        </div>

        <!-- Total Quantity Field -->


        <!-- Description Field -->
        <div class="form-group">
          <label for="description" class="form-label">
            Descrição
          </label>
          <textarea
            id="description"
            v-model="form.description"
            class="form-textarea"
            :class="{ 'input-error': errors.description }"
            placeholder="Descreva as características e informações relevantes sobre a espécie..."
            rows="4"
          ></textarea>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>

        <!-- Active Status -->
        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="form.active"
              type="checkbox"
              class="form-checkbox"
            />
            <span class="checkbox-text">Espécie ativa</span>
          </label>
          <span class="input-hint">Desmarque para desativar esta espécie</span>
        </div>

        <!-- Error Alert -->
        <div v-if="submitError" class="alert alert-error">
          <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ submitError }}</span>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            type="button"
            @click="closeModal"
            class="btn btn-outline"
            :disabled="isSubmitting"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="loading-spinner"></span>
            {{ isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Espécie') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useSpecieStore } from '@/stores/specie'

const props = defineProps({
  specie: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const specieStore = useSpecieStore()

// State
const isSubmitting = ref(false)
const submitError = ref('')
const errors = reactive({
  name: '',
  scientificName: '',
  totalQuantity: '',
  description: ''
})

const form = reactive({
  name: '',
  scientificName: '',
  totalQuantity: 0,
  description: '',
  active: true
})

// Computed
const isEditing = computed(() => !!props.specie)

// Methods
function closeModal() {
  emit('close')
}

function validateForm() {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Name validation
  if (!form.name || form.name.trim().length < 2) {
    errors.name = 'O nome deve ter no mínimo 2 caracteres'
    isValid = false
  } else if (form.name.length > 255) {
    errors.name = 'O nome deve ter no máximo 255 caracteres'
    isValid = false
  }

  // Scientific name validation
  if (form.scientificName && form.scientificName.trim().length < 2) {
    errors.scientificName = 'O nome científico deve ter no mínimo 2 caracteres'
    isValid = false
  } else if (form.scientificName && form.scientificName.length > 255) {
    errors.scientificName = 'O nome científico deve ter no máximo 255 caracteres'
    isValid = false
  }

  // Total quantity validation
  if (form.totalQuantity < 0) {
    errors.totalQuantity = 'A quantidade não pode ser negativa'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  submitError.value = ''

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      name: form.name.trim(),
      scientificName: form.scientificName?.trim() || null,
      totalQuantity: form.totalQuantity,
      description: form.description?.trim() || null,
      active: form.active 
    }

    if (isEditing.value) {
      await specieStore.update(props.specie.id, payload)
    } else {
      await specieStore.create(payload)
    }

    emit('saved')
  } catch (error) {
    console.error('Erro ao salvar espécie:', error)
    submitError.value = error.response?.data?.message || 'Erro ao salvar espécie. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (props.specie) {
    form.name = props.specie.name || ''
    form.scientificName = props.specie.scientificName || ''
    form.totalQuantity = props.specie.totalQuantity || 0
    form.description = props.specie.description || ''
    form.active = props.specie.active !== undefined ? props.specie.active : true
  }
})
</script>

<style scoped>
/* Modal Overlay */
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
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Container */
.modal-container {
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-close {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* Modal Body */
.modal-body {
  padding: 1.5rem;

  flex: 1;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.required {
  color: #dc2626;
}

/* Form Inputs */
.form-input,
.form-textarea {
  width: 90%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #0f172a;
  transition: all 0.2s;
  outline: none;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-input.input-error,
.form-textarea.input-error {
  border-color: #dc2626;
}

.form-input.input-error:focus,
.form-textarea.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* Input Hint */
.input-hint {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.375rem;
}

/* Error Message */
.error-message {
  display: block;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.375rem;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #cbd5e1;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.form-checkbox:checked {
  background: #16a34a;
  border-color: #16a34a;
}

.checkbox-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
  min-width: 100px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #16a34a;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #15803d;
}

.btn-outline {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-outline:hover:not(:disabled) {
  background: #f1f5f9;
}

/* Loading Spinner */
.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Icons */
.icon-small {
  width: 1rem;
  height: 1rem;
}

.icon-medium {
  width: 1.25rem;
  height: 1.25rem;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
  }
}
</style>
