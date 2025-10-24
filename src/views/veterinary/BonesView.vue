<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBoneStore } from '@/stores/bone'
import { useRoute, useRouter } from 'vue-router'
import GlobalLayout from '@/components/globals/layouts/GlobalLayout.vue'
import BoneModal from '@/components/globals/modals/BoneModal.vue'
import BonesCard from '@/components/bones/BonesCard.vue'
import AppFilters from '@/components/globals/layouts/AppFilters.vue'
import GlobalGrid from '@/components/globals/layouts/GlobalGrid.vue'
import AppPagination from '@/components/globals/layouts/AppPagination.vue'

const boneStore = useBoneStore()
const route = useRoute()
const router = useRouter()

// State
const searchTerm = ref('')
const selectedStatus = ref('all')
const sortBy = ref('name:ASC')
const currentPage = ref(1)
const pageSize = ref(9)
const showModal = ref(false)
const selectedBone = ref(null)
const specieId = ref(route.params.id || null)

// Computed
const bonesList = computed(() => boneStore.bonesList)
const total = computed(() => boneStore.total)
const isLoading = computed(() => boneStore.isLoading)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// Methods
async function loadBones() {
  const [field, order] = sortBy.value.split(':')

  const params = {
    page: currentPage.value,
    limit: pageSize.value,
    sortBy: field,
    order: order,
  }

  if (searchTerm.value) {
    params.fields = ['name', 'description']
    params.term = searchTerm.value
  }

  if (selectedStatus.value !== 'all') {
    params.active = selectedStatus.value === 'active'
  }

  try {
    await boneStore.getAllBySpecie(specieId.value, params)
  } catch (error) {
    console.error('Erro ao carregar ossos:', error)
  }
}

function handleSearch() {
  currentPage.value = 1
  loadBones()
}

function handlePageChange(page) {
  currentPage.value = page
  loadBones()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilters() {
  searchTerm.value = ''
  selectedStatus.value = 'all'
  sortBy.value = 'name:ASC'
  currentPage.value = 1
  loadBones()
}

function openCreateModal() {
  selectedBone.value = null
  showModal.value = true
}

function editBone(bone) {
  selectedBone.value = bone
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedBone.value = null
}

function handleSaved() {
  closeModal()
  loadBones()
}

async function deleteBone(bone) {
  if (confirm(`Tem certeza que deseja remover o osso "${bone.name}"?`)) {
    try {
      await boneStore.remove(bone.id)
      loadBones()
    } catch (error) {
      console.error('Erro ao remover osso:', error)
      alert('Erro ao remover osso. Tente novamente.')
    }
  }
}

async function updateQuantity(bone, newQuantity) {
  try {
    await boneStore.update(bone.id, { quantity: newQuantity })
    loadBones()
  } catch (error) {
    console.error('Erro ao atualizar quantidade:', error)
    alert('Erro ao atualizar quantidade. Tente novamente.')
  }
}

function goBack() {
  router.push('/')
}

// Lifecycle
onMounted(() => {
  loadBones()
})
</script>

<template>
  <GlobalLayout>
    <div class="page-container">
      <div class="container">

        <!-- Voltar -->
        <button @click="goBack" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span>Voltar para Espécies</span>
        </button>

        <!-- Filtros + Botão -->
        <div class="container-filter">
          <AppFilters
            v-model:searchTerm="searchTerm"
            v-model:selectedStatus="selectedStatus"
            v-model:sortBy="sortBy"
             :quantityField="'quantity'"
            @search="handleSearch"
          />

          <button @click="openCreateModal" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            <span class="btn-text">Novo Osso</span>
          </button>
        </div>

        <!-- Info -->
        <div class="results-info">
          <p class="info-text">
            Mostrando <span class="info-bold">{{ bonesList.length }}</span> de
            <span class="info-bold">{{ total }}</span> ossos
          </p>
        </div>

        <!-- Grid -->
        <GlobalGrid :items="bonesList" :isLoading="isLoading" @clearFilters="clearFilters">
          <template #default="{ item }">
            <BonesCard
              :bone="item"
              @edit="editBone"
              @delete="deleteBone"
              @updateQuantity="updateQuantity"
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
      <BoneModal
        v-if="showModal"
        :bone="selectedBone"
        :specieId="specieId"
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

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.btn-back:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
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
