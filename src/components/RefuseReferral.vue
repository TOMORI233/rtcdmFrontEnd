<template>
  <div>
      <h4>拒绝患者转诊</h4>
      <div>
          <a>第{{ $route.params.serialNo }}条转诊申请拒绝理由：</a>
      </div>
      <div>
        <textarea cols="30" rows="10" v-model="refuseReason" placeholder="请输入拒绝理由"></textarea>
      </div>
      <div>
        <button @click="refuseReferral();destroy()">保存</button>
        <button @click="destroy">取消</button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'RefuseReferral',
  data () {
    return {
      refuseReason: ''
    }
  },
  methods: {
    refuseReferral () {
      this.$axios({
        url: 'http://localhost:18908/manage/referral/refuse',
        method: 'put',
        params: {
          serialNo: this.$route.params.serialNo,
          refuseReason: this.refuseReason,
          reviewerID: window.sessionStorage.getItem('userID'),
          status: 2
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.message === 'success') {
          console.log(this.$route.params.serialNo + '转诊已拒绝')
        }
      })
    },
    destroy () {
      this.$router.push('/referralreviewlist')
    }
  }
}
</script>
<style scoped>

</style>
