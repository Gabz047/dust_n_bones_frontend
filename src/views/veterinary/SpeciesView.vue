<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpecieStore } from '@/stores/specie'
import SpecieModal from '@/components/globals/modals/SpecieModal.vue'

const specieStore = useSpecieStore()

// State
const searchTerm = ref('')
const selectedStatus = ref('all')
const sortBy = ref('name:ASC')
const currentPage = ref(1)
const pageSize = ref(9)
const showModal = ref(false)
const selectedSpecie = ref(null)

// Debounce timer
let searchTimeout = null

// Computed
const speciesList = computed(() => specieStore.speciesList)
const total = computed(() => specieStore.total)
const isLoading = computed(() => specieStore.isLoading)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
async function loadSpecies() {
  const [field, order] = sortBy.value.split(':')

  const params = {
    page: currentPage.value,
    limit: pageSize.value,
    sortBy: field,
    order: order,
  }

  if (searchTerm.value) {
    params.search = searchTerm.value
  }

  if (selectedStatus.value !== 'all') {
    params.active = selectedStatus.value === 'active'
  }

  try {
    await specieStore.getAll(params)
  } catch (error) {
    console.error('Erro ao carregar espécies:', error)
  }
}

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadSpecies()
  }, 500)
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadSpecies()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

function clearFilters() {
  searchTerm.value = ''
  selectedStatus.value = 'all'
  sortBy.value = 'name:ASC'
  currentPage.value = 1
  loadSpecies()
}

function openCreateModal() {
  selectedSpecie.value = null
  showModal.value = true
}

function editSpecie(specie) {
  selectedSpecie.value = specie
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedSpecie.value = null
}

function handleSaved() {
  closeModal()
  loadSpecies()
}

async function deleteSpecie(specie) {
  if (confirm(`Tem certeza que deseja remover a espécie "${specie.name}"?`)) {
    try {
      await specieStore.remove(specie.id)
      loadSpecies()
    } catch (error) {
      console.error('Erro ao remover espécie:', error)
      alert('Erro ao remover espécie. Tente novamente.')
    }
  }
}

// Lifecycle
onMounted(() => {
  loadSpecies()
})
</script>

<template>
  <div class="page-container">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <div class="logo-icon">
              <svg class="icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div class="header-text">
              <h1 class="page-title">Listagem de Espécies</h1>
              <p class="page-subtitle">Laboratório de Medicina Veterinária - Unisociesc</p>
            </div>
          </div>
          <button @click="openCreateModal" class="btn btn-primary">
            <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nova Espécie
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <!-- Filters Section -->
        <div class="filters-section">
          <!-- Search Bar -->
          <div class="search-wrapper">
            <div class="input-with-icon">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchTerm"
                @input="debouncedSearch"
                type="text"
                placeholder="Buscar por nome comum ou científico..."
                class="input-search"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div class="filter-wrapper">
            <select v-model="selectedStatus" @change="loadSpecies" class="select-filter">
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          <!-- Sort -->
          <div class="filter-wrapper">
            <select v-model="sortBy" @change="loadSpecies" class="select-filter">
              <option value="name:ASC">Nome (A-Z)</option>
              <option value="name:DESC">Nome (Z-A)</option>
              <option value="totalQuantity:DESC">Maior Quantidade</option>
              <option value="totalQuantity:ASC">Menor Quantidade</option>
              <option value="createdAt:DESC">Mais Recentes</option>
              <option value="createdAt:ASC">Mais Antigos</option>
            </select>
          </div>
        </div>

        <!-- Results Info -->
        <div class="results-info">
          <p class="info-text">
            Mostrando <span class="info-bold">{{ speciesList.length }}</span> de
            <span class="info-bold">{{ total }}</span> espécies
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando espécies...</p>
        </div>

        <!-- Species Grid -->
        <div v-else-if="speciesList.length > 0" class="species-grid">
          <div v-for="sp in speciesList" :key="sp.id" class="species-card">
            <!-- Card Header -->
            <div class="card-header">
              <div class="card-header-content">
                <div class="card-title-section">
                  <h3 class="card-title">{{ sp.name }}</h3>
                  <p v-if="sp.scientificName" class="card-subtitle">{{ sp.scientificName }}</p>
                </div>
                <div class="card-status">
                  <span :class="['status-badge', sp.active ? 'status-active' : 'status-inactive']">
                    {{ sp.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <p v-if="sp.description" class="card-description">{{ sp.description }}</p>
              <p v-else class="card-description no-description">Sem descrição</p>

              <!-- Quantity -->
              <div class="quantity-section">
                <label class="quantity-label">Quantidade Total</label>
                <div class="quantity-value">
                  <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span class="quantity-number">{{ sp.totalQuantity }}</span>
                </div>
              </div>

              <!-- Last Updated -->
              <div class="update-info">
                Atualizado em <span class="update-date">{{ formatDate(sp.updatedAt) }}</span>
              </div>
            </div>

            <!-- Card Footer with Actions -->
            <div class="card-footer">
              <button @click="editSpecie(sp)" class="btn btn-outline btn-edit">
                <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button @click="deleteSpecie(sp)" class="btn btn-outline btn-delete">
                <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remover
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-content">
            <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="empty-title">Nenhuma espécie encontrada</h3>
            <p class="empty-description">
              Tente ajustar seus filtros de busca ou status
            </p>
            <button @click="clearFilters" class="btn btn-outline">
              Limpar Filtros
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn btn-outline pagination-btn"
          >
            <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p>Laboratório de Medicina Veterinária - Universidade Sociedade Educacional de Santa Catarina</p>
          <p class="footer-copyright">© 2024 Todos os direitos reservados</p>
        </div>
      </div>
    </footer>

    <!-- Create/Edit Modal -->
    <SpecieModal
      v-if="showModal"
      :specie="selectedSpecie"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.page-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to bottom right, #22c55e, #16a34a);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

/* Buttons */
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

.btn-edit {
  flex: 1;
  justify-content: center;
  border-color: #cbd5e1;
  color: #475569;
}

.btn-edit:hover {
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

/* Main Content */
.main-content {
  padding: 2rem 0;
}

/* Filters Section */
.filters-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .filters-section {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.search-wrapper {
  width: 100%;
}

.input-with-icon {
  position: relative;
  width: 100%;
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
}

.input-search:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.filter-wrapper {
  display: flex;
  gap: 0.5rem;
}

.select-filter {
  flex: 1;
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
}

.select-filter:hover {
  border-color: #cbd5e1;
}

.select-filter:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

/* Results Info */
.results-info {
  margin-bottom: 1.5rem;
}

.info-text {
  font-size: 0.875rem;
  color: #475569;
  margin: 0;
}

.info-bold {
  font-weight: 600;
}

/* Loading State */
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
  to { transform: rotate(360deg); }
}

/* Species Grid */
.species-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .species-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .species-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Species Card */
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
}

/* Icons */
.icon-small {
  width: 1rem;
  height: 1rem;
}

.icon-large {
  width: 1.5rem;
  height: 1.5rem;
}

/* Empty State */
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

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
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

/* Footer */
.footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  margin-top: 3rem;
}

.footer-content {
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.875rem;
  color: #475569;
}

.footer-content p {
  margin: 0;
}

.footer-copyright {
  margin-top: 0.5rem !important;
}
</style>
