<template>
  <div>
    <h4>转入审核列表</h4>
    <div>
      <a name="registercount">共{{ totalEl }}名患者待审核</a>
      <button @click="refresh">刷新</button>
    </div>
    <div>
      <table border="1">
        <tr>
          <td>ID</td>
          <td>姓名</td>
          <td>性别</td>
          <td>年龄</td>
          <td>管理状态</td>
          <td>管理等级</td>
          <td>依从度</td>
          <td>关联医生</td>
          <td>关联机构</td>
          <td>转诊类型</td>
          <td>转诊目的</td>
          <td>转诊原因</td>
          <td>接收医生</td>
          <td>发起时间</td>
          <td>操作</td>
        </tr>
        <tr v-for="(patient, index) in patients" :key="index">
          <td>{{ patient.patientID }}</td>
          <td>{{ patient.patientName }}</td>
          <td>{{ $dict.sex[patient.sex] }}</td>
          <td>{{ $utils.jsGetAge(patient.dateOfBirth) }}</td>
          <td>{{ $dict.manageStatus[patient.manageStatus] }}</td>
          <td>{{ $dict.manageLevel[patient.manageLevel] }}</td>
          <td>{{ patient.complianceRate }}</td>
          <td>{{ patient.linkedDoctorName }}</td>
          <td>{{ patient.linkedOrgName }}</td>
          <td>{{ $dict.referralType[patient.referralType] }}</td>
          <td>{{ $dict.referralPurpose[patient.referralPurpose] }}</td>
          <td>{{ patient.referralReason }}</td>
          <td>
              <select name="selectdoctor" v-model="selectedDoctorID[index]">
                  <option v-if="auth===1" :value="null" disabled>-请选择-</option>
                  <option v-if="auth===0" :value="patient.targetDoctorID" disabled>{{ docName }}</option>
                  <option v-else v-for="(item, cindex) in doctors" :key="cindex" :value="item.userID">{{ item.name }}</option>
              </select>
          </td>
          <td>{{ patient.startDateTime }}</td>
          <td>
            <a href="javascript:void(0)" @click="apporveReferral(selectedDoctorID[index], patient.serialNo)">同意</a>|
            <router-link :to="{name:'RefuseReferral', params:{serialNo:patient.serialNo}}">拒绝</router-link>
          </td>
        </tr>
      </table>
    </div>
    <router-view></router-view>
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
export default {
  name: 'ReferralReviewList',
  inject: ['reload'],
  data () {
    return {
      auth: JSON.parse(window.sessionStorage.getItem('auth')),
      userID: window.sessionStorage.getItem('userID'),
      docName: '',
      patients: [],
      totalEl: 0,
      totalPages: 0,
      pageIndex: 1,
      pageOffset: 5,
      selectedDoctorID: [],
      doctors: []
    }
  },
  methods: {
    fetchData () {
      this.selectedDoctorID = []
      this.$axios({
        url: 'http://localhost:18908/manage/referral/page',
        method: 'get',
        params: {
          pageIndex: this.pageIndex,
          pageOffset: this.pageOffset,
          viewerID: window.sessionStorage.getItem('userID')
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.patients = res.data.data.content
          this.totalEl = res.data.data.totalElements
          this.totalPages = res.data.data.totalPages
          this.pageIndex = res.data.data.number + 1
          this.pageOffset = res.data.data.size
          for (let i = 0; i < this.patients.length; i++) {
            this.selectedDoctorID[i] = this.patients[i].targetDoctorID
          }
        }
      })
      if (this.auth === 1) {
        this.$axios({
          url: 'http://localhost:18908/user/doctor/list',
          method: 'get',
          params: {
            hospitalID: window.sessionStorage.getItem('userID')
          }
        }).then(res => {
          if (res.data.data !== null) {
            this.doctors = res.data.data
          }
        })
      }
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
    getDoctorName () {
      this.$axios({
        url: 'http://localhost:18908/user/doctor/name',
        method: 'get',
        params: {
          doctorID: this.userID
        }
      }).then(res => {
        this.docName = res.data.data
      })
    },
    apporveReferral (doctorID, serialNo) {
      if (doctorID === null) {
        alert('请选择接收医生')
      } else {
        this.$axios({
          url: 'http://localhost:18908/manage/referral/approve',
          method: 'post',
          params: {
            doctorID: doctorID,
            reviewerID: this.userID,
            serialNo: serialNo
          }
        }).then(res => {
          console.log(res.data)
          this.refresh()
        })
      }
    }
  },
  created () {
    this.getDoctorName()
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
