<template>
  <div>
    <h4>随访列表</h4>
    <div>
      <a name="patientcounttext">该时间内共有
        <a>{{ patientCount.totalCount }}</a>个随访计划，
        其中待随访
        <a href="#" @click="status=0;refresh()">{{ patientCount.toFollowupCount }}</a>，
        已随访
        <a href="#" @click="status=1;refresh()">{{ patientCount.followedupCount }}</a>，
        已失效/忽略
        <a href="#" @click="status=2;refresh()">{{ patientCount.abolishedCount }}</a>
      </a>
      <button @click="refresh">刷新</button>
      <button @click="type=0;status=0;refresh()">本院患者</button>
      <button @click="type=1;status=0;refresh()">转入患者</button>
    </div>
    <div>
        <button @click="setToday();status=0;timeSelect='off';refresh()">今天</button>
        <button @click="setTomorrow();status=0;timeSelect='off';refresh()">明天</button>
        <button @click="setOneWeek();status=0;timeSelect='off';refresh()">一周内</button>
        <button @click="timeSelect='on'">指定时间</button>
        <router-link :to="{name:'AddFollowupPlan'}" tag="button">+添加随访计划</router-link>
    </div>
    <div v-show="timeSelect==='on'">
      <input type="date" name="inputStartDate" v-model="selectStartDate">
      <a>至</a>
      <input type="date" name="inputEndDate" v-model="selectEndDate" :min="selectStartDate">
      <button @click="setTimeInterval();refresh()">确定</button>
      <button @click="timeSelect='off'">取消</button>
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
                <td>累计随访次数</td>
                <td>上次随访时间</td>
                <td>计划随访时间</td>
                <td>随访类型</td>
                <td>随访状态</td>
                <td>备注</td>
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
                <td>{{ patient.doctorName }}</td>
                <td>{{ patient.orgName }}</td>
                <td>{{ patient.followupTimes }}</td>
                <td>{{ patient.lastFollowupDate }}</td>
                <td>{{ patient.planDate }}</td>
                <td>{{ patient.followupType }}</td>
                <td>{{ $dict.followupPlanStatus[patient.status] }}</td>
                <td>{{ patient.memo }}</td>
                <td>
                  <div v-show="status===0">
                    <router-link :to="{name:'PatientInfo', query:{patientID:alert.patientID, followupPlanSerialNo:patient.serialNo}}">随访</router-link>|
                    <a href="#" @click="ignoreFollowup(patient.serialNo);refresh()">忽略</a>
                  </div>
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
export default {
  name: 'FollowupList',
  inject: ['reload'],
  data () {
    return {
      patients: [],
      totalEl: 0,
      totalPages: 0,
      pageIndex: 1,
      pageOffset: 3,
      startDate: '',
      endDate: '',
      selectStartDate: '',
      selectEndDate: '',
      type: 0,
      status: 0,
      patientCount: {
        totalCount: '',
        toFollowupCount: '',
        followdeupCount: '',
        abolishedCount: ''
      },
      timeSelect: 'off'
    }
  },
  methods: {
    fetchData () {
      let pageUrl = ''
      let countUrl = ''
      if (this.type === 0) {
        pageUrl = 'http://localhost:18908/manage/followup/page/this'
        countUrl = 'http://localhost:18908/manage/followup/count/this'
      } else {
        pageUrl = 'http://localhost:18908/manage/followup/page/referral'
        countUrl = 'http://localhost:18908/manage/followup/count/referral'
      }
      this.$axios({
        url: pageUrl,
        method: 'get',
        params: {
          viewerID: window.sessionStorage.getItem('userID'),
          pageIndex: this.pageIndex,
          pageOffset: this.pageOffset,
          status: this.status,
          startDate: this.startDate,
          endDate: this.endDate
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
        url: countUrl,
        method: 'get',
        params: {
          viewerID: window.sessionStorage.getItem('userID'),
          startDate: this.startDate,
          endDate: this.endDate
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.patientCount = res.data.data
        }
      })
    },
    ignoreFollowup (serialNo) {
      this.$axios({
        url: 'http://localhost:18908/manage/followup/ignore',
        method: 'put',
        params: {
          serialNo: serialNo
        }
      }).then(res => {
        console.log(res.data)
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
      // console.log('---------refresh---------')
      // console.log(this.startDate)
      // console.log(this.endDate)
      // console.log(this.type)
      // console.log(this.patients)
      // console.log('-------------------------')
      this.pageIndex = 1
      this.fetchData()
      this.reload()
    },
    setToday () {
      // toLocaleDateString()返回'yyyy/MM/dd'格式时间
      var today = new Date(new Date().setHours(0, 0, 0, 0))
      var tomorrow = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000)
      this.startDate = today.toLocaleDateString()
      this.endDate = tomorrow.toLocaleDateString()
    },
    setTomorrow () {
      var tomorrow = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000)
      var dayAfterTomorrow = new Date(new Date().setHours(0, 0, 0, 0) + 2 * 24 * 60 * 60 * 1000)
      this.startDate = tomorrow.toLocaleDateString()
      this.endDate = dayAfterTomorrow.toLocaleDateString()
    },
    setOneWeek () {
      var today = new Date(new Date().setHours(0, 0, 0, 0))
      var oneWeek = new Date(new Date().setHours(0, 0, 0, 0) + 8 * 24 * 60 * 60 * 1000)
      this.startDate = today.toLocaleDateString()
      this.endDate = oneWeek.toLocaleDateString()
    },
    setTimeInterval () {
      // 由于endDate当天不包含，计算前endDate取selectEndDate第二天
      // input date类得到'yyyy-MM-dd'格式时间
      // api标准化传入：日期'yyyy/MM/dd',时间'yyyy-MM-ddTHH:mm:ss.SSSZ'
      var temp = this.selectEndDate.split('-')
      var endTomorrow = parseInt(temp[2]) + 1
      temp[2] = endTomorrow.toString()
      this.startDate = this.selectStartDate.split('-').join('/')
      this.endDate = temp.join('/')
    }
  },
  created () {
    this.setToday()
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
        if (val.path === '/followuplist') {
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
