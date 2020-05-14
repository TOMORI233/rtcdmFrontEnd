<template>
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
        <td>管理开始时间</td>
        <td>管理终止时间</td>
        <td>关联医生</td>
        <td>关联机构</td>
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
        <td>{{ patient.manageStartDateTime }}</td>
        <td>{{ patient.terminationDateTime }}</td>
        <td>{{ patient.doctorName }}</td>
        <td>{{ patient.orgName }}</td>
        <td>
          <router-link :to="{name:'PatientInfo',query:{patientID:patient.patientID}}">查看</router-link>
          <a v-if="referralInManage===true">
            |<router-link :to="{name:'PatientInfo',query:{patientID:patient.patientID}}">转回</router-link>
          </a>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PatientIndexList',
  props: {
    patients: {
      type: Array,
      required: true
    },
    referralInManage: {
      type: Boolean,
      required: false
    }
  }
}
</script>
<style scoped>

</style>
