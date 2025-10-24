<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpecieStore } from '@/stores/specie'
import { useRouter } from 'vue-router'
import GlobalLayout from '@/components/globals/layouts/GlobalLayout.vue'
import SpecieModal from '@/components/globals/modals/SpecieModal.vue'
import SpeciesCard from '@/components/species/SpeciesCard.vue'
import AppFilters from '@/components/globals/layouts/AppFilters.vue'
import GlobalGrid from '@/components/globals/layouts/GlobalGrid.vue'
import AppPagination from '@/components/globals/layouts/AppPagination.vue'

const specieStore = useSpecieStore()
const router = useRouter()

// State
const searchTerm = ref('')
const selectedStatus = ref('all')
const sortBy = ref('name:ASC')
const currentPage = ref(1)
const pageSize = ref(9)
const showModal = ref(false)
const selectedSpecie = ref(null)

// Computed
const speciesList = computed(() => specieStore.speciesList)
const total = computed(() => specieStore.total)
const isLoading = computed(() => specieStore.isLoading)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

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
    params.fields = ['name', 'scientificName']
    params.term = searchTerm.value
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

function handleSearch() {
  currentPage.value = 1
  loadSpecies()
}

function handlePageChange(page) {
  currentPage.value = page
  loadSpecies()
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

function openSpecieBones(specie) {
  router.push(`/bones/${specie.id}`)
}

// Lifecycle
onMounted(() => {
  loadSpecies()
})
</script>

<template>
  <GlobalLayout>
    <div class="page-container">
      <div class="container">

        <!-- Filtros -->
         <div class="container-filter">
        <AppFilters
          v-model:searchTerm="searchTerm"
          v-model:selectedStatus="selectedStatus"
          v-model:sortBy="sortBy"
          @search="handleSearch"
        />

         <button @click="openCreateModal" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            <span class="btn-text">Nova Espécie</span>
          </button>
        </div>
        <!-- Info -->
        <div class="results-info">
          <p class="info-text">
            Mostrando <span class="info-bold">{{ speciesList.length }}</span> de
            <span class="info-bold">{{ total }}</span> espécies
          </p>
        </div>

        <!-- Grid com Loading e Empty State -->
        <GlobalGrid :items="speciesList" :isLoading="isLoading" @clearFilters="clearFilters">
          <template #default="{ item }">
            <SpeciesCard
              :specie="item"
              @edit="editSpecie"
              @delete="deleteSpecie"
              @viewBones="openSpecieBones"
            />
          </template>
        </GlobalGrid>

        <!-- Paginação -->
        <AppPagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          @changePage="handlePageChange"
        />
      </div>

      <!-- Modal -->
      <SpecieModal
        v-if="showModal"
        :specie="selectedSpecie"
        @close="closeModal"
        @saved="handleSaved"
      />
    </div>
  </GlobalLayout>
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
  padding: 1rem;
}

.container-filter {
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-large {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 0.5rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 50px;
  padding: 0.75rem 1.25rem;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  font-size: 0.9375rem;
}

@media (min-width: 640px) {
  .btn-primary {
    width: auto;
  }
}

.btn-primary:hover {
  background: #15803d;
}

.results-info {
  margin-bottom: 1.5rem;
}

.info-text {
  font-size: 0.8125rem;
  color: #475569;
  margin: 0;
}

.info-bold {
  font-weight: 600;
}
</style>
