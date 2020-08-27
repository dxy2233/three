<template>
  <div class="hole-detail">
    <div class="search-box">
      <label>
        项目名称
        <input
          type="text"
          placeholder="请输入项目名称"
          v-model="tableForm.projectName"
        />
      </label>
      <label>
        项目当前责任人
        <input
          type="text"
          placeholder="项目当前责任人"
          v-model="tableForm.dutyUserName"
        />
      </label>
      <label>
        所属单位
        <baseCascader v-model="tableForm.orgId" :data="systemOrgNodeTree" />
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable :tableData="tableData.list">
      <baseCol prop="projectCode" label="项目编号" />
      <baseCol prop="projectName" label="项目名称" />
      <baseCol prop="dutyUserName" label="项目当前责任人" />
      <baseCol prop="dutyDepartment" label="责任部门" />
      <baseCol prop="orgName" label="所属单位" />
      <baseCol prop="firmName" label="项目厂商" />
      <baseCol prop="processNode" label="当前所处流程节点" />
      <baseCol label="操作">
        <template #button="props">
          <button @click="openDialog(props.row.processId)">查看</button>
        </template>
      </baseCol>
    </baseTable>

    <basePagination
      :currentPage.sync="tableForm.startPage"
      :total="tableData.total"
      :pages="tableData.pages"
      @changeCurrentPage="init"
    />

    <baseDialog :visible.sync="dialog" top="0" width="80%" class="scroll">
      <template #title>漏洞详情</template>
      <holeFile
        :tableForm="holeFileTableForm"
        :tableData="holeFileTableData"
        @init="hoelFileInit"
      />
    </baseDialog>
  </div>
</template>

<script>
import { getFlawDetailInfoPage, getFlawListByProcessId } from '@api/flawCommon'
import { orgTree } from '@/assets/mixin/common'
import holeFile from '@/components/holeFile'

export default {
  name: 'HoleDetail',
  mixins: [orgTree],
  components: {
    holeFile,
  },
  data() {
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectName: '',
        dutyUserName: '',
        orgId: '',
      },
      tableData: {},
      dialog: false,
      holeFileTableForm: {
        startPage: 1,
        pageSize: 20,
        processId: '',
      },
      holeFileTableData: {},
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(isSearch) {
      if (isSearch) this.tableForm.startPage = 1
      getFlawDetailInfoPage(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    openDialog(processId) {
      this.holeFileTableForm.startPage = 1
      this.holeFileTableForm.processId = processId
      getFlawListByProcessId(this.holeFileTableForm).then((res) => {
        this.holeFileTableData = res.data
        this.dialog = true
      })
    },
    hoelFileInit() {
      getFlawListByProcessId(this.holeFileTableForm).then((res) => {
        this.holeFileTableData = res.data
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.scroll {
  /deep/ .dialog-body {
    max-height: calc(100vh - 45px);
    overflow-y: auto;
  }
}
</style>
