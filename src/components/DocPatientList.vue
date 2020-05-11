<template>
  <div>
    <h4>个人管理患者列表</h4>
    <div>
      <a name="patientcounttext">您管理的患者共
        <a href="#" @click="type=0;refresh()">{{ patientCount.totalCount }}</a>名，
        其中管理中关联患者
        <a href="#" @click="type=1;refresh()">{{ patientCount.managingCount }}</a>名，
        转出患者
        <a href="#" @click="type=2;refresh()">{{ patientCount.referralOutCount }}</a>名，
        转入患者
        <a href="#" @click="type=3;refresh()">{{ patientCount.referralInCount }}</a>名
      </a>
      <button @click="refresh">刷新</button>
    </div>
    <patlist v-bind:patients="patients"></patlist>
    <div class="page-bar">
      <ul>
        <li v-if="pageIndex>1"><a @click="pageIndex--;pageClick()">上一页</a></li>
        <li v-if="pageIndex==1"><a class="banclick">上一页</a></li>
        <li v-for="index in indexs" :key="index" :class="{ 'active': pageIndex == index }">
          <a @click="btnClick(index)">{{ index }}</a>
        </li>
        <li v-if="pageIndex<totalPages"><a @click="pageIndex++;pageClick()">下一页</a></li>
        <li v-else><a class="banclick">下一页</a></li>
        <li><a>共<i>{{ totalPages }}</i>页</a></li>
        <li>
          <a>
            <select name="pagesize" v-model="pageOffset" @change="refresh">
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PatientIndexListVue from './PatientIndexList.vue'
export default {
  name: 'DocPatientList',
  inject: ['reload'],
  components: {
    patlist: PatientIndexListVue
  },
  data () {
    return {
      patients: [],
      totalEl: 0,
      totalPages: 0,
      pageIndex: 1,
      pageOffset: 3,
      type: 0,
      patientCount: {
        totalCount: '',
        managingCount: '',
        referralOutCount: '',
        referralInCount: ''
      }
    }
  },
  methods: {
    fetchData () {
      // this.$axios.get(this.url + '?doctorID=' + window.sessionStorage.getItem('doctorID') + '&pageIndex=' + this.pageIndex + '&pageOffset=' + this.pageOffset + '&type=' + this.type).then(res => {
      //   this.patients = res.data.data.content
      // })
      this.$axios({
        url: 'http://localhost:18908/manage/index/page/doctor',
        method: 'get',
        params: {
          doctorID: window.sessionStorage.getItem('userID'),
          pageIndex: this.pageIndex,
          pageOffset: this.pageOffset,
          type: this.type
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.patients = res.data.data.content
          this.totalEl = res.data.data.totalElements
          this.totalPages = res.data.data.totalPages
          this.pageIndex = res.data.data.number + 1
          this.pageOffset = res.data.data.size
        }
      })
      this.$axios({
        url: 'http://localhost:18908/manage/index/count/doctor',
        method: 'get',
        params: {
          doctorID: window.sessionStorage.getItem('userID')
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.patientCount = res.data.data
        }
      })
    },
    btnClick (pageIndex) {
      if (pageIndex !== this.pageIndex) {
        this.pageIndex = pageIndex
      }
      this.fetchData()
    },
    pageClick () {
      this.fetchData()
    },
    refresh () {
      this.pageIndex = 1
      this.fetchData()
      this.reload()
    }
  },
  created () {
    console.log('转到个人页面')
    if (this.$route.params.fromNavi === true) {
      this.type = this.$route.params.type
    }
    this.fetchData()
  },
  computed: {
    indexs () {
      var left = 1
      var right = this.totalPages
      var ar = []
      if (this.totalPages >= 5) {
        if (this.pageIndex > 3 && this.pageIndex < this.totalPages - 2) {
          left = this.pageIndex - 2
          right = this.pageIndex + 2
        } else {
          if (this.pageIndex <= 3) {
            left = 1
            right = 5
          } else {
            right = this.totalPages
            left = this.totalPages - 4
          }
        }
      }
      while (left <= right) {
        ar.push(left)
        left++
      }
      return ar
    }
  }
}
</script>
<style scoped>
  @import '../assets/page-bar.css'
</style>
