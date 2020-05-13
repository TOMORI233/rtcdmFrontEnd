<template>
  <div>
      <h4>患者随访(ID:{{ patientID }})</h4>
      <div>
        <form v-if="templateCode===1" @submit.prevent="handleSubmit">
          <h5>COPD随访记录表</h5>
          <table border="1">
            <tr>随访方式：
              <input type="radio" value="门诊" v-model="followupMethod" checked>门诊
              <input type="radio" value="家访" v-model="followupMethod">家访
              <input type="radio" value="电话" v-model="followupMethod">电话
            </tr>
            <tr>随访结果：
              <input type="radio" :value='0' v-model="status">失访
              <input type="radio" :value='1' v-model="status" checked @change="failureReason=null">进行中
              <input type="radio" :value='2' v-model="status" @change="failureReason=null">有效
            </tr>
            <tr>随访类型：
              <input type="radio" value="常规随访" v-model="followupType" checked>常规随访
              <input type="radio" value="预警干预" v-model="followupType">预警干预
              <input type="radio" value="其他" v-model="followupType">其他
              <input type="text" v-model="otherFollowupType" placeholder="其他类型请填写" :disabled="followupType!=='其他'">
            </tr>
            <tr>失访原因：
              <input type="text" v-model="failureReason" placeholder="失访时填写" :disabled="status!==0">
            </tr>
            <tr>是否死亡：
              <input type="radio" :value="true" v-model="isDead">是
              <input type="radio" :value="false" v-model="isDead" checked @change="selectedDeathTime=null">否
            </tr>
            <tr>死亡时间：
              <input type="datetime-local" v-model="selectedDeathTime" :disabled="!isDead">
            </tr>
            <tr>
              <div>
                摘要记录：
              </div>
              <textarea cols="65" rows="7" v-model="summary" placeholder="随访过程摘要"></textarea>
            </tr>
            <tr>
              <input type="submit" value="保存">
              <!-- 返回按钮的type设置为button防止提交 -->
              <button type="button" @click="goBack">返回</button>
            </tr>
          </table>
        </form>
      </div>
  </div>
</template>

<script>
export default {
  name: 'SubmitFollowupRecord',
  components: {},
  inject: [],
  data () {
    return {
      alertSerialNo: null,
      patientID: this.$route.query.patientID,
      planSerialNo: null,
      content: null,
      selectedDeathTime: null,
      executeDoctorID: window.sessionStorage.getItem('userID'),
      failureReason: null,
      followupMethod: '门诊',
      followupType: '常规随访',
      planDate: null,
      status: 1,
      summary: null,
      templateCode: 1,
      isDead: false,
      otherFollowupType: '',
      patientAlertList: null,
      isSuccess: false
    }
  },
  methods: {
    goBack () {
      this.$router.back(-1)
    },
    handleSubmit () {
      if (this.patientAlertList !== null) {
        this.patientAlertList.forEach(element => {
          this.submitFollowupRecord(element.serialNo)
        })
      } else {
        this.submitFollowupRecord(this.alertSerialNo)
      }
      if (this.isSuccess) {
        alert('已随访')
        this.goBack()
      }
    },
    submitFollowupRecord (alertSerialNo) {
      let deathTime = null
      let followupType = ''
      if (this.selectedDeathTime !== null) {
        const time = new Date(this.selectedDeathTime)
        deathTime = time.toISOString()
      }
      if (this.followupType === '其他') {
        followupType = this.otherFollowupType
      } else {
        followupType = this.followupType
      }
      this.$axios({
        url: 'http://localhost:18908/manage/followup/record',
        method: 'post',
        data: {
          alertSerialNo: alertSerialNo,
          content: this.content,
          deathTime: deathTime,
          executeDoctorID: this.executeDoctorID,
          failureReason: this.failureReason,
          followupMethod: this.followupMethod,
          followupType: followupType,
          patientID: this.patientID,
          planDate: this.planDate,
          planSerialNo: this.planSerialNo,
          status: this.status,
          summary: this.summary,
          templateCode: this.templateCode
        }
      }).then(res => {
        console.log(res.data)
      })
      this.isSuccess = true
    }
  },
  created () {
    if (this.$route.query.alertSerialNo !== undefined) {
      this.alertSerialNo = this.$route.query.alertSerialNo
    }
    if (this.$route.query.followupPlanSerialNo !== undefined) {
      this.planSerialNo = this.$route.query.followupPlanSerialNo
    }
    if (this.$route.params.patientAlertList !== undefined) {
      this.patientAlertList = this.$route.params.patientAlertList
    }
  },
  computed: {},
  watch: {}
}
</script>
<style scoped>

</style>
