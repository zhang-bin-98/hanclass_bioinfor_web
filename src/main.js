import * as Vue from 'vue'
import App from './App.vue'
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// naive ui 
import 'vfonts/FiraCode.css'

const app = Vue.createApp(App)
app.mount('#app')
app.use(VueAxios, axios)
app.use(naive)