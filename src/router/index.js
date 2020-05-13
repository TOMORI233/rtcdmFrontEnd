/*
 * @Author: TOMORI
 * @Date: 2020-05-13 13:15:22
 * @Last Modified by: TOMORI
 * @Last Modified time: 2020-05-13 13:46:37
 */
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import DocPatientList from '../components/DocPatientList.vue'
import ThisHosPatientList from '../components/ThisHosPatientList.vue'
import OtherHosPatientList from '../components/OtherHosPatientList.vue'
import AlertList from '../components/AlertList.vue'
import RegisterList from '../components/RegisterList.vue'
import ReferralReviewList from '../components/ReferralReviewList.vue'
import FollowupList from '../components/FollowupList.vue'
import IgnoreAlert from '../components/IgnoreAlert.vue'
import AddFollowupPlan from '../components/AddFollowupPlan.vue'
import RefuseRegister from '../components/RefuseRegister.vue'
import AddPatient from '../components/AddPatient.vue'
import RefuseReferral from '../components/RefuseReferral.vue'
import PatientInfo from '../components/PatientInfo.vue'
import SubmitFollowupRecord from '../components/SubmitFollowupRecord.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/docpatientlist',
      name: 'DocPatientList',
      component: DocPatientList
    },
    {
      path: '/thishospatientlist',
      name: 'ThisHosPatientList',
      component: ThisHosPatientList
    },
    {
      path: '/otherhospatientlist',
      name: 'OtherHosPatientList',
      component: OtherHosPatientList
    },
    {
      path: '/alertlist',
      name: 'AlertList',
      component: AlertList,
      children: [
        {
          path: 'ignore',
          name: 'IgnoreAlert',
          component: IgnoreAlert
        }
      ]
    },
    {
      path: '/registerlist',
      name: 'RegisterList',
      component: RegisterList,
      children: [
        {
          path: 'refuse',
          name: 'RefuseRegister',
          component: RefuseRegister
        },
        {
          path: 'add',
          name: 'AddPatient',
          component: AddPatient
        }
      ]
    },
    {
      path: '/referralreviewlist',
      name: 'ReferralReviewList',
      component: ReferralReviewList,
      children: [
        {
          path: 'refuse',
          name: 'RefuseReferral',
          component: RefuseReferral
        }
      ]
    },
    {
      path: '/followuplist',
      name: 'FollowupList',
      component: FollowupList,
      children: [
        {
          path: 'add',
          name: 'AddFollowupPlan',
          component: AddFollowupPlan
        }
      ]
    },
    {
      path: '/patientinfo',
      name: 'PatientInfo',
      component: PatientInfo
    },
    {
      path: '/submitfollowuprecord',
      name: 'SubmitFollowupRecord',
      component: SubmitFollowupRecord
    }
  ]
})
