import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/layout'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
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

export const asyncRouterMap = {
  0: {
    path: '',
    component: Layout,
    redirect: '/filing',
    alwaysShow: false,
    meta: { title: '项目管控', icon: '' },
    children: [],
  },
  xmba: {
    path: 'filing',
    component: () =>
      import(/* webpackChunkName: 'filing' */ '../views/control/filing/index'),
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
  1: {
    path: '/count',
    component: Layout,
    redirect: '/count/chart',
    alwaysShow: false,
    meta: { title: '数据统计', icon: '' },
    children: [],
  },
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
  2: {
    path: '/audit',
    component: Layout,
    redirect: '/audit/check',
    alwaysShow: false,
    meta: { title: '审计管理', icon: '' },
    children: [],
  },
  aqjc: {
    path: 'check',
    component: () =>
      import(/* webpackChunkName: 'check' */ '../views/control/check/index'),
    name: 'Check',
    meta: { title: '安全审计', icon: 'check' },
  },
  3: {
    path: '/data',
    component: Layout,
    redirect: '/data/censor',
    alwaysShow: false,
    meta: { title: '数据维护', icon: '' },
    children: [],
  },
  jcrylr: {
    path: 'censor',
    component: () =>
      import(/* webpackChunkName: 'censor' */ '../views/control/censor/index'),
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
    meta: { title: '服务商录入', icon: 'service' },
  },
  4: {
    path: '/setting',
    component: Layout,
    redirect: '/setting/user',
    alwaysShow: false,
    meta: { title: '系统设置', icon: '' },
    children: [],
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
}

const router = new VueRouter({
  routes,
})

export default router
