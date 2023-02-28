import RestAPI from '@/config/rest'

const UserService = {
  async getUserByUsername(params = {}) {
    return await RestAPI.get('/user/user-username', params, {}, true)
  },
  async getMyProfile(params = {}) {
    return await RestAPI.get('/user/my-profile', params, {}, true)
  },
  async updateUser(params = {}) {
    return await RestAPI.post('/user/edit-profile', params, {}, true)
  },
  
  async updateAvatar(formData) {
    return await RestAPI.upload('user/update-avatar', formData, {}, true)
  },
  async listUser(payload) {
    return await RestAPI.get(`user/list-user`,payload , {}, true)
  },

  async filterAccount(payload){
    return await RestAPI.get(`user/accounts`,payload , {}, true)
  },

  async updateAccount(payload){
    return await RestAPI.post(`user/update-accounts`,payload , {}, true)
  },

  async createAccount(payload){
    return await RestAPI.post(`user/create-account`,payload , {}, true)
  }

}

export default UserService
