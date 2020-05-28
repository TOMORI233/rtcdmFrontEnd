<template>
  <div v-if="isLogin===true" class="side-container">
    <aside>
      <h1>COPD Welcome!</h1>
      <span>
        <a>{{ userName }}</a>
        <button @click="userLogout">退出</button>
      </span>
      <hr>
      <ul id="side-ul">
        <li><a href="#/home">主页</a></li>
        <a>患者管理</a>
        <li><a href="#/alertlist">预警列表</a></li>
        <li><a href="#/followuplist">随访列表</a></li>
        <li><a href="#/registerlist">注册审核</a></li>
        <a>患者列表</a>
        <li v-if="auth === 0"><a href="#/docpatientlist">个人管理患者列表</a></li>
        <li><a href="#/thishospatientlist">本院患者列表</a></li>
        <li><a href="#/otherhospatientlist">他院患者列表</a></li>
        <a>患者转诊</a>
        <li><a href="#/referralreviewlist">转入审核</a></li>
        <li>
          <router-link v-if="auth === 0" :to="{name:'DocPatientList', query:{type:3}}" tag="a">个人转入管理</router-link>
          <router-link v-else-if="auth === 1" :to="{name:'ThisHosPatientList', query:{type:3}}" tag="a">本院转入管理</router-link>
        </li>
        <li>
          <router-link v-if="auth === 0" :to="{name:'DocPatientList', query:{type:2}}" tag="a">个人转出追踪</router-link>
          <router-link v-else-if="auth === 1" :to="{name:'ThisHosPatientList', query:{type:2}}" tag="a">本院转出追踪</router-link>
        </li>
        <!-- <li><a href="#/referralautoreview">自动审核设置</a></li> -->
      </ul>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {
      isLogin: JSON.parse(window.sessionStorage.getItem('isLogin')),
      userName: window.sessionStorage.getItem('userName'),
      auth: JSON.parse(window.sessionStorage.getItem('auth'))
    }
  },
  methods: {
    userLogout () {
      this.isLogin = false
      console.info('登出')
      window.sessionStorage.clear()
      window.sessionStorage.setItem('isLogin', false)
      this.$router.push('/login')
    }
  },
  created () {

  },
  watch: {
    $route (val, oldVal) {
      // 路径变化时检查登录状态，若登录失效或未登录则跳转至登录页面
      this.isLogin = JSON.parse(window.sessionStorage.getItem('isLogin'))
      if (this.isLogin === true) {
        this.userName = window.sessionStorage.getItem('userName')
        this.auth = JSON.parse(window.sessionStorage.getItem('auth'))
        if (val.path === '/login') {
          // 阻止已经登录的再登录
          this.$router.go(-1)
        }
      } else {
        if (val.path === '/login') {
          alert('未登录！')
        }
        this.$router.push('/login')
      }
    }
  }
}
</script>
<style scoped>

</style>
