import { getSystemOrgNodeTree, getSearchNodeTree } from '@api/systemOrgNode'

const state = {
  systemOrgNodeTree: [],
  systemOrgNodeTreeSearch: [],
}

const mutations = {
  setOrgTree: (state, tree) => {
    state.systemOrgNodeTree = tree
  },
  setOrgTreeSearch: (state, tree) => {
    state.systemOrgNodeTreeSearch = tree
  },
}

const actions = {
  // 所属单位树
  getOrgTree({ commit }) {
    return new Promise((resolve, reject) => {
      getSystemOrgNodeTree()
        .then((res) => {
          commit('setOrgTree', res.data)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 通管局搜索栏所属单位树
  getOrgTreeSearch({ commit }) {
    return new Promise((resolve, reject) => {
      getSearchNodeTree()
        .then((res) => {
          commit('setOrgTreeSearch', res.data)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
