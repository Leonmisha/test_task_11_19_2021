<template>
  <div class="auth">
    <b-form @submit="handleSubmit">
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-2"
        label="Password:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Login</b-button>
    </b-form>
  </div>
</template>

<script>
import { pathes } from '@/router'

export default {
  name: 'Auth',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleSubmit () {
      this.$store.dispatch('login', { email: this.email, password: this.password })
        .then(() => this.$router.push(pathes.dashboard))
        .catch((err) => alert(err.message))
    }
  }
}
</script>

<style scoped>
  .auth {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    margin: 0 auto;
  }
</style>
