import * as Vue from 'vue'
import App from './App.vue'
import {
  Quasar,
  Notify,
  Loading,
  Dialog
} from 'quasar'
// router
import router from './router'
import { createPinia } from 'pinia'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'


const app = Vue.createApp(App)
app.use(Quasar, {
    plugins: { 
      Notify,
      Loading,
      Dialog
    }, // import Quasar plugins and add here
  })
app.use(router)
const pinia = createPinia()
app.use(pinia)
app.mount('#app')
