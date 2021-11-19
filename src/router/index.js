import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

import Dashboard from '@/views/Dashboard.vue'
import Wallets from '@/views/Wallets.vue'
import Auth from '@/views/Auth.vue'

Vue.use(VueRouter)

export const pathes = {
  dashboard: '/dashboard',
  wallets: '/wallets',
  auth: '/login'
}

const routes = [
  {
    path: pathes.dashboard,
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: pathes.wallets,
    name: 'Wallets',
    component: Wallets
  },
  {
    path: pathes.auth,
    name: 'Auth',
    component: Auth,
    beforeEnter: (_, __, next) => {
      if (store.getters.isAuth) {
        next(pathes.dashboard)
      } else {
        next()
      }
    }
  },
  {
    path: '*',
    redirect: pathes.auth
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, _, next) => {
  if (!to.matched.some(route => route.path === pathes.auth) && !store.getters.isAuth) {
    next(pathes.auth)
  } else {
    next()
  }
})

export default router
