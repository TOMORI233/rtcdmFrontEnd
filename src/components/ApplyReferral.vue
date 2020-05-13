<template>
    <div>
        <h4>转出申请</h4>
        <div>
            <form @submit.prevent="handleSubmit">
                <table border="1">
                    <tr>患者姓名：
                        <input type="text" disabled :value="name">
                    </tr>
                    <tr>转诊类型：
                        <input type="radio" :value="1" v-model="referralType" checked>上转
                        <input type="radio" :value="2" v-model="referralType">下转
                    </tr>
                    <tr>转诊目的：
                        <input type="radio" :value="0" v-model="referralPurpose" checked>住院
                        <input type="radio" :value="1" v-model="referralPurpose">门诊
                        <input type="radio" :value="2" v-model="referralPurpose">检查
                        <input type="radio" :value="3" v-model="referralPurpose">其他
                    </tr>
                    <tr>
                        <div>转诊原因：</div>
                        <textarea cols="30" rows="6" v-model="referralReason" placeholder="请输入转诊原因"></textarea>
                    </tr>
                    <tr>转诊医院：
                        <select v-model="divisionArray[0]" @change="divisionArray[1]='';divisionArray[2]='';targetOrgCode=''">
                            <option value="" selected>-请选择三级单位-</option>
                            <option v-for="(item0,index0) in divisionList" :key="index0" :value="index0">{{ item0.divisionName }}</option>
                        </select>
                        <select v-if="divisionArray[0]!==''&&divisionList[divisionArray[0]].children!==null" v-model="divisionArray[1]" @change="divisionArray[2]='';targetOrgCode=''">
                            <option value="" selected>-请选择二级单位-</option>
                            <option v-for="(item1,index1) in divisionList[divisionArray[0]].children" :key="index1" :value="index1">{{ item1.divisionName }}</option>
                        </select>
                        <select v-if="divisionArray[1]!==''&&divisionList[divisionArray[0]].children[divisionArray[1]].children!==null" v-model="divisionArray[2]" @change="targetOrgCode=''">
                            <option value="" selected>-请选择一级单位-</option>
                            <option v-for="(item2,index2) in divisionList[divisionArray[0]].children[divisionArray[1]].children" :key="index2" :value="index2">{{ item2.divisionName }}</option>
                        </select>
                        <select v-model="targetOrgCode">
                            <option value="" disabled>-请选择医院-</option>
                            <option v-for="hospital in hospitalList" :key="hospital.serialNo" :value="hospital.orgCode" :disabled="hospital.orgCode===orgCode">{{ hospital.orgName }}</option>
                        </select>
                    </tr>
                    <tr>转诊医生：
                        <select v-model="targetDoctorID">
                            <option value="" disabled>-未指定-</option>
                            <option v-for="doctor in doctorList" :key="doctor.userID" :value="doctor.userID">{{ doctor.name }}</option>
                        </select>
                    </tr>
                    <tr>申请人：
                        <input type="text" disabled :value="doctorName">
                    </tr>
                    <tr>
                        <input type="submit" value="保存">
                        <button type="button" @click="goBack">取消</button>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ApplyReferral',
  components: {},
  inject: [],
  data () {
    return {
      patientID: this.$route.query.patientID,
      name: this.$route.query.name,
      referralType: 1,
      referralPurpose: 0,
      referralReason: null,
      orgCode: window.sessionStorage.getItem('orgCode'),
      initiator: window.sessionStorage.getItem('userID'),
      alertSerialNo: this.$route.query.alertSerialNo,
      doctorName: '',
      targetOrgCode: '',
      targetDoctorID: '',
      hospitalList: [],
      doctorList: [],
      divisionList: [{}],
      divisionArray: ['', '', ''],
      selectedDivisionCode: ''
    }
  },
  methods: {
    goBack () {
      this.$router.back(-1)
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
    getDoctorNameByDoctorID () {
      this.$axios({
        url: 'http://localhost:18908/user/doctor/name',
        method: 'get',
        params: {
          doctorID: this.initiator
        }
      }).then(res => {
        if (res.data.data !== null) {
          this.doctorName = res.data.data
        }
      })
    },
    getDoctorsByOrgCode () {
      this.$axios({
        url: 'http://localhost:18908/user/doctor/list/anyhos',
        method: 'get',
        params: {
          orgCode: this.targetOrgCode
        }
      }).then(res => {
        this.doctorList = res.data.data
      })
    },
    handleSubmit () {
      if (this.targetOrgCode === '') {
        alert('请选择转诊医院')
      } else {
        this.submitReferralApply()
      }
    },
    submitReferralApply () {
      this.$axios({
        url: 'http://localhost:18908/manage/referral/apply',
        method: 'post',
        data: {
          doctorID: this.targetDoctorID,
          initiator: this.initiator,
          orgCode: this.targetOrgCode,
          patientID: this.patientID,
          referralPurpose: this.referralPurpose,
          referralReason: this.referralReason,
          referralType: this.referralType,
          alertSerialNo: this.alertSerialNo
        }
      }).then(res => {
        console.log(res.data)
        this.goBack()
      })
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
        }
      })
    }
  },
  created () {
    this.getDoctorNameByDoctorID()
    this.getDivisionList()
  },
  computed: {},
  watch: {
    targetOrgCode (val, oldVal) {
      this.getDoctorsByOrgCode()
      this.targetDoctorID = ''
    },
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

</style>
