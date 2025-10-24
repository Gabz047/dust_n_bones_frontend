import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import SpecieService from '@/services/specie'

export const useSpecieStore = defineStore('specie', () => {
  const state = useStorage('specieStorage', {
    currentSpecie: null,
    speciesList: [],
    pagination: null,
    total: 0,
    loading: false,
    error: null
  })

  // --- Computed ---
  const currentSpecie = computed(() => state.value.currentSpecie)
  const speciesList = computed(() => state.value.speciesList)
  const pagination = computed(() => state.value.pagination)
  const total = computed(() => state.value.total)
  const isLoading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)

  // --- Helper ---
  function handleListResponse(data) {
    state.value.speciesList = data.items || []
    state.value.pagination = data.pagination || null
    state.value.total = data.total || 0
    return data.items
  }

  // --- Actions ---
  async function create(payload) {
    state.value.loading = true
    state.value.error = null
    try {
      const data = await SpecieService.create(payload)
      state.value.currentSpecie = data.data
      return data.data
    } catch (err) {
      state.value.error = err
      throw err
    } finally {
      state.value.loading = false
    }
  }

  async function getAll(params = {}) {
    state.value.loading = true
    state.value.error = null
    try {
      const data = await SpecieService.getAll(params)
      return handleListResponse(data)
    } catch (err) {
      state.value.error = err
      throw err
    } finally {
      state.value.loading = false
    }
  }

  async function getById(id) {
    state.value.loading = true
    state.value.error = null
    try {
      const data = await SpecieService.getById(id)
      state.value.currentSpecie = data.data
      return data.data
    } catch (err) {
      state.value.error = err
      throw err
    } finally {
      state.value.loading = false
    }
  }

  async function update(id, payload) {
    state.value.loading = true
    state.value.error = null
    try {
      const data = await SpecieService.update(id, payload)
      state.value.currentSpecie = data.data
      return data.data
    } catch (err) {
      state.value.error = err
      throw err
    } finally {
      state.value.loading = false
    }
  }

  async function remove(id) {
    state.value.loading = true
    state.value.error = null
    try {
      const data = await SpecieService.delete(id)
      state.value.speciesList = state.value.speciesList.filter(s => s.id !== id)
      return data
    } catch (err) {
      state.value.error = err
      throw err
    } finally {
      state.value.loading = false
    }
  }

  return {
    state,
    currentSpecie,
    speciesList,
    pagination,
    total,
    isLoading,
    error,
    create,
    getAll,
    getById,
    update,
    remove
  }
})
