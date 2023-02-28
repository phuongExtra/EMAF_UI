/* eslint-disable no-unused-vars */
import { createApp, h } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
import App from './App.vue'
import Login from './Login.vue'
import './scss/main.scss'
import 'vue3-carousel/dist/carousel.css'

import Utils from '@/utils/utils'
import CKEditor from '@ckeditor/ckeditor5-vue'

const app = createApp({
  computed: {
    ViewComponent() {
      // if (Utils.isAuthenticated()) {
      //   return App
      // }
      return App
    }
  },
  render() {
    return h(this.ViewComponent)
  }
})
app.use(CKEditor)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
