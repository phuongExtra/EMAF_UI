import RestAPI from '@/config/rest'

const CommentService = {
  async getAllComments(payload) {
    return await RestAPI.get(`/comment/all-comments?eventId=${payload}`, {}, {}, true)
  },
  async updateComment(payload) {
    return await RestAPI.post(`/comment/update-comment`, payload, {}, true)
  },
  async deleteComment(payload) {
    return await RestAPI.post(`/comment/delete-comment`, payload, {}, true)
  },
  async createComment(payload){
    return await RestAPI.post(`/comment/create-comment`, payload, {}, true)
  }
}

export default CommentService
