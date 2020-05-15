<template>
    <div class="login-box" v-if="isLogin===false">
        <form @submit.prevent="handleSubmit">
          <h1>Login</h1>
          <div class="form">
            <div class="item">
              <i class="fa fa-user-circle-o" aria-hidden="true"></i>
              <input class="login-input" type="text" placeholder="用户名" v-model="userName" required>
            </div>
            <div class="item">
              <i class="fa fa-key" aria-hidden="true"></i>
              <input class="login-input" type="password" placeholder="密码" v-model="password" required>
            </div>
          </div>
          <button type="submit">登录</button>
        </form>
    </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  inject: [],
  data () {
    return {
      isLogin: JSON.parse(window.sessionStorage.getItem('isLogin')),
      userName: window.sessionStorage.getItem('userName'),
      password: '',
      auth: this.$dict.auth[window.sessionStorage.getItem('auth')],
      user: {}
    }
  },
  methods: {
    handleSubmit () {
      this.userLogin()
    },
    userLogin () {
      this.$axios({
        url: 'http://localhost:18908/auth/login',
        method: 'post',
        params: {
          userName: this.userName,
          password: this.password
        }
      }).then(res => {
        if (res.data.message === 'success') {
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
        } else {
          alert(res.data.message)
        }
      })
    }
  },
  created () {
    // 防止已登录时再导向此页面
    this.isLogin = JSON.parse(window.sessionStorage.getItem('isLogin'))
    if (this.isLogin === true) {
      this.$router.push('/home')
    }
  },
  computed: {},
  watch: {
    isLogin (val, oldVal) {
      if (val === true) {
        this.$router.push('/home')
      }
    }
  }
}
</script>
<style scoped>
  @import '../assets/login.css';
  @import '../assets/font-awesome-4.7.0/css/font-awesome.css';
</style>
