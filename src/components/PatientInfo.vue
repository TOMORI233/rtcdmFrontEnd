/*
 * @Author: TOMORI
 * @Date: 2020-05-12 21:10:06
 * @Last Modified by: TOMORI
 * @Last Modified time: 2020-05-15 18:27:23
 */
<template>
    <div>
        <div>
            <h3>患者个人信息(ID:{{ patientID }})</h3>
            <div>
                <input type="radio" :value='0' v-model="type" checked @change="refresh()">个人信息
                <input type="radio" :value='1' v-model="type" @change="refresh()">管理计划
                <input type="radio" :value='2' v-model="type" @change="refresh()">监测数据
                <input type="radio" :value='3' v-model="type" @change="refresh()">预警历史
                <input type="radio" :value='4' v-model="type" @change="refresh()">随访记录
                <input type="radio" :value='5' v-model="type" @change="refresh()">评估记录
                <input type="radio" :value='6' v-model="type" @change="refresh()">转诊历史
            </div>
            <router-link v-if="isOptional" :to="{name:'SubmitFollowupRecord', query:{patientID:patientID,alertSerialNo:alertSerialNo,followupPlanSerialNo:followupPlanSerialNo}, params:{patientAlertList:patientAlertList}}" tag="button">随访</router-link>
            <!-- <button>消息</button> -->
            <router-link  v-if="isOptional" :to="{name:'ApplyReferral', query:{patientID:patientID,name:baseInfo.name,alertSerialNo:alertSerialNo}}" tag="button">转诊</router-link>
            <button @click="goBack">返回</button>
            <button @click="refresh">刷新</button>
        </div>
        <div v-show="type===0">
            <h4>个人信息</h4>
            <div>
                <h5>基本信息</h5>
                <!-- 照片 -->
                <div>
                    <a>姓名：{{ baseInfo.name }}</a>
                    <a>性别：{{ $dict.sex[baseInfo.sex] }}</a>
                    <a>出生日期：{{ baseInfo.dateOfBirth }}</a>
                </div>
                <div>
                    <a>职业：{{ baseInfo.profession }}</a>
                    <a>学历：{{ baseInfo.education }}</a>
                    <a>联系电话：{{ baseInfo.phone }}</a>
                </div>
                <div>
                    <a>身高：{{ baseInfo.height }} cm</a>
                    <a>体重：{{ baseInfo.weight }} kg</a>
                </div>
            </div>
            <div>
                <h5>管理信息</h5>
                <div>
                    <a>诊断：{{ $dict.manageClass[manageInfo.manageClass] }}</a>
                    <a>管理状态：{{ $dict.manageStatus[manageInfo.manageStatus] }}</a>
                </div>
                <a>患者特点：{{ manageInfo.patientFeature }}</a>
                <div>
                    <a>负责医生：{{ doctorName }}</a>
                    <a>所属机构：{{ orgName }}</a>
                </div>
                <div>
                    <a>管理开始时间：{{ manageInfo.manageStartDateTime }}</a>
                    <a>依从度：{{ manageInfo.complianceRate }}</a>
                </div>
                <div>
                    <a>管理中止时间：{{ manageInfo.terminationDateTime }}</a>
                    <a>管理中止原因：{{ manageInfo.terminationReason }}</a>
                </div>
                <div>
                    <a>上次随访时间：{{ manageInfo.lastFollowupDate }}</a>
                    <a>累计随访次数：{{ manageInfo.complianceRate }}</a>
                </div>
            </div>
            <div >
                <h5>转诊信息</h5>
                <router-link id="referralbackbtn" v-if="referralInfo.status===1&&isOptional" :to="{name:'ReferralBack',query:{referralSerialNo:referralInfo.serialNo, patientID:patientID}}" tag="button">转回</router-link>
                <div v-if="JSON.stringify(referralInfo) !== '{}'">
                    <div>
                        <a v-if="referralInfo.status===0">转诊状态：待转</a>
                        <a v-else-if="referralInfo.status===3">转诊状态：已结束</a>
                        <a v-else>转诊状态：{{ $dict.referralType[referralInfo.referralType] }}</a>
                        <a>转诊医院：{{ referralOrgName }}</a>
                        <a>转诊医生：{{ referralDoctorName }}</a>
                    </div>
                    <div>
                        <a>转诊目的：{{ $dict.referralPurpose[referralInfo.referralPurpose] }}</a>
                        <a>转诊原因：{{ referralInfo.referralReason }}</a>
                    </div>
                </div>
                <div v-else>无转诊信息</div>
            </div>
        </div>
        <div v-if="type===1">
            <h4>管理计划</h4>
        </div>
        <div v-if="type===2">
            <h4>监测数据</h4>
            <div>
                <input type="radio" :value='1' v-model="recordType" checked @change="refresh">CAT
                <input type="radio" :value='2' v-model="recordType" @change="refresh">HAD
                <input type="radio" :value='3' v-model="recordType" @change="refresh">PEF
                <input type="radio" :value='4' v-model="recordType" @change="refresh">用药记录
                <input type="radio" :value='5' v-model="recordType" @change="refresh">不适记录
                <input type="radio" :value='7' v-model="recordType" @change="refresh">体重
                <input type="radio" :value='8' v-model="recordType" @change="refresh">六分钟步行测试记录
            </div>
            <div>
                <button @click="setOneWeek();timeSelect='off';refresh()">近一周</button>
                <button @click="setOneMonth();timeSelect='off';refresh()">近一个月</button>
                <button @click="timeSelect='on'">指定时间</button>
            </div>
            <div v-show="timeSelect==='on'">
                <input type="date" v-model="selectStartDate">
                <a>至</a>
                <input type="date" v-model="selectEndDate" :min="selectStartDate">
                <button @click="setTimeInterval();refresh()">确定</button>
                <button @click="timeSelect='off'">取消</button>
            </div>
            <table border="1" v-if="recordType===1">
              <tr>
                <th>测量时间</th>
                <th>问卷得分</th>
                <th>答案</th>
                <th>用时(s)</th>
                <th>是否预警</th>
                <th>备注</th>
              </tr>
              <tr v-for="record in catHistory" :key="record.serialNo">
                <td>{{ record.recordTime }}</td>
                <td>{{ record.score }}</td>
                <td>{{ record.answer }}</td>
                <td>{{ record.duration }}</td>
                <td>{{ $dict.recordStatus[record.status] }}</td>
                <td>{{ record.memo }}</td>
              </tr>
            </table>
            <table border="1" v-else-if="recordType===2">
              <tr>
                <th>测量时间</th>
                <th>问卷总分</th>
                <th>焦虑得分</th>
                <th>抑郁得分</th>
                <th>答案</th>
                <th>用时(s)</th>
                <th>是否预警</th>
                <th>备注</th>
              </tr>
              <tr v-for="record in hadHistory" :key="record.serialNo">
                <td>{{ record.recordTime }}</td>
                <td>{{ record.score }}</td>
                <td>{{ record.anxiety }}</td>
                <td>{{ record.depression }}</td>
                <td>{{ record.answer }}</td>
                <td>{{ record.duration }}</td>
                <td>{{ $dict.recordStatus[record.status] }}</td>
                <td>{{ record.memo }}</td>
              </tr>
            </table>
            <table border="1" v-else-if="recordType===3">
              <tr>
                <th>测量时间</th>
                <th>峰流速值(L/min)</th>
                <th>是否预警</th>
                <th>备注</th>
              </tr>
              <tr v-for="record in pefHistory" :key="record.serialNo">
                <td>{{ record.recordTime }}</td>
                <td>{{ record.value }}</td>
                <td>{{ $dict.recordStatus[record.status] }}</td>
                <td>{{ record.memo }}</td>
              </tr>
            </table>
            <table border="1" v-if="recordType===4">
              <tr>
                <th>用药具体时间</th>
                <th>用药时间点</th>
                <th>药品名称</th>
                <th>剂量</th>
                <th>是否预警</th>
                <th>备注</th>
              </tr>
              <tr v-for="record in drugHistory" :key="record.serialNo">
                <td>{{ record.recordTime }}</td>
                <td>{{ record.timePoint }}</td>
                <td>{{ record.drugName }}</td>
                <td>{{ record.dosage }}</td>
                <td>{{ $dict.recordStatus[record.status] }}</td>
                <td>{{ record.memo }}</td>
              </tr>
            </table>
            <table border="1" v-if="recordType===5">
              <tr>
                <th>不适产生时间</th>
                <th>症状</th>
                <th>是否不适</th>
                <th>是否预警</th>
                <th>备注</th>
              </tr>
              <tr v-for="record in discomfortHistory" :key="record.serialNo">
                <td>{{ record.recordTime }}</td>
                <td>{{ record.symptom }}</td>
                <td>{{ $dict.isDiscomfort[record.isDiscomfort] }}</td>
                <td>{{ $dict.recordStatus[record.status] }}</td>
                <td>{{ record.memo }}</td>
              </tr>
            </table>
            <table border="1" v-if="recordType===7">
              <tr>
                <th>测量时间</th>
                <th>体重(kg)</th>
                <th>备注</th>
              </tr>
              <tr v-for="record in weightHistory" :key="record.serialNo">
                <td>{{ record.recordTime }}</td>
                <td>{{ record.weight }}</td>
                <td>{{ record.memo }}</td>
              </tr>
            </table>
            <table border="1" v-if="recordType===8">
              <tr>
                <th>测量时间</th>
                <th>六分钟步行测试距离(m)</th>
                <th>Borg答案</th>
                <th>是否预警</th>
                <th>备注</th>
              </tr>
              <tr v-for="record in smwtHistory" :key="record.serialNo">
                <td>{{ record.recordTime }}</td>
                <td>{{ record.value }}</td>
                <td>{{ record.answer }}</td>
                <td>{{ $dict.recordStatus[record.status] }}</td>
                <td>{{ record.memo }}</td>
              </tr>
            </table>
        </div>
        <div v-if="type===3">
            <h4>预警历史</h4>
            <table border="1">
              <tr>
                <th>预警时间</th>
                <th>预警类型</th>
                <th>预警名称</th>
                <th>预警原因</th>
                <th>处理结果</th>
                <th>操作</th>
              </tr>
              <tr v-for="alert in alertHistory" :key="alert.serialNo">
                <td>{{ alert.alertTime }}</td>
                <td>{{ alert.alertType }}</td>
                <td>{{ alert.alertName }}</td>
                <td>{{ alert.alertReason }}</td>
                <td>{{ $dict.alertRecordStatus[alert.status] }}</td>
                <td>
                  <router-link v-if="alert.status===0" :to="{name:'IgnoreAlert', params:{serialNo:alert.serialNo, ignoreAll:false}}">忽略</router-link>
                </td>
              </tr>
            </table>
        </div>
        <div v-if="type===4">
            <h4>随访记录</h4>
            <table border="1">
              <tr>
                <th>随访时间</th>
                <th>随访类型</th>
                <th>随访方式</th>
                <th>随访结果</th>
                <th>记录摘要</th>
              </tr>
              <tr v-for="followup in followupHistory" :key="followup.serialNo">
                <td>{{ followup.executeTime }}</td>
                <td>{{ followup.followupType }}</td>
                <td>{{ followup.followupMethod }}</td>
                <td>{{ $dict.followupRecordStatus[followup.status] }}</td>
                <td>{{ followup.summary }}</td>
              </tr>
            </table>
        </div>
        <div v-if="type===5">
            <h4>评估记录</h4>
            <div>
                <button @click="setOneWeek();timeSelect='off';refresh()">近一周</button>
                <button @click="setOneMonth();timeSelect='off';refresh()">近一个月</button>
                <button @click="timeSelect='on'">指定时间</button>
            </div>
            <div v-show="timeSelect==='on'">
                <input type="date" v-model="selectStartDate">
                <a>至</a>
                <input type="date" v-model="selectEndDate" :min="selectStartDate">
                <button @click="setTimeInterval();refresh()">确定</button>
                <button @click="timeSelect='off'">取消</button>
            </div>
            <table border="1">
              <tr>
                <th>评估时间</th>
                <th>得分</th>
                <th>备注</th>
              </tr>
              <tr v-for="evaluation in evaluationHistory" :key="evaluation.serialNo">
                <td>{{ evaluation.recordTime }}</td>
                <td>{{ evaluation.value }}</td>
                <td>{{ evaluation.memo }}</td>
              </tr>
            </table>
        </div>
        <div v-if="type===6">
            <h4>转诊历史</h4>
            <table border="1">
              <tr>
                <th>开始时间</th>
                <th>结束时间</th>
                <th>转诊状态</th>
                <th>转诊类型</th>
                <th>转诊目的</th>
                <th>转诊原因</th>
              </tr>
              <tr v-for="referral in referralHistory" :key="referral.serialNo">
                <td>{{ referral.startDateTime }}</td>
                <td>{{ referral.endDateTime }}</td>
                <td>{{ $dict.referralStatus[referral.status] }}</td>
                <td>{{ $dict.referralType[referral.referralType] }}</td>
                <td>{{ $dict.referralPurpose[referral.referralPurpose] }}</td>
                <td>{{ referral.referralReason }}</td>
              </tr>
            </table>
        </div>
        <div v-if="type===3||type===4||type===6" class="page-bar">
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
                      <select v-model="pageOffset" @change="refresh">
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
  name: 'PatientInfo',
  components: {},
  inject: ['reload'],
  data () {
    return {
      // page params
      isOptional: false,
      type: 0,
      recordType: 1,
      totalEl: 0,
      totalPages: 0,
      pageIndex: 1,
      pageOffset: 5,
      startDate: '',
      endDate: '',
      selectStartDate: '',
      selectEndDate: '',
      timeSelect: 'off',
      patientID: '',
      alertSerialNo: null,
      followupPlanSerialNo: null,
      interveneAll: null,
      patientAlertList: null,
      // baseInfo
      baseInfo: {},
      manageInfo: {},
      referralInfo: {},
      // history
      alertHistory: [],
      followupHistory: [],
      managePlanHistory: [],
      referralHistory: [],
      // record
      evaluationHistory: [],
      catHistory: [],
      hadHistory: [],
      pefHistory: [],
      smwtHistory: [],
      weightHistory: [],
      discomfortHistory: [],
      drugHistory: [],
      // trans data
      doctorName: '',
      orgName: '',
      referralOrgName: '',
      referralDoctorName: ''
    }
  },
  methods: {
    goBack () {
      this.$router.back(-1)
    },
    fetchData () {
      switch (this.type) {
        case 0: this.fetchInfo(); break
        case 1: this.fetchManagePlanHistory(); break
        case 2: this.fetchRecord(this.recordType); break
        case 3: this.fetchAlertHistory(); break
        case 4: this.fetchFollowupHistory(); break
        case 5: this.recordType = 6; this.fetchRecord(this.recordType); break
        case 6: this.fetchReferralHistory(); break
      }
    },
    getDoctorNameByDoctorID (doctorID) {
      this.$axios({
        url: 'http://localhost:18908/user/doctor/name',
        method: 'get',
        params: {
          doctorID: doctorID
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.doctorName = res.data.data
        }
      })
    },
    getReferralDoctorName (doctorID) {
      this.$axios({
        url: 'http://localhost:18908/user/doctor/name',
        method: 'get',
        params: {
          doctorID: doctorID
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.referralDoctorName = res.data.data
        }
      })
    },
    getOrgNameByDoctorID (doctorID) {
      this.$axios({
        url: 'http://localhost:18908/user/doctor/orgname',
        method: 'get',
        params: {
          doctorID: doctorID
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.orgName = res.data.data
        }
      })
    },
    getOrgNameByOrgCode (orgCode) {
      this.$axios({
        url: 'http://localhost:18908/dict/org/name',
        method: 'get',
        params: {
          orgCode: orgCode
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.referralOrgName = res.data.data
        }
      })
    },
    fetchInfo () {
      this.$axios({
        url: 'http://localhost:18908/user/patient/detail/baseinfo',
        method: 'get',
        params: {
          patientID: this.patientID
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.baseInfo = res.data.data
        }
      })
      this.$axios({
        url: 'http://localhost:18908/user/patient/detail/manage',
        method: 'get',
        params: {
          patientID: this.patientID
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.manageInfo = res.data.data
          this.getDoctorNameByDoctorID(this.manageInfo.doctorID)
          this.getOrgNameByDoctorID(this.manageInfo.doctorID)
        }
      })
      this.$axios({
        url: 'http://localhost:18908/user/patient/detail/referral',
        method: 'get',
        params: {
          patientID: this.patientID
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.referralInfo = res.data.data
          this.getOrgNameByOrgCode(this.referralInfo.orgCode)
          if (this.referralInfo.doctorID !== null) {
            this.getReferralDoctorName(this.referralInfo.doctorID)
          }
        }
      })
    },
    fetchAlertHistory () {
      this.$axios({
        url: 'http://localhost:18908/user/patient/history/alert/page',
        method: 'get',
        params: {
          patientID: this.patientID,
          pageIndex: this.pageIndex,
          pageOffset: this.pageOffset
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.alertHistory = res.data.data.content
          this.totalEl = res.data.data.totalElements
          this.totalPages = res.data.data.totalPages
          this.pageIndex = res.data.data.number + 1
          this.pageOffset = res.data.data.size
        }
      })
    },
    fetchFollowupHistory () {
      this.$axios({
        url: 'http://localhost:18908/user/patient/history/followup/page',
        method: 'get',
        params: {
          patientID: this.patientID,
          pageIndex: this.pageIndex,
          pageOffset: this.pageOffset
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.followupHistory = res.data.data.content
          this.totalEl = res.data.data.totalElements
          this.totalPages = res.data.data.totalPages
          this.pageIndex = res.data.data.number + 1
          this.pageOffset = res.data.data.size
        }
      })
    },
    fetchReferralHistory () {
      this.$axios({
        url: 'http://localhost:18908/user/patient/history/referral/page',
        method: 'get',
        params: {
          patientID: this.patientID,
          pageIndex: this.pageIndex,
          pageOffset: this.pageOffset
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.referralHistory = res.data.data.content
          this.totalEl = res.data.data.totalElements
          this.totalPages = res.data.data.totalPages
          this.pageIndex = res.data.data.number + 1
          this.pageOffset = res.data.data.size
        }
      })
    },
    fetchRecord (recordType) {
      this.$axios({
        url: 'http://localhost:18908/data/fetch/list',
        method: 'get',
        params: {
          patientID: this.patientID,
          startDate: this.startDate,
          endDate: this.endDate,
          type: recordType
        }
      }).then(res => {
        const result = res.data.data
        if (res.data.data !== null) {
          switch (recordType) {
            case 1: this.catHistory = result; break
            case 2: this.hadHistory = result; break
            case 3: this.pefHistory = result; break
            case 4: this.drugHistory = result; break
            case 5: this.discomfortHistory = result; break
            case 6: this.evaluationHistory = result; break
            case 7: this.weightHistory = result; break
            case 8: this.smwtHistory = result; break
          }
        }
      })
    },
    fetchManagePlanHistory () {
      this.$axios({
        url: 'http://localhost:18908/user/patient/history/plan',
        method: 'get',
        params: {
          patientID: this.patientID
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.managePlanHistory = res.data.data.content
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
    setOneWeek () {
      var today = new Date(new Date().setHours(0, 0, 0, 0))
      var oneWeek = new Date(new Date().setHours(0, 0, 0, 0) - 8 * 24 * 60 * 60 * 1000)
      this.startDate = oneWeek.toLocaleDateString()
      this.endDate = today.toLocaleDateString()
    },
    setOneMonth () {
      var today = new Date(new Date().setHours(0, 0, 0, 0))
      var oneMonth = new Date(new Date().setHours(0, 0, 0, 0) - 31 * 24 * 60 * 60 * 1000)
      this.startDate = oneMonth.toLocaleDateString()
      this.endDate = today.toLocaleDateString()
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
    this.setOneWeek()
    this.patientID = this.$route.query.patientID
    if (this.$route.query.alertSerialNo !== undefined) {
      this.alertSerialNo = this.$route.query.alertSerialNo
    }
    if (this.$route.query.followupPlanSerialNo !== undefined) {
      this.followupPlanSerialNo = this.$route.query.followupPlanSerialNo
    }
    if (this.$route.query.interveneAll !== undefined) {
      this.interveneAll = this.$route.query.interveneAll
    }
    if (this.interveneAll === true) {
      this.patientAlertList = this.$route.params.patientAlertList
    }
    if (this.$route.params.isOptional !== undefined) {
      this.isOptional = this.$route.params.isOptional
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
  },
  watch: {}
}
</script>
<style scoped>
    @import '../assets/page-bar.css'
</style>
