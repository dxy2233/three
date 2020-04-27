<template>
  <div class="flow">
    <div class="menus" :class="tableForm.type ? 'small' : 'full'">
      <!-- <div
      class="menus"
      :class="[tableForm.type ? 'small' : 'full', { am: amCount === 1 }]"
    > -->
      <div
        v-for="(item, index) in menusData"
        :key="index"
        @click="tableType(index + 1)"
        :class="{ active: index + 1 === tableForm.type }"
      >
        <span>{{ item.name }}</span>
        <span></span>
        <span>当前项目{{ item.value }}个</span>
      </div>
    </div>

    <div v-show="amCount > 1" class="search-box">
      <label>
        项目编号
        <input
          type="text"
          placeholder="请输入项目编号"
          v-model="tableForm.projectCode"
        />
      </label>
      <label>
        项目名称
        <input
          type="text"
          placeholder="请输入项目名称"
          v-model="tableForm.projectName"
        />
      </label>
      <label>
        服务商
        <select v-model="tableForm.facilitator">
          <option value="">全部</option>
          <option
            v-for="item in facilitatorNameList"
            :key="item.facilitatorId"
            :value="item.facilitatorId"
            >{{ item.facilitatorName }}</option
          >
        </select>
      </label>
      <label v-if="info.visibleMap.orgTree">
        所属单位
        <baseCascader
          v-if="info.visibleMap.orgTree"
          v-model="tableForm.orgId"
          :data="systemOrgNodeTree"
        />
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable
      v-show="amCount > 1"
      :tableData="tableData.list"
      :rowClass="tableRowClassName"
    >
      <baseCol prop="projectCode" label="项目编号" />
      <baseCol prop="projectName" label="项目名称" />
      <baseCol prop="budget" label="项目预算(万)" />
      <baseCol prop="orgName" label="所属单位" />
      <baseCol prop="facilitator" label="服务商" />
      <baseCol v-if="tableForm.type === 7" prop="reason" label="暂停原因" />
      <baseCol
        v-if="info.visibleMap.waitExamine"
        prop="waitExamine"
        label="待审核文件"
      />
      <baseCol label="操作">
        <template #button="props">
          <button @click="openDialog(props.row)">查看</button>
          <button
            v-if="props.row.pauseVisible && props.row.pause"
            @click="
              openPause(props.row.processId, false, props.row.projectName)
            "
          >
            恢复
          </button>
          <button
            v-if="props.row.pauseVisible && !props.row.pause"
            class="remove"
            @click="openPause(props.row.processId, true, props.row.projectName)"
          >
            暂停
          </button>
        </template>
      </baseCol>
    </baseTable>

    <basePagination
      v-show="amCount > 1"
      :currentPage.sync="tableForm.startPage"
      :total="tableData.total"
      :pages="tableData.pages"
      @changeCurrentPage="init"
    />

    <baseDialog :visible.sync="dialog" width="80%" top="0">
      <template #title>管理系统详情</template>
      <flowForm v-if="dialog" :row="selectedRow" />
    </baseDialog>
    <!-- 项目暂停恢复 -->
    <baseDialog :visible.sync="dialogPause" @closed="closedPause">
      <template #title>项目{{ dialogPauseTitle }}</template>
      <baseForm ref="flowPauseForm" :form="pauseForm" :rules="pauseRules">
        <baseFormItem label="项目名称">{{ pauseForm.name }}</baseFormItem>
        <baseFormItem :label="dialogPauseTitle + '原因'" prop="reason" required>
          <textarea cols="30" rows="10" v-model="pauseForm.reason"></textarea>
        </baseFormItem>
        <button type="button" @click="savePause">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import { getProcessList, pauseProcess } from '@/api/process'
import { getFacilitatorNameList } from '@/api/facilitator'
import { getStatisticsByType } from '@/api/statistics'
import { orgTree } from '@/assets/mixin/common'
import { mapGetters } from 'vuex'
import flowForm from '@/components/flowForm'

export default {
  name: 'Flow',
  mixins: [orgTree],
  components: {
    flowForm,
  },
  data() {
    return {
      menusData: [],
      amCount: 1, // 动画计数
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectCode: '',
        projectName: '',
        facilitator: '',
        orgId: '',
        type: '',
      },
      tableData: [],
      facilitatorNameList: [],
      dialog: false,
      selectedRow: {},
      dialogPause: false,
      dialogPauseTitle: '',
      pauseForm: {
        id: '',
        pause: false,
        reason: '',
        name: '',
      },
      pauseRules: {
        reason: [{ required: true, message: '请输入理由', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters(['info']),
  },
  created() {
    // 获取统计数据
    getStatisticsByType(3).then((res) => {
      this.menusData = res.data.chartList
    })
    // 获取服务商列表
    getFacilitatorNameList().then((res) => {
      this.facilitatorNameList = res.data
    })
  },
  methods: {
    init(isSearch) {
      if (isSearch) this.tableForm.startPage = 1
      getProcessList(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    tableType(type) {
      if (type === this.tableForm.type) return
      this.amCount++
      // setTimeout(() => {
      //   this.amCount++
      // }, 3000)
      this.tableForm.type = type
      this.init()
    },
    openDialog(row) {
      this.selectedRow = row
      this.dialog = true
    },
    openPause(id, type, name) {
      this.pauseForm.id = id
      this.pauseForm.pause = type
      this.pauseForm.name = name
      this.dialogPauseTitle = type ? '暂停' : '恢复'
      this.dialogPause = true
    },
    savePause() {
      if (!this.$refs.flowPauseForm.validate()) return
      pauseProcess(
        this.pauseForm.id,
        this.pauseForm.pause,
        this.pauseForm.reason
      ).then((res) => {
        this.init()
        this.$message({ content: res.message, type: 'success' })
        this.dialogPause = false
      })
    },
    closedPause() {
      Object.assign(this.$data.pauseForm, this.$options.data().pauseForm)
      this.$refs.flowPauseForm.clearErr()
    },
    tableRowClassName(row) {
      if (row.waitExamine) return 'prompt'
    },
  },
}
</script>

<style lang="scss" scoped>
.flow {
  .menus {
    // display: flex;
    div {
      background-image: linear-gradient(#158ae7, #158ae7, #43acff);
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
  }
  .full {
    // flex-wrap: wrap;
    // justify-content: center;
    margin: 5% auto 0 auto;
    width: 620px;
    height: 620px;
    position: relative;
    border-radius: 50%;
    div {
      position: absolute;
      width: 156px;
      height: 156px;
      margin: 0 1%;
      border-radius: 50%;
      box-shadow: 0 0 5px #158ae7;
      span {
        display: block;
      }
      span:first-child {
        margin-top: 40px;
        font-size: 22px;
      }
      span:nth-child(2) {
        width: 80%;
        height: 1px;
        margin: 10px auto;
        background: rgba(255, 255, 255, 0.2);
      }
      &:hover {
        transform: scale(1.1);
        background: #13cf97;
        transition: transform 2s;
      }
    }
    div:nth-child(1) {
      top: 0px;
      left: 225px;
    }
    div:nth-child(2) {
      top: 95px;
      left: 40px;
    }
    div:nth-child(3) {
      top: 285px;
      left: 0px;
    }
    div:nth-child(4) {
      top: 440px;
      left: 125px;
    }
    div:nth-child(5) {
      top: 440px;
      left: 330px;
    }
    div:nth-child(6) {
      top: 275px;
      left: 455px;
    }
    div:nth-child(7) {
      top: 90px;
      left: 410px;
    }
  }
  .small {
    display: flex;
    margin-bottom: 10px;
    div {
      width: 75px;
      height: 30px;
      line-height: 30px;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      margin-right: 1px;
      span:nth-child(2) {
        display: none;
      }
      span:nth-child(3) {
        display: none;
      }
    }
    .active {
      background: #13cf97;
    }
  }

  /deep/ .prompt {
    background: #f7fce5;
  }
  // .am {
  //   animation: narrow 3s;
  //   div {
  //     animation: narrow2 3s;
  //     span:first-child {
  //       animation: narrow3 3s;
  //     }
  //   }
  // }
}
// @keyframes narrow {
//   0% {
//     flex-wrap: wrap;
//     justify-content: center;
//     margin-top: 100px;
//     padding: 0 20%;
//   }
//   100% {
//     margin-bottom: 10px;
//   }
// }
// @keyframes narrow2 {
//   0% {
//     width: 200px;
//     height: 200px;
//     line-height: 200px;
//     margin: 0 2% 10px 1%;
//     border-radius: 50%;
//     display: flex;
//     flex-flow: column;
//     justify-content: center;
//     box-shadow: 0 0 5px #014192;
//   }
//   100% {
//     width: 75px;
//     height: 30px;
//     line-height: 30px;
//     border-top-left-radius: 3px;
//     border-top-right-radius: 3px;
//     margin-right: 1px;
//   }
// }
// @keyframes narrow3 {
//   0% {
//     font-size: 22px;
//   }
//   100% {
//     font-size: 14px;
//   }
// }
</style>
