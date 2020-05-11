<template>
  <div>
      <h4>拒绝患者申请</h4>
      <div>
          <a>第{{ $route.params.serialNo }}条注册拒绝理由：</a>
      </div>
      <div>
        <textarea cols="30" rows="10" v-model="refuseReason" placeholder="请输入拒绝理由"></textarea>
      </div>
      <div>
        <button @click="refuseRegister();destroy()">保存</button>
        <button @click="destroy">取消</button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'RefuseRegister',
  data () {
    return {
      refuseReason: ''
    }
  },
  methods: {
    refuseRegister () {
      this.$axios({
        url: 'http://localhost:18908/manage/register/audit',
        method: 'post',
        params: {
          serialNo: this.$route.params.serialNo,
          refuseReason: this.refuseReason,
          reviewerID: window.sessionStorage.getItem('userID'),
          status: 2
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.message === 'success') {
          console.log(this.$route.params.serialNo + '注册已拒绝')
        }
      })
    },
    destroy () {
      this.$router.push('/registerlist')
    }
  }
}
</script>
<style scoped>

</style>
