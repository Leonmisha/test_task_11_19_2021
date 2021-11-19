<template>
  <div id="app">
    <b-navbar v-if="isLoggedIn" type="dark" variant="info" class="navBar">

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-navbar-nav>
        <b-nav-item href="#"><router-link :to="pathes.dashboard">Dashboard</router-link></b-nav-item>
        <b-nav-item href="#"><router-link :to="pathes.wallets">Wallets</router-link></b-nav-item>
      </b-navbar-nav>
  </b-navbar>
    <router-view/>
  </div>
</template>

<script>
import { pathes } from '@/router'
export default {
  data () {
    return {
      pathes
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isAuth
    }
  }
}
</script>>

<style>
.navBar {
  margin-bottom: 10px;
}
.navBar a {
  color: white;
}
.form-group {
  margin-bottom: 1rem;
}
.custom-select {
  margin-bottom: 1rem;
}
</style>
