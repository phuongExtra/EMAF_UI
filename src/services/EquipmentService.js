import RestAPI from '@/config/rest'

const EquipmentService = {
  async getAllEquipment(payload) {
    return await RestAPI.get('/equipment/all-equipment', payload, {}, true)
  },
  async getAllEquipmentAvailable(payload) {
    return await RestAPI.get('/equipment/all-equipment-available', payload, {}, true)
  },
  async deleteEquipment(payload) {
    return await RestAPI.get(`/equipment/delete?equipmentId=${payload}`, {}, {}, true)
  },
  async createEquipment(payload) {
    return await RestAPI.post(`/equipment/create`, payload, {}, true)
  },
  async updateEquipment(payload) {
    return await RestAPI.post(`/equipment/update`, payload, {}, true)
  },

  async getEquipmentDetail(payload) {
    return await RestAPI.get(`/equipment/detail?equipmentId=${payload}`, {}, {}, true)
  },

  async uploadImage(payload) {
    return await RestAPI.upload(`/equipment/upload-image?equipmentId=${payload.equipmentId}`, payload.image, {}, true)
  },
}

export default EquipmentService
