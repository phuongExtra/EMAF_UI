import { createStore } from 'vuex'
import { createProxy } from '../utils/storeProxy'


import user from './modules/user'
import event from './modules/event'
import auth from './modules/auth'
import room from './modules/room'
import equipment from './modules/equipment'
import major from './modules/major'
import comment from './modules/comment'


const store = createStore({
  modules: {
    user: createProxy(user),
    event: createProxy(event),
    auth: createProxy(auth),
    room: createProxy(room),
    major: createProxy(major),
    equipment: createProxy(equipment),
    comment: createProxy(comment),
  }
})

export default store
