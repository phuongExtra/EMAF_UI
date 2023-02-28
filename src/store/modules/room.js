/* eslint-disable no-unused-vars */
import { RoomService } from '@/services'

export default {
  namespaced: true,
  state: {
    rooms: {},
  },
  mutations: {
    setRooms: (state, rooms) => (state.rooms = rooms),
  },
  actions: {
    async getAllRoom({ commit }, payload) {
      const response = await RoomService.getAllRoom(payload)
      commit('setRooms', response.data)
      return response.data
    },
    async getAllRoomAvailable({ commit }, payload) {
      const response = await RoomService.getAllRoomAvailable(payload)
      commit('setRooms', response.data)
      return response.data
    },
    async getRoomSchedule({ commit }, payload) {
      const response = await RoomService.getRoomSchedule(payload)
      commit('setRooms', response.data)
      return response.data
    },
  }
}
