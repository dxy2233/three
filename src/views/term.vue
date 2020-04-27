<template>
  <div class="term">
    <div class="search-box">
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

    <baseTable :tableData="tableData.list" :rowClass="tableRowClassName">
      <baseCol prop="projectCode" label="项目编号" />
      <baseCol prop="projectName" label="项目名称" />
      <baseCol prop="budget" label="项目预算(万)" />
      <baseCol prop="orgName" label="所属单位" />
      <baseCol prop="facilitator" label="服务商" />
      <baseCol prop="initiateStatus" label="立项状态">
        <template #button="props">
          <span
            :class="[
              { ready: props.row.initiateStatus === '未开始' },
              { ing: props.row.initiateStatus === '进行中' },
              { finish: props.row.initiateStatus === '完成' },
              { stop: props.row.initiateStatus === '项目暂停' },
            ]"
            >{{ props.row.initiateStatus }}</span
          >
        </template>
      </baseCol>
      <baseCol prop="designStatus" label="设计状态">
        <template #button="props">
          <span
            :class="[
              { ready: props.row.designStatus === '未开始' },
              { ing: props.row.designStatus === '进行中' },
              { finish: props.row.designStatus === '完成' },
              { stop: props.row.designStatus === '项目暂停' },
            ]"
            >{{ props.row.designStatus }}</span
          >
        </template>
      </baseCol>
      <baseCol prop="constructionStatus" label="建设状态">
        <template #button="props">
          <span
            :class="[
              { ready: props.row.constructionStatus === '未开始' },
              { ing: props.row.constructionStatus === '进行中' },
              { finish: props.row.constructionStatus === '完成' },
              { stop: props.row.constructionStatus === '项目暂停' },
            ]"
            >{{ props.row.constructionStatus }}</span
          >
        </template>
      </baseCol>
      <baseCol prop="acceptFirstStatus" label="初验状态">
        <template #button="props">
          <span
            :class="[
              { ready: props.row.acceptFirstStatus === '未开始' },
              { ing: props.row.acceptFirstStatus === '进行中' },
              { finish: props.row.acceptFirstStatus === '完成' },
              { stop: props.row.acceptFirstStatus === '项目暂停' },
            ]"
            >{{ props.row.acceptFirstStatus }}</span
          >
        </template>
      </baseCol>
      <baseCol prop="acceptFinalStatus" label="终验状态">
        <template #button="props">
          <span
            :class="[
              { ready: props.row.acceptFinalStatus === '未开始' },
              { ing: props.row.acceptFinalStatus === '进行中' },
              { finish: props.row.acceptFinalStatus === '完成' },
              { stop: props.row.acceptFinalStatus === '项目暂停' },
            ]"
            >{{ props.row.acceptFinalStatus }}</span
          >
        </template>
      </baseCol>
      <baseCol prop="maintainStatus" label="转维状态">
        <template #button="props">
          <span
            :class="[
              { ready: props.row.maintainStatus === '未开始' },
              { ing: props.row.maintainStatus === '进行中' },
              { finish: props.row.maintainStatus === '完成' },
              { stop: props.row.maintainStatus === '项目暂停' },
            ]"
            >{{ props.row.maintainStatus }}</span
          >
        </template>
      </baseCol>
      <baseCol
        v-if="info.visibleMap.waitExamine"
        prop="waitExamine"
        label="待审核文件"
      />
      <!-- <template #button="props">
          {{ props.row.maintainStatus }}
        </template>
      </baseCol> -->
      <baseCol label="操作">
        <template #button="props">
          <button @click="openDialog(props.row)">查看</button>
          <!-- <button
            v-if="props.row.pauseVisible && props.row.pause"
            @click="pause(props.row.processId, false)"
          >
            恢复
          </button>
          <button
            v-if="props.row.pauseVisible && !props.row.pause"
            class="remove"
            @click="pause(props.row.processId, true)"
          >
            暂停
          </button> -->
        </template>
      </baseCol>
    </baseTable>

    <basePagination
      :currentPage.sync="tableForm.startPage"
      :total="tableData.total"
      :pages="tableData.pages"
      @changeCurrentPage="init"
    />

    <baseDialog :visible.sync="dialog" width="80%" top="0">
      <template #title>管理系统详情</template>
      <flowForm v-if="dialog" :row="selectedRow" />
    </baseDialog>
  </div>
</template>

<script>
import { getProcessList } from '@/api/process'
import { getFacilitatorNameList } from '@/api/facilitator'
import { orgTree } from '@/assets/mixin/common'
import { mapGetters } from 'vuex'
import flowForm from '@/components/flowForm'

export default {
  name: 'Term',
  mixins: [orgTree],
  components: {
    flowForm,
  },
  data() {
    return {
      menusData: [],
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectCode: '',
        projectName: '',
        facilitator: '',
        orgId: '',
        type: 0,
      },
      tableData: [],
      facilitatorNameList: [],
      dialog: false,
      selectedRow: {},
    }
  },
  computed: {
    ...mapGetters(['info']),
  },
  created() {
    // // 获取统计数据
    // getStatisticsByType(3).then(res => {
    //   this.menusData = res.data.chartList
    // })
    this.init()
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
    // tableType(type) {
    //   if (type === this.tableForm.type) return
    //   this.tableForm.type = type
    //   this.init()
    // },
    // pause(id, type) {
    //   pauseProcess(id, type).then(res => {
    //     this.$message({ content: res.message, type: 'success' })
    //     this.init()
    //   })
    // },
    openDialog(row) {
      this.selectedRow = row
      this.dialog = true
    },
    tableRowClassName(row) {
      if (row.waitExamine) return 'prompt'
    },
  },
}
</script>

<style lang="scss" scoped>
.ready,
.ing,
.finish,
.stop {
  &::before {
    display: inline-block;
    width: 12px;
    height: 12px;
    content: '';
    border-radius: 50%;
    margin-right: 3px;
  }
}
.ready {
  &::before {
    background: #999;
  }
}
.ing {
  &::before {
    background: #13cf97;
  }
}
.finish {
  &::before {
    background: #158ae7;
  }
}
.stop {
  color: #ccc;
  &::before {
    background: #ccc;
  }
}

.term {
  /deep/ .prompt {
    background: #f7fce5;
  }
}
</style>
