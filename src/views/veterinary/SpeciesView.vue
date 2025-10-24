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
        <AppFilters v-model:searchTerm="searchTerm" v-model:selectedStatus="selectedStatus" v-model:sortBy="sortBy"
          @search="handleSearch" />

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
            <SpeciesCard :specie="item" @edit="editSpecie" @delete="deleteSpecie" @viewBones="openSpecieBones" />
          </template>
        </GlobalGrid>


        <!-- Paginação -->
        <AppPagination :currentPage="currentPage" :totalPages="totalPages" @changePage="handlePageChange" />
      </div>

      <!-- Modal -->
      <SpecieModal v-if="showModal" :specie="selectedSpecie" @close="closeModal" @saved="handleSaved" />
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
  padding: 2rem 1rem;
}

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
</style>
