/* eslint-disable no-unused-vars */
import { UserService } from '@/services'

export default {
  namespaced: true,
  state: {
    user: {},
    userFilter: {},
    avatar: {},
    userList:[],
    account:{},
    accounts:[],
  },
  mutations: {
    setUserFilter: (state, userFilter) => (state.userFilter = userFilter),
    setUser: (state, user) => (state.user = user),
    setAvatar: (state, avatar) => (state.avatar = avatar),
    setUserList:(state,userList) => (state.userList = userList),
    setAccount: (state, account) => (state.account = account),
    setListAccount: (state, accounts) => (state.accounts = accounts),
   
  },
  actions: {
    async getUserByUsername({ commit }, payload) {
      const response = await UserService.getUserByUsername(payload)
      commit('setUser', response.data)

      return response.data
    },
    async getMyProfile({ commit }, payload) {
      const response = await UserService.getMyProfile(payload)
      commit('setUser', response.data)

      return response.data
    },
    async updateUser({ commit }, payload) {
      const response = await UserService.updateUser(payload)
      commit('setUser', response.data)

      return response.data
    },
    async updateAvatar({ commit }, formData) {
      const response = await UserService.updateAvatar(formData)
      commit('setAvatar', response.data)

      return response.data
    },

    async listUser({ commit },payload ) {
      const response = await UserService.listUser(payload)
      commit('setUserList', response.data)

      return response.data
    },

    async filterAccount({ commit },payload ) {
      const response = await UserService.filterAccount(payload)
      commit('setListAccount', response.data)

      return response.data
    },

    async updateAccount({ commit },payload ) {
      const response = await UserService.updateAccount(payload)
      commit('setAccount', response.data)

      return response.data
    },

    async createAccount({ commit },payload ) {
      const response = await UserService.createAccount(payload)
      commit('setAccount', response.data)

      return response.data
    },

  }
}
