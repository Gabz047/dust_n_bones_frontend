import api from "@/plugins/api"

class SpecieService {
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
      const { data } = await api.post('/species', payload)
      return data
    } catch (error) {
      console.error('❌ error in create specie', error)
      throw error
    }
  }

  async getAll(params = {}) {
    try {
      const { data } = await api.get('/species', { params })
      return this._formatListResponse(data)
    } catch (error) {
      console.error('❌ error in getAll specie', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const { data } = await api.get(`/species/${id}`)
      return data
    } catch (error) {
      console.error('❌ error in getById specie', error)
      throw error
    }
  }

  async update(id, payload) {
    try {
      const { data } = await api.put(`/species/${id}`, payload)
      return data
    } catch (error) {
      console.error('❌ error in update specie', error)
      throw error
    }
  }

  async delete(id) {
    try {
      const { data } = await api.delete(`/species/${id}`)
      return data
    } catch (error) {
      console.error('❌ error in delete specie', error)
      throw error
    }
  }
}

export default new SpecieService()
