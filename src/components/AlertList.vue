<template>
  <div>
    <h4>预警列表</h4>
    <a v-if="type===0">本院</a>
    <a v-else>转诊</a>
    <a>预警患者数：{{ patientCount }}人</a>
    <button @click="type=0;refresh()">本院患者</button>
    <button @click="type=1;refresh()">转诊患者</button>
    <button @click="refresh">刷新</button>
    <div>
      <table border="1">
        <thead>
          <tr class="firstHead">
            <th rowspan="2">ID</th>
            <th rowspan="2">姓名</th>
            <th rowspan="2">性别</th>
            <th rowspan="2">年龄</th>
            <th rowspan="2">管理状态</th>
            <th rowspan="2">管理等级</th>
            <th rowspan="2">依从度</th>
            <th rowspan="2">管理开始时间</th>
            <th rowspan="2">随访次数</th>
            <th rowspan="2">上次随访时间</th>
            <th rowspan="2">关联医生</th>
            <th rowspan="2">关联机构</th>
            <th colspan="5">预警</th>
            <th rowspan="2">操作</th>
          </tr>
          <tr class="secondHead">
            <th>预警类型</th>
            <th>预警名称</th>
            <th>预警原因</th>
            <th>预警时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in patientAlerts" :key="alert.patientID">
            <td>{{ alert.patientID }}</td>
            <td>{{ alert.patientName }}</td>
            <td>{{ $dict.sex[alert.sex] }}</td>
            <td>{{ $utils.jsGetAge(alert.dateOfBirth) }}</td>
            <td>{{ $dict.manageStatus[alert.manageItem.manageStatus] }}</td>
            <td>{{ $dict.manageLevel[alert.manageItem.manageLevel] }}</td>
            <td>{{ alert.manageItem.complianceRate }}</td>
            <td>{{ alert.manageItem.manageStartDateTime }}(已管理{{ alert.manageItem.manageDays }}天)</td>
            <td>{{ alert.manageItem.followupTimes }}</td>
            <td>{{ alert.manageItem.lastFollowupDate }}({{ alert.manageItem.lastFollowupDays }}天前)</td>
            <td>{{ alert.doctorName }}</td>
            <td>{{ alert.orgName }}</td>
            <td>
              <table>
                <tr v-for="item in alert.alertItemList" :key="item.serialNo">
                  <td>{{ item.alertType }}</td>
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr v-for="item in alert.alertItemList" :key="item.serialNo">
                  <td>{{ item.alertName }}</td>
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr v-for="item in alert.alertItemList" :key="item.serialNo">
                  <td>{{ item.alertReason }}</td>
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr v-for="item in alert.alertItemList" :key="item.serialNo">
                  <td>{{ item.alertTime }}</td>
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr v-for="item in alert.alertItemList" :key="item.serialNo">
                  <a href="">干预</a>|
                  <router-link :to="{name:'IgnoreAlert', params:{serialNo:item.serialNo, ignoreAll:false}}">忽略</router-link>
                </tr>
              </table>
            </td>
            <td>
              <a href="">干预</a>|
              <router-link :to="{name:'IgnoreAlert', params:{patientAlertList:alert.alertItemList, ignoreAll:true}}">忽略全部</router-link>
            </td>
          </tr>
        </tbody>
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
        <li v-if="pageIndex!=totalPages"><a @click="pageIndex++;pageClick()">下一页</a></li>
        <li v-else><a class="banclick">下一页</a></li>
        <li><a>共<i>{{ totalPages }}</i>页</a></li>
        <li>
          <a>
            <select name="pagesize" v-model="pageOffset" @change="refresh">
              <option value="2">2</option>
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
  name: 'AlertList',
  inject: ['reload'],
  data () {
    return {
      userID: window.sessionStorage.getItem('userID'),
      patientAlerts: [],
      patientCount: 0,
      totalEl: 0,
      totalPages: 0,
      pageIndex: 1,
      pageOffset: 2,
      pageUrl: '',
      countUrl: '',
      type: 0
    }
  },
  methods: {
    fetchData () {
      if (this.type === 0) {
        this.pageUrl = 'http://localhost:18908/manage/alert/page/this'
        this.countUrl = 'http://localhost:18908/manage/alert/count/this'
      } else {
        this.pageUrl = 'http://localhost:18908/manage/alert/page/referral'
        this.countUrl = 'http://localhost:18908/manage/alert/count/referral'
      }
      this.$axios({
        url: this.pageUrl,
        method: 'get',
        params: {
          pageIndex: this.pageIndex,
          pageOffset: this.pageOffset,
          viewerID: window.sessionStorage.getItem('userID')
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.patientAlerts = res.data.data.content
          this.totalEl = res.data.data.totalElements
          this.totalPages = res.data.data.totalPages
          this.pageIndex = res.data.data.number + 1
          this.pageOffset = res.data.data.size
        }
      })
      this.$axios({
        url: this.countUrl,
        method: 'get',
        params: {
          viewerID: window.sessionStorage.getItem('userID')
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
        if (val.path === '/alertlist') {
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
