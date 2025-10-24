import { defineStore } from 'pinia'
import { computed } from 'vue'
import BoneService from '@/services/bone'
import { useStorage } from '@vueuse/core'

export const useBoneStore = defineStore('bone', () => {
  const state = useStorage('boneStorage', {
    currentBone: null,
    bonesList: [],
    pagination: null,
    total: 0,
    loading: false,
    error: null
  })

  const currentBone = computed(() => state.value.currentBone)
  const bonesList = computed(() => state.value.bonesList)
  const pagination = computed(() => state.value.pagination)
  const total = computed(() => state.value.total)
  const isLoading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)

  // ✅ Função auxiliar para formatar resposta da listagem
  function handleListResponse(data) {
    state.value.bonesList = data.items || []
    state.value.pagination = data.pagination || null
    state.value.total = data.total || 0
    return data.items
  }

  async function create(payload) {
    state.value.loading = true
    state.value.error = null
    try {
      const data = await BoneService.create(payload)
      state.value.currentBone = data.data
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
      const data = await BoneService.getAll(params)
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
      const data = await BoneService.getById(id)
      state.value.currentBone = data.data
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
      const data = await BoneService.update(id, payload)
      state.value.currentBone = data.data
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
      const data = await BoneService.delete(id)
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
    currentBone,
    bonesList,
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
