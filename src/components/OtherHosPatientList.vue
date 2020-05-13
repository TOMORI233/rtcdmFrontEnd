<template>
  <div>
    <h4>他院患者列表
      <a v-if="type===0">——全部患者</a>
      <a v-if="type===1">——管理中关联患者</a>
      <a v-if="type===2">——转出追踪</a>
      <a v-if="type===3">——转入管理</a>
    </h4>
    <div>下属医院:
      <select v-if="childrenDivisionList.children!==null" v-model="divisionArray[1]" @change="divisionArray[2]='';orgCode=''">
          <option value="" selected>-请选择二级单位-</option>
          <option v-for="(item1,index1) in childrenDivisionList.children" :key="index1" :value="index1">{{ item1.divisionName }}</option>
      </select>
      <select v-if="divisionArray[1]!==''&&childrenDivisionList.children[divisionArray[1]].children!==null" v-model="divisionArray[2]" @change="orgCode=''">
          <option value="" selected>-请选择一级单位-</option>
          <option v-for="(item2,index2) in childrenDivisionList.children[divisionArray[1]].children" :key="index2" :value="index2">{{ item2.divisionName }}</option>
      </select>
      <select v-model="orgCode" @change="refresh">
          <option value="" disabled>-请选择医院-</option>
          <option v-for="hospital in hospitalList" :key="hospital.serialNo" :value="hospital.orgCode">{{ hospital.orgName }}</option>
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
      orgCode: '',
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
      divisionCode: window.sessionStorage.getItem('divisionCode'),
      divisionList: [{}],
      divisionArray: [0, '', ''],
      selectedDivisionCode: '',
      childrenDivisionList: {}
    }
  },
  methods: {
    fetchData () {
      if (this.orgCode !== '') {
        this.$axios({
          url: 'http://localhost:18908/manage/index/page/hospital',
          method: 'get',
          params: {
            orgCode: this.orgCode,
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
            orgCode: this.orgCode
          }
        }).then(res => {
          if (res.data.data !== null) {
            this.patientCount = res.data.data
          }
        })
      }
    },
    getDivisionList () {
      this.$axios({
        url: 'http://localhost:18908/dict/division/list',
        method: 'get',
        params: {

        }
      }).then(res => {
        if (res.data.data !== null) {
          this.divisionList = res.data.data
          this.getChildrenDivisionList(this.divisionList, this.divisionCode)
        }
      })
    },
    getHospitals () {
      this.$axios({
        url: 'http://localhost:18908/dict/org/list',
        method: 'get',
        params: {
          divisionCode: this.selectedDivisionCode
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.hospitalList = res.data.data
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
    },
    getChildrenDivisionList (divisionList, divisionCode) {
      divisionList.forEach((element) => {
        if (element.divisionCode === divisionCode) {
          this.childrenDivisionList = element
          console.log(this.childrenDivisionList.children)
          return false
        }
        if (element.children !== null) {
          this.getChildrenDivisionList(element.children, divisionCode)
        }
      })
    }
  },
  created () {
    this.fetchData()
    this.getDivisionList()
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
    divisionArray (val, oldVal) {
      if (this.divisionArray[2] === '') {
        if (this.divisionArray[1] === '') {
          if (this.divisionArray[0] !== '') {
            this.selectedDivisionCode = this.divisionList[this.divisionArray[0]].divisionCode
          }
        } else {
          this.selectedDivisionCode = this.divisionList[this.divisionArray[0]].children[this.divisionArray[1]].divisionCode
        }
      } else {
        this.selectedDivisionCode = this.divisionList[this.divisionArray[0]].children[this.divisionArray[1]].children[this.divisionArray[2]].divisionCode
      }
      this.getHospitals()
    }
  }
}
</script>
<style scoped>
  @import '../assets/page-bar.css'
</style>
