<template>
  <div>
      <h4>转回患者(患者ID:{{ patientID }})</h4>
      <form @submit.prevent="handleSubmit">
          <h5>转诊回执单</h5>
          <table border="1">
                <tr>
                    <div>回执信息：</div>
                    <textarea cols="50" rows="10" v-model="receipt" placeholder="请填写转诊回执信息"></textarea>
                </tr>
                <tr>
                    <input type="submit" value="保存">
                    <button type="button" @click="goBack">返回</button>
                </tr>
          </table>
      </form>
  </div>
</template>

<script>
export default {
  name: 'ReferralBack',
  components: {},
  inject: [],
  data () {
    return {
      patientID: this.$route.query.patientID,
      referralSerialNo: this.$route.query.referralSerialNo,
      receipt: null,
      isSuccess: false
    }
  },
  methods: {
    goBack () {
      this.$router.back(-1)
    },
    handleSubmit () {
      this.submitReceipt()
      if (this.isSuccess) {
        alert('已转回')
        this.goBack()
      }
    },
    submitReceipt () {
      this.$axios({
        url: 'http://localhost:18908/manage/referral/back',
        method: 'put',
        params: {
          receipt: this.receipt,
          serialNo: this.referralSerialNo
        }
      }).then(res => {
        console.log(res.data)
      })
      this.isSuccess = true
    }
  },
  created () {

  },
  computed: {},
  watch: {}
}
</script>
<style scoped>

</style>
