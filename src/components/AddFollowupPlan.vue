<template>
  <div>
    <h4>添加随访计划</h4>
    <form @submit.prevent="handleSubmit">
      <table border="1">
        <tr>
          <td>选择患者：</td>
          <td>
            <select v-model="selectedID">
              <option disabled value="">-请选择-</option>
              <option v-for="(patient, index) in patients" :key="index" :value="patient.patientID">{{ patient.name }}(ID:{{ patient.patientID }})</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>随访类型：</td>
          <td>
            <input type="text" v-model="followupType" required>
          </td>
        </tr>
        <tr>
          <td>备注：</td>
          <td>
            <input type="text" v-model="memo">
          </td>
        </tr>
        <tr>
          <td>计划随访时间：</td>
          <td>
            <input type="datetime-local" v-model="selectPlanDate" :min="presentTime" :defaultValue="presentTime" required>
          </td>
        </tr>
        <tr>
          <td><input type="submit" value="保存"></td>
          <td><button @click="destroy">取消</button></td>
        </tr>
      </table>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddFollowupPlan',
  data () {
    return {
      selectedID: '',
      patients: [],
      followupType: '',
      memo: '',
      selectPlanDate: '',
      presentTime: ''
    }
  },
  methods: {
    handleSubmit () {
      if (this.selectedID === '') {
        alert('请选择患者')
      } else {
        this.submitFollowupPlan()
      }
    },
    submitFollowupPlan () {
      // input datetime-local得到'yyyy-MM-ddTHH:mm'
      // new Date('yyyy-MM-ddTHH:mm:ss.SSSZ')会得到经过时区转换的本地时间，其中Z代表此为UTC时间
      // new Date('yyyy-MM-ddTHH:mm:ss.SSS')会得到未经时区转换的本地时间
      const time = new Date(this.selectPlanDate)
      const planDate = time.toISOString()
      this.$axios({
        url: 'http://localhost:18908/manage/followup/add',
        method: 'post',
        data: {
          followupType: this.followupType,
          memo: this.memo,
          patientID: this.selectedID,
          planDate: planDate
        }
      }).then(res => {
        if (res.data.message === 'success') {
          console.log('随访计划已保存')
        } else {
          console.log('保存失败')
        }
      })
      this.destroy()
    },
    getPatients () {
      this.$axios({
        url: 'http://localhost:18908/manage/index/patient/namelist',
        method: 'get',
        params: {
          type: 0,
          viewerID: window.sessionStorage.getItem('userID')
        }
      }).then(res => {
        this.patients = res.data.data
      })
    },
    destroy () {
      this.$router.push('/followuplist')
    }
  },
  created () {
    const presentTimeZ = new Date().toISOString() // 得到当前时间
    this.presentTime = presentTimeZ.substring(0, 16) // 时间取到秒
    this.getPatients()
  }
}
</script>
<style scoped>

</style>
