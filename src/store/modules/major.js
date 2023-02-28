/* eslint-disable no-unused-vars */
import { MajorService } from '@/services'

export default {
  namespaced: true,
  state: {
    majors: [],
  },
  mutations: {
    setMajors: (state, majors) => (state.majors = majors),
  },
  actions: {
    async getAllMajor({ commit } ) {
      const response = await MajorService.getAllMajor()
      commit('setMajors', response.data)
      return response.data
    },
  
  }
}
