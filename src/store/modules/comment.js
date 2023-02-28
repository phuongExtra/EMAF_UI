/* eslint-disable no-unused-vars */
import { CommentService } from '@/services'

export default {
  namespaced: true,
  state: {
    comments: [],
    comment:{}
  },
  mutations: {
    setComments: (state, comments) => (state.comments = comments),
    setComment: (state, comment) => (state.comment =comment),
  },
  actions: {
    async getAllComments({ commit },payload ) {
      const response = await CommentService.getAllComments(payload)
      commit('setComments', response.data)
      return response.data
    },

    async updateComment({ commit } ,payload) {
      const response = await CommentService.updateComment(payload)
      commit('setComment', response.data)
      return response.data
    },

    async deleteComment({ commit },payload ) {
      const response = await CommentService.deleteComment(payload)
      commit('setComment', response.data)
      return response.data
    },

    async createComment({ commit },payload ) {
      const response = await CommentService.createComment(payload)
      commit('setComment', response.data)
      return response
    },
  
  }
}
