const Utils = {
  setStorage(key, value) {
    let valueStr = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, valueStr)
  },
  getStorage(key) {
    const valueStr = localStorage.getItem(key)
    if (!valueStr || valueStr === 'undefined') return null

    return this.isJSON(valueStr) ? JSON.parse(valueStr) : valueStr
  },
  removeStorage(key) {
    localStorage.removeItem(key)
  },
  isJSON(value) {
    const valueStr = typeof value !== 'string' ? JSON.stringify(value) : value
    try {
      const obj = JSON.parse(valueStr)
      if (typeof obj === 'object' && obj !== null) {
        return true
      }
    } catch (error) {
      return false
    }
  },
  
  normalize(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replaceAll('đ', '')
  },

  isAuthenticated() {
    const authStr = localStorage.getItem('auth')
    if (!authStr || authStr === 'undefined') return false

    const auth = JSON.parse(authStr)
    return auth && auth.auth.accessToken
  },
 
   convertDatetime(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2),
      hour = ( (date.getHours() < 10) ? ("0" + date.getHours()) : date.getHours() ),
      minute = ( (date.getMinutes() < 10) ? ("0" + date.getMinutes()) : date.getMinutes() );
    return [date.getFullYear(), mnth, day, hour, minute  ].join("");
  },

 
  convertTime(str) {
    var date = new Date(str),
      hour = ( (date.getHours() < 10) ? ("0" + date.getHours()) : date.getHours() ),
      minute = ( (date.getMinutes() < 10) ? ("0" + date.getMinutes()) : date.getMinutes() );
    return [  hour, minute  ].join(":");
  }
}

export default Utils
