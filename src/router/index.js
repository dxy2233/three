import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: 'login' */ '../views/login/index'),
    hidden: true,
  },
  {
    path: '/reportform',
    name: 'ReportForm',
    component: () =>
      import(/* webpackChunkName: 'report-form' */ '../views/reportForm'),
    hidden: true,
  },
]

export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: '/filing',
    meta: { title: '项目管控', icon: '' },
    children: {
      xmba: {
        path: 'filing',
        component: () =>
          import(
            /* webpackChunkName: 'filing' */ '../views/control/filing/index'
          ),
        name: 'Filing',
        meta: { title: '项目备案', icon: 'backups' },
      },
      lcgk: {
        path: 'flow',
        component: () =>
          import(/* webpackChunkName: 'flow' */ '../views/control/flow/index'),
        name: 'Flow',
        meta: { title: '流程管控', icon: 'process' },
      },
      xmgk: {
        path: 'term',
        component: () => import(/* webpackChunkName: 'term' */ '../views/term'),
        name: 'Term',
        meta: { title: '项目管控', icon: 'project' },
      },
      ldlr: {
        path: 'hole',
        component: () => import(/* webpackChunkName: 'hole' */ '../views/hole'),
        name: 'Hole',
        meta: { title: '漏洞录入', icon: 'loophole' },
      },
      xmzcgk: {
        path: 'assets',
        component: () =>
          import(/* webpackChunkName: 'hole' */ '../views/assets'),
        name: 'Assets',
        meta: { title: '项目资产管控', icon: 'means' },
      },
      dsfxmgl: {
        path: 'otherterm',
        component: () =>
          import(/* webpackChunkName: 'otherterm' */ '../views/otherTerm'),
        name: 'Otherterm',
        meta: { title: '第三方项目管理情况', icon: 'three' },
      },
      xmldxq: {
        path: 'holedetail',
        component: () =>
          import(/* webpackChunkName: 'holedetail' */ '../views/holeDetail'),
        name: 'HoleDetail',
        meta: { title: '项目漏洞详情', icon: 'loophole' },
      },
    },
  },
  {
    path: '/count',
    component: Layout,
    redirect: '/count/chart',
    meta: { title: '数据统计', icon: '' },
    children: {
      xmtj: {
        path: 'chart',
        component: () =>
          import(/* webpackChunkName: 'chart' */ '../views/count/chart/index'),
        name: 'Chart',
        meta: { title: '项目统计', icon: 'count' },
      },
      lbtj: {
        path: 'list',
        component: () =>
          import(/* webpackChunkName: 'list' */ '../views/count/list/index'),
        name: 'List',
        meta: { title: '列表统计', icon: 'list' },
      },
    },
  },
  {
    path: '/audit',
    component: Layout,
    redirect: '/audit/check',
    meta: { title: '审计管理', icon: '' },
    children: {
      aqjc: {
        path: 'check',
        component: () =>
          import(
            /* webpackChunkName: 'check' */ '../views/control/check/index'
          ),
        name: 'Check',
        meta: { title: '安全审计', icon: 'check' },
      },
    },
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/user',
    meta: { title: '系统设置', icon: '' },
    children: {
      jcrylr: {
        path: 'censor',
        component: () =>
          import(
            /* webpackChunkName: 'censor' */ '../views/control/censor/index'
          ),
        name: 'Censor',
        meta: { title: '审计人员录入', icon: 'expert' },
      },
      fwslr: {
        path: 'servicer',
        component: () =>
          import(
            /* webpackChunkName: 'servicer' */ '../views/control/servicer/index'
          ),
        name: 'Servicer',
        meta: { title: '三同步服务商管理', icon: 'service' },
      },
      xmcsgl: {
        path: 'vendor',
        component: () =>
          import(/* webpackChunkName: 'servicer' */ '../views/vendor'),
        name: 'Vendor',
        meta: { title: '项目厂商管理', icon: 'factory' },
      },
      yhgl: {
        path: 'user',
        component: () =>
          import(/* webpackChunkName: 'user' */ '../views/setting/user/index'),
        name: 'User',
        meta: { title: '用户管理', icon: 'role' },
      },
      bmgl: {
        path: 'department',
        component: () =>
          import(
            /* webpackChunkName: 'department' */ '../views/setting/department/index'
          ),
        name: 'Unit',
        meta: { title: '部门管理', icon: 'department' },
      },
    },
  },
]

const router = new VueRouter({
  routes,
})

export default router
