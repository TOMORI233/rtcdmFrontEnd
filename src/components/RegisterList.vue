<template>
  <div>
    <h4>患者注册列表</h4>
    <div>
      <a name="registercount">共{{ totalEl }}名患者待审核</a>
      <button @click="refresh">刷新</button>
      <router-link :to="{name: 'AddPatient'}" tag="button">+新增患者</router-link>
    </div>
    <div>
        <table border="1">
            <tr>
                <td>姓名</td>
                <td>性别</td>
                <td>年龄</td>
                <td>职业</td>
                <td>诊断</td>
                <td>手机</td>
                <td>指定医生</td>
                <td>注册时间</td>
                <td>操作</td>
            </tr>
            <tr v-for="(patient, index) in patients" :key="index">
                <td>{{ patient.name }}</td>
                <td>{{ $dict.sex[patient.sex] }}</td>
                <td>{{ $utils.jsGetAge(patient.dateOfBirth) }}</td>
                <td>{{ patient.profession }}</td>
                <td>{{ patient.diagnosis }}</td>
                <td>{{ patient.phone }}</td>
                <td>
                    <select name="selectdoctor" v-model="selectedDoctorID[index]">
                        <option v-if="auth===1" value="" disabled>-请选择-</option>
                        <option v-if="auth===0" :value="patient.doctorID" disabled>{{ docName }}</option>
                        <option v-else v-for="(item, cindex) in doctors" :key="cindex" :value="item.userID">{{ item.name }}</option>
                    </select>
                </td>
                <td>{{ patient.registerDateTime }}</td>
                <td>
                  <a href="javascript:void(0)" @click="approveRegister(patient.serialNo, selectedDoctorID[index])">接收</a>|
                  <router-link :to="{name:'RefuseRegister', params:{serialNo:patient.serialNo}}">拒绝</router-link>
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
  name: 'RegisterList',
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
        url: 'http://localhost:18908/manage/register/page',
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
            this.selectedDoctorID[i] = this.patients[i].doctorID
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
    approveRegister (num, doctorID) {
      if (doctorID !== null) {
        this.$axios({
          url: 'http://localhost:18908/manage/register/audit',
          method: 'post',
          params: {
            serialNo: num,
            status: 1,
            reviewerID: this.userID,
            doctorID: doctorID
          }
        }).then(res => {
          console.log(res.data)
          this.refresh()
        })
      } else {
        alert('请指定接收医生')
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
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        console.log(val)
        if (val.path === '/registerlist') {
          this.refresh()
        }
      }
    }
  }
}
</script>
<style scoped>
  @import '../assets/page-bar.css'
</style>
