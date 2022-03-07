import * as Vue from 'vue'
import App from './App.vue'
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// naive ui 
import 'vfonts/FiraCode.css'
// router
import router from './router'

const app = Vue.createApp(App)
app.use(VueAxios, axios)
app.use(router)
// app.use(naive)
app.mount('#app')