<template>
  <div id="app">
      <navi class="side-bar"></navi>
      <router-view class="content-container"/>
  </div>
</template>

<script>
import NavigationVue from './components/Navigation.vue'
export default {
  name: 'App',
  components: {
    navi: NavigationVue
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  },
  created () {
    if (window.sessionStorage.getItem('isLogin') === null) {
      window.sessionStorage.setItem('isLogin', false)
    }
  }
}
</script>

<style>
@import './assets/login.css';
@import './assets/side-bar.css';
</style>
