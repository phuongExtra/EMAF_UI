/* eslint-disable no-unused-vars */
import { EquipmentService } from '@/services'

export default {
  namespaced: true,
  state: {
    equipment: {},
    equipments:[],
  },
  mutations: {  
    setEquipment: (state, equipment) => (state.equipment = equipment),
    setEquipments: (state, equipments) => (state.equipments = equipments),
  },
  actions: {
    async getAllEquipment({ commit },payload) {
      const response = await EquipmentService.getAllEquipment(payload)
      
      commit('setEquipments', response.data)
      return response.data
    },
    async getAllEquipmentAvailable({ commit }, payload) {
      const response = await EquipmentService.getAllEquipmentAvailable(payload)
      commit('setEquipments', response.data)
      return response.data
    },
    async deleteEquipment({ commit }, payload) {
      const response = await EquipmentService.deleteEquipment(payload)
      commit('setEquipment', response.data)
      return response
    },
    async createEquipment({ commit }, payload) {
      const response = await EquipmentService.createEquipment(payload)
      commit('setEquipment', response.data)
      return response.data
    },

    async updateEquipment({ commit }, payload) {
      const response = await EquipmentService.updateEquipment(payload)
      commit('setEquipment', response.data)
      return response.data
    },
    async getEquipmentDetail({ commit }, payload) {
      const response = await EquipmentService.getEquipmentDetail(payload)
      commit('setEquipment', response.data)
      return response.data
    },

    async uploadImage({ commit }, payload) {
      const response = await EquipmentService.uploadImage(payload)
      return response.data
    },
  }
}
