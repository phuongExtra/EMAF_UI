import { axios } from './axios'

// Http Protocol
const HTTP_PROTOCOL = Object.freeze({
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
})

// Header
const HEADERS = Object.freeze({ 'Content-Type': 'application/json' })
const FORM_DATA_HEADERS = Object.freeze({ 'Content-Type': 'multipart/form-data' })

const RestAPI = {
  /**
   * GET
   *
   * @param {*} url
   * @param {*} params
   * @param {*} headers
   * @param {*} auth
   * @returns response
   */
  get: async (url = '', params = {}, headers = {}, auth = false) => {
    let headerParams = headers ? { headers, ...HEADERS } : HEADERS
    if (auth) {
      const authStr = localStorage.getItem('auth')
      if (authStr) {
        const authData = JSON.parse(authStr)
        headerParams = Object.assign(headerParams, { Authorization: 'Bearer ' + authData.auth.accessToken })
      }
    }

    return await axios({
      url: url,
      method: HTTP_PROTOCOL.GET,
      params: params,
      headers: headerParams
    })
  },

  /**
   * POST
   *
   * @param {*} url
   * @param {*} params
   * @param {*} headers
   * @param {*} auth
   * @returns response
   */
  post: async (url = '', data = {}, headers = {}, auth = false) => {
    let headerParams = headers ? { headers, ...HEADERS } : HEADERS
    if (auth) {
      const authStr = localStorage.getItem('auth')
      if (authStr) {
        const authData = JSON.parse(authStr)
        headerParams = Object.assign(headerParams, { Authorization: 'Bearer ' + authData.auth.accessToken })
      }
    }

    return await axios({
      url: url,
      method: HTTP_PROTOCOL.POST,
      data: data,
      headers: headerParams
    })
  },

  /**
   * POST
   *
   * @param {*} url
   * @param {*} params
   * @param {*} headers
   * @param {*} auth
   * @returns response
   */
  upload: async (url = '', formData = new FormData(), headers = {}, auth = true) => {
    let headerParams = headers ? { headers, ...FORM_DATA_HEADERS } : FORM_DATA_HEADERS
    if (auth) {
      const authStr = localStorage.getItem('auth')
      if (authStr) {
        const authData = JSON.parse(authStr)
        headerParams = Object.assign(headerParams, { Authorization: 'Bearer ' + authData.auth.accessToken })
      }
    }

    return await axios({
      url: url,
      method: HTTP_PROTOCOL.POST,
      data: formData,
      headers: headerParams
    })
  }
}

export default RestAPI
