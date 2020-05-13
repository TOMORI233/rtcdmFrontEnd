<template>
  <div>
    <div v-if="!isLogin">
      <div>
        <input type="text" placeholder="用户名" v-model="userName">
        <input type="password" placeholder="密码" v-model="password">
       <button @click="userLogin">登录</button>
     </div>
    </div>
    <div v-else>
      <h4>Welcome! {{ userName }}</h4>
      <button @click="userLogout">退出</button>
      <ul>
        <li><a href="#/home">主页</a></li>
        <div>
          <a>患者管理</a>
          <li><a href="#/alertlist">预警列表</a></li>
          <li><a href="#/followuplist">随访列表</a></li>
          <li><a href="#/registerlist">注册审核</a></li>
        </div>
        <div>
          <a>患者列表</a>
          <li v-if="auth === '个人账号'"><a href="#/docpatientlist">个人管理患者列表</a></li>
          <li><a href="#/thishospatientlist">本院患者列表</a></li>
          <li><a href="#/otherhospatientlist">他院患者列表</a></li>
        </div>
        <div>
          <a>患者转诊</a>
          <li><a href="#/referralreviewlist">转入审核</a></li>
          <li>
            <router-link v-if="auth === '个人账号'" :to="{name:'DocPatientList', query:{type:3}}" tag="a">个人转入管理</router-link>
            <router-link v-else :to="{name:'ThisHosPatientList', query:{type:3}}" tag="a">本院转入管理</router-link>
          </li>
          <li>
            <router-link v-if="auth === '个人账号'" :to="{name:'DocPatientList', query:{type:2}}" tag="a">个人转出追踪</router-link>
            <router-link v-else :to="{name:'ThisHosPatientList', query:{type:2}}" tag="a">本院转出追踪</router-link>
          </li>
          <!-- <li><a href="#/referralautoreview">自动审核设置</a></li> -->
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {
      isLogin: window.sessionStorage.getItem('isLogin'),
      userName: window.sessionStorage.getItem('userName'),
      password: '',
      auth: this.$dict.auth[window.sessionStorage.getItem('auth')],
      url: 'http://localhost:18908/auth/login',
      user: {}
    }
  },
  methods: {
    userLogin () {
      this.$axios({
        url: this.url,
        method: 'post',
        params: {
          userName: this.userName,
          password: this.password
        }
      }).then(res => {
        this.user = res.data.data
        this.isLogin = true
        this.password = ''
        this.auth = this.$dict.auth[this.user.auth]
        window.sessionStorage.setItem('isLogin', this.isLogin)
        window.sessionStorage.setItem('auth', this.user.auth)
        window.sessionStorage.setItem('orgCode', this.user.orgCode)
        window.sessionStorage.setItem('status', this.user.status)
        window.sessionStorage.setItem('userID', this.user.userID)
        window.sessionStorage.setItem('userName', this.user.userName)
        window.sessionStorage.setItem('divisionCode', this.user.divisionCode)
      })
    },
    userLogout () {
      this.isLogin = false
      console.info('登出')
      window.sessionStorage.clear()
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>

</style>
