 import { AuthenticationService } from '@/services'

export default {
  namespaced: true,
  state: {
    auth: {}
  },
  mutations: {
    setAuth: (state, auth) => (state.auth = auth)
  },
  actions: {
    async login({ commit }, payload) {
      const response = await AuthenticationService.login(payload)
      commit('setAuth', response)

      return response
    },
   
    async processLoginGoogle({ commit }, payload) {
      const response = await AuthenticationService.processLoginGoogle(payload)
      commit('setAuth', response)

      return response
    }


  }
}
