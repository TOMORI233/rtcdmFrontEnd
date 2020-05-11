<template>
  <div id="app">
      <navi></navi>
      <router-view/>
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
      isLogin: window.sessionStorage.getItem('isLogin'),
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
  }
}
</script>

<style>

</style>
