import axios from 'axios'

const env = (process.env.NODE_ENV || 'local').toUpperCase()
console.log(env)
axios.defaults.baseURL = process.env[`VUE_APP_${env}_BASE_URL`]
axios.defaults.headers.common['Authorization'] = ''
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true

// Request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    switch (error.response.status) {
      case 401: {
        localStorage.removeItem('auth')
      }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export { axios }
