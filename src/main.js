import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import router from './router'
import store from './store'

import { setLoginToCache } from './helpers/auth'

setLoginToCache({
  email: 'test@gmail.com',
  password: 'zvVzdWvWp1yVdyfbZZx0'
})

Vue.config.productionTip = false

Vue.use(BootstrapVue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
