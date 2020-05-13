<template>
  <div>
      <h4>新增患者</h4>

      <a>带*为必填项</a>
      <form @submit.prevent="handleSubmit">
          <table border="1">
            <tr>
                <td>*姓名：</td>
                <td>
                    <input type="text" v-model="patientName" required>
                </td>
            </tr>
            <tr>
                <td>*身份证：</td>
                <td>
                    <input type="text" v-model="identityCardNumber" required>
                </td>
            </tr>
            <tr>
                <td>*性别：</td>
                <td>
                    <select v-model="sex">
                        <option value="0" disabled>-请选择-</option>
                        <option value="1">男</option>
                        <option value="2">女</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>*身高：</td>
                <td>
                    <input type="text" v-model="height" placeholder="单位：cm" required>
                </td>
            </tr>
            <tr>
                <td>*体重：</td>
                <td>
                    <input type="text" v-model="weight" placeholder="单位：kg" required>
                </td>
            </tr>
            <tr>
                <td>电话：</td>
                <td>
                    <input type="tel" v-model="mobilePhone">
                </td>
            </tr>
            <tr>
                <td>邮箱：</td>
                <td>
                    <input type="text" v-model="email">
                </td>
            </tr>
            <tr>
                <td>微信号：</td>
                <td>
                    <input type="text" v-model="weChat">
                </td>
            </tr>
            <tr>
                <td>*出生日期：</td>
                <td>
                    <input type="date" v-model="dateOfBirth" :max="today" required>
                </td>
            </tr>
            <tr>
                <td>学历：</td>
                <td>
                    <select v-model="education">
                        <option :value="null" disabled>-请选择-</option>
                        <option v-for="(item, index) in educations" :key="index">{{ item }}</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>职业：</td>
                <td>
                    <input type="text" v-model="profession">
                </td>
            </tr>
            <tr>
                <td>住址：</td>
                <td>
                    <input type="text" v-model="address">
                </td>
            </tr>
            <tr>
                <td>患者标签：</td>
                <td>
                    <input type="text" v-model="patientFeature" placeholder="多个之间用逗号分隔">
                </td>
            </tr>
            <tr>
                <td>*关联机构：</td>
                <td>
                    <input type="text" :value="orgName" disabled>
                </td>
            </tr>
            <tr>
                <td>*关联医生：</td>
                <td>
                    <select v-if="auth===1" v-model="selectedDoctorID">
                        <option value="" disabled>-请选择-</option>
                        <option v-for="item in doctors" :key="item.userID" :value="item.userID">{{ item.name }}</option>
                    </select>
                    <input v-else type="text" :value="doctorName" disabled>
                </td>
            </tr>
            <tr>
                <td>*账号名：</td>
                <td>
                    <input type="text" v-model="accountName" required>
                </td>
            </tr>
            <tr>
                <td>*密码：</td>
                <td>
                    <input type="password" v-model="password" required>
                </td>
            </tr>
            <tr>
                <td>*确认密码：</td>
                <td>
                    <input type="password" v-model="confirmPassword" required>
                </td>
            </tr>
            <tr>
                <td>
                    <input type="submit" value="保存">
                </td>
                <td>
                    <button type="button" @click="destroy">取消</button>
                </td>
            </tr>
        </table>
      </form>
  </div>
</template>

<script>
export default {
  name: 'AddPatient',
  data () {
    return {
      auth: JSON.parse(window.sessionStorage.getItem('auth')),
      patientName: '', // name
      identityCardNumber: null,
      sex: 0,
      height: null,
      weight: null,
      mobilePhone: null,
      email: null,
      weChat: null,
      dateOfBirth: '',
      education: null,
      educations: ['小学', '中学', '大学'],
      doctors: [],
      profession: null,
      address: null,
      patientFeature: null,
      selectedDoctorID: '',
      accountName: '', // userName
      password: '',
      confirmPassword: '',
      userID: window.sessionStorage.getItem('userID'),
      doctorName: '',
      orgName: '',
      orgCode: window.sessionStorage.getItem('orgCode'),
      today: ''
    }
  },
  methods: {
    handleSubmit () {
      if (this.sex === 0) {
        alert('请选择性别')
        return false
      } else {
        if (this.auth === 1 && this.selectedDoctorID === '') {
          alert('请选择接收医生')
          return false
        } else {
          this.addThisPatient()
        }
      }
    },
    addThisPatient () {
      if (this.auth === 0) {
        this.selectedDoctorID = this.userID
      }
      if (this.password === this.confirmPassword) {
        this.$axios({
          url: 'http://localhost:18908//user/patient/create',
          method: 'post',
          data: {
            address: this.address,
            dateOfBirth: this.dateOfBirth,
            doctorID: this.selectedDoctorID,
            education: this.education,
            email: this.email,
            height: this.height,
            identityCardNumber: this.identityCardNumber,
            mobilePhone: this.mobilePhone,
            name: this.patientName,
            orgCode: this.orgCode,
            password: this.password,
            patientFeature: this.patientFeature,
            profession: this.profession,
            sex: this.sex,
            userName: this.accountName,
            weChat: this.weChat,
            weight: this.weight
          }
        }).then(res => {
          console.log(res.data)
          this.destroy()
        })
      } else {
        alert('两次输入密码不一致')
      }
    },
    destroy () {
      this.$router.push('/registerlist')
    },
    fetchData () {
      this.$axios({
        url: 'http://localhost:18908/dict/org/name',
        method: 'get',
        params: {
          orgCode: this.orgCode
        }
      }).then(res => {
        this.orgName = res.data.data
      })
      if (this.auth === 0) {
        this.$axios({
          url: 'http://localhost:18908/user/doctor/name',
          method: 'get',
          params: {
            doctorID: this.userID
          }
        }).then(res => {
          this.doctorName = res.data.data
        })
      } else {
        this.$axios({
          url: 'http://localhost:18908/user/doctor/list',
          mehtod: 'get',
          params: {
            hospitalID: this.userID
          }
        }).then(res => {
          this.doctors = res.data.data
        })
      }
    },
    setToday () {
      const today = new Date().toLocaleDateString()
      const sToday = today.split('/')
      if (parseInt(sToday[1]) < 10) {
        sToday[1] = '0' + sToday[1]
      }
      this.today = sToday.join('-')
    }
  },
  created () {
    this.setToday()
    this.fetchData()
  }
}
</script>
<style scoped>

</style>
