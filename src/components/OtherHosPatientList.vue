<template>
  <div>
    <h4>他院患者列表
      <a v-if="type===0">——全部患者</a>
      <a v-if="type===1">——管理中关联患者</a>
      <a v-if="type===2">——转出追踪</a>
      <a v-if="type===3">——转入管理</a>
    </h4>
  <div>
    <a>本院:{{ subHospitalList.orgName }}—</a>
    <a>下属医院:</a>
    <select v-if="subHospitalList.children!==null" v-model="orgArray[0]" @change="orgArray[1]=''">
        <option value="" selected disabled>-请选择-</option>
        <option v-for="(item1,index1) in subHospitalList.children" :key="index1" :value="index1">{{ item1.orgName }}</option>
    </select>
    <select v-if="orgArray[0]!==''&&subHospitalList.children[orgArray[0]].children!==null" v-model="orgArray[1]">
        <option value="" selected disabled>-请选择-</option>
        <option v-for="(item2,index2) in subHospitalList.children[orgArray[0]].children" :key="index2" :value="index2">{{ item2.orgName }}</option>
    </select>
  </div>
    <div>
      <a name="patientcounttext">该院共
        <a href="javascript:void(0)" @click="type=0;refresh()">{{ patientCount.totalCount }}</a>名患者，
        其中管理中关联患者
        <a href="javascript:void(0)" @click="type=1;refresh()">{{ patientCount.managingCount }}</a>名，
        转出患者
        <a href="javascript:void(0)" @click="type=2;refresh()">{{ patientCount.referralOutCount }}</a>名，
        转入患者
        <a href="javascript:void(0)" @click="type=3;refresh()">{{ patientCount.referralInCount }}</a>名
      </a>
      <button @click="refresh">刷新</button>
    </div>
    <patlist :patients="patients"></patlist>
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
            <select name="pagesizeselect" v-model="pageOffset" @change="refresh">
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
  name: 'OtherHosPatientList',
  inject: ['reload'],
  components: {
    patlist: PatientIndexListVue
  },
  data () {
    return {
      hospitalList: [],
      patients: [],
      totalEl: 0,
      totalPages: 0,
      pageIndex: 1,
      pageOffset: 5,
      type: 0,
      patientCount: {
        totalCount: '',
        managingCount: '',
        referralOutCount: '',
        referralInCount: ''
      },
      orgCode: window.sessionStorage.getItem('orgCode'),
      subHospitalList: {},
      orgArray: ['', ''],
      selectedOrgCode: ''
    }
  },
  methods: {
    fetchData () {
      if (this.selectedOrgCode !== '') {
        this.$axios({
          url: 'http://localhost:18908/manage/index/page/hospital',
          method: 'get',
          params: {
            orgCode: this.selectedOrgCode,
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
          url: 'http://localhost:18908/manage/index/count/hospital',
          method: 'get',
          params: {
            orgCode: this.selectedOrgCode
          }
        }).then(res => {
          if (res.data.data !== null) {
            this.patientCount = res.data.data
          }
        })
      }
    },
    getSubHospitals () {
      this.$axios({
        url: 'http://localhost:18908/dict/org/subhospital',
        method: 'get',
        params: {
          orgCode: this.orgCode
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.subHospitalList = res.data.data
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
    this.getSubHospitals()
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
  },
  watch: {
    orgArray (val, oldVal) {
      if (this.orgArray[1] === '') {
        if (this.orgArray[0] !== '') {
          this.selectedOrgCode = this.subHospitalList.children[this.orgArray[0]].orgCode
        }
      } else {
        this.selectedOrgCode = this.subHospitalList.children[this.orgArray[0]].children[this.orgArray[1]].orgCode
      }
      this.refresh()
    }
  }
}
</script>
<style scoped>
  @import '../assets/page-bar.css'
</style>
