<template>
  <div>
      <h4>忽略预警</h4>
      <div>
          <a v-if="$route.params.ignoreAll===false">第{{ $route.params.serialNo }}条</a>
          <a v-else>全部</a>
          <a>预警忽略理由：</a>
      </div>
      <div>
        <textarea name="inputignoreason" cols="30" rows="10" v-model="ignoreReason" placeholder="请输入忽略理由"></textarea>
      </div>
      <div>
        <button @click="ignoreAlert();destroy()">保存</button>
        <button @click="destroy">取消</button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'IgnoreAlert',
  data () {
    return {
      ignoreReason: ''
    }
  },
  methods: {
    ignoreAlert () {
      if (this.$route.params.ignoreAll) {
        this.$route.params.patientAlertList.forEach(element => {
          this.ignoreOne(element.serialNo)
        })
      } else {
        this.ignoreOne(this.$route.params.serialNo)
      }
    },
    ignoreOne (serialNo) {
      this.$axios({
        url: 'http://localhost:18908/manage/alert/ignore',
        method: 'put',
        params: {
          executeDoctorID: window.sessionStorage.getItem('userID'),
          ignoreReason: this.ignoreReason,
          serialNo: serialNo
        }
      }).then(res => {
        if (res.data.message === 'success') {
          console.log(serialNo + '预警已忽略')
        }
      })
    },
    destroy () {
      this.$router.push('/alertlist')
    }
  }
}
</script>
<style scoped>

</style>
