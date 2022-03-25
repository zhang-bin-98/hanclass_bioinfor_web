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

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = Vue.createApp(App)
// app.use(VueAxios, axios)
app.use(Quasar, {
    plugins: { 
      Notify,
      Loading,
      Dialog
    }, // import Quasar plugins and add here
  })
app.use(router)
// app.use(naive)
app.mount('#app')
