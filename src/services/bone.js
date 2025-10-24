import api from "@/plugins/api"

class BoneService {
  // ✅ Formata resposta padronizada de listagem
  _formatListResponse(data) {
    return {
      success: data.success,
      items: data.data || [],
      total: data.count ?? 0,
      pagination: data.pagination ?? null,
    }
  }

  async create(payload) {
    try {
      const { data } = await api.post('/bones', payload)
      return data
    } catch (error) {
      console.error('error in create bone', error)
      throw error
    }
  }

  async getAll(params = {}) {
    try {
      const { data } = await api.get('/bones', { params })
      return this._formatListResponse(data)
    } catch (error) {
      console.error('error in getAll bone', error)
      throw error
    }
  }

  async getAllBySpecie(id, params = {}) {
    try {
      const { data } = await api.get(`/bones/specie/${id}`, { params })
      return this._formatListResponse(data)
    } catch (error) {
      console.error('error in getAll by specie bone', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const { data } = await api.get(`/bones/${id}`)
      return data
    } catch (error) {
      console.error('error in getById bone', error)
      throw error
    }
  }

  async update(id, payload) {
    try {
      const { data } = await api.put(`/bones/${id}`, payload)
      return data
    } catch (error) {
      console.error('error in update bone', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const { data } = await api.delete(`/bones/${id}`)
      return data
    } catch (error) {
      console.error('error in delete bone', error)
      throw error
    }
  }
}

export default new BoneService()
