import RestAPI from '@/config/rest'

const AuthenticationService = {
  async login(data = {}) {
    return await RestAPI.get('/auth/login-mobile', data, {}, false)
  },
  async processLoginGoogle(payload) {
    return await RestAPI.get('/auth/process-login-google', payload, {}, false)
  }
}

export default AuthenticationService
