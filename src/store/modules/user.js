import { asyncRouterMap } from '@/router/index'
import router from '@/router'
import { login, logout } from '@/api/special'
import { getUser } from '@/api/login'

const state = {
  token: sessionStorage.getItem('token'),
  info: {},
  allRoutes: [],
}

const mutations = {
  setToken: (state, token) => {
    state.token = token
  },
  setInfo: (state, info) => {
    state.info = info
  },
  setRoutes: (state, allRoutes) => {
    state.allRoutes = allRoutes
  },
}

const actions = {
  // 登陆
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then((res) => {
          commit('setToken', res.message)
          sessionStorage.setItem('token', res.message)
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 获取用户信息并返回可访问路由
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUser()
        .then((res) => {
          commit('setInfo', res.data)
          let resRouter = []
          const mapRouter = new Map([
            [0, ['xmba', 'lcgk', 'xmgk', 'ldlr', 'xgbg']],
            [1, ['xmtj', 'lbtj']],
            [2, ['aqjc']],
            [3, ['jcrylr', 'fwslr']],
            [4, ['yhgl', 'bmgl']],
          ])
          for (const [key, value] of mapRouter) {
            const resValue = value.filter((item) =>
              res.data.menus.includes(item)
            )
            if (resValue.length > 0) {
              let itemRouter = asyncRouterMap[key]
              resValue.forEach((item) => {
                itemRouter.children.push(asyncRouterMap[item])
              })
              resRouter.push(itemRouter)
            }
          }
          const allRoutes = router.options.routes.concat(resRouter)
          commit('setRoutes', allRoutes)
          resolve(resRouter)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // 注销
  logout() {
    return new Promise((resolve) => {
      logout()
      this.dispatch('user/resetToken')
      resolve()
    })
  },
  // 重置
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('setToken', '')
      commit('setInfo', {})
      commit('setRoutes', [])
      sessionStorage.removeItem('token')
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
