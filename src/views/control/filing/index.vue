<template>
  <div class="filing">
    <div class="search-box">
      <button
        v-if="info.visibleMap.createProject"
        @click="openDialog('新建备案')"
      >
        <svg-icon icon-class="add" />新建备案
      </button>
      <button v-if="info.visibleMap.createProject" @click="uploadFile">
        <svg-icon icon-class="import" />导入备案
      </button>
      <button v-if="info.visibleMap.createProject" @click="downloadFile">
        <svg-icon icon-class="down" />下载备案模板
      </button>
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
      <label v-if="info.visibleMap.orgTree">
        所属单位
        <baseCascader v-model="tableForm.orgId" :data="systemOrgNodeTree" />
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <!-- 上传文件input -->
    <input type="file" ref="filingFile" @change="upload($event)" />

    <baseTable
      :tableData="tableData.list"
      @rowClick="clickTable"
      :rowClass="tableRowClassName"
    >
      <baseCol prop="projectCode" label="项目编号" />
      <baseCol prop="projectName" label="项目名称" />
      <baseCol prop="projectBudget" label="项目预算(万)" />
      <baseCol prop="reportPersonUserName" label="填报人" />
      <baseCol prop="reportTime" label="填报时间" />
      <baseCol prop="dutyDepartmentName" label="责任部门" />
      <baseCol prop="fundsSource" label="资金来源" />
      <baseCol prop="recordLevel" label="备案级别" />
      <baseCol prop="ipAddressNum" label="使用公网IP数量" />
      <baseCol prop="orgName" label="运营商" />
      <baseCol prop="examineStatus" label="审核状态">
        <template #button="props">
          {{ props.row.examineStatus | examineStatusFilter }}
        </template>
      </baseCol>
      <baseCol prop="examineSuggest" label="审核建议" />
      <baseCol label="操作">
        <template #button="props">
          <button
            v-if="props.row.editVisble"
            @click.stop="openDialog('编辑备案', props.row)"
          >
            编辑
          </button>
          <button
            v-if="props.row.deleteVisble"
            class="remove"
            @click.stop="remove(props.row.id)"
          >
            删除
          </button>
          <button v-if="props.row.examineVisble" @click="openCheck(props.row)">
            审核
          </button>
        </template>
      </baseCol>
    </baseTable>

    <basePagination
      :currentPage.sync="tableForm.startPage"
      :total="tableData.total"
      :pages="tableData.pages"
      @changeCurrentPage="init"
    />

    <baseDialog :visible.sync="dialog" @closed="closedDialog">
      <template #title>{{ dialogTitle }}</template>
      <baseForm ref="filingForm" :form="form" :rules="rules">
        <baseFormItem label="项目编号" prop="projectCode" required>
          <input
            type="text"
            v-model="form.projectCode"
            placeholder="请输入由字母、数字、- 、 _ 或 . 组成的项目编号"
          />
        </baseFormItem>
        <baseFormItem label="项目名称" prop="projectName" required>
          <input
            type="text"
            v-model="form.projectName"
            placeholder="请输入项目名称"
          />
        </baseFormItem>
        <baseFormItem label="项目预算(万)" prop="projectBudget" required>
          <input
            type="text"
            v-model="form.projectBudget"
            placeholder="请输入项目预算金额"
          />
        </baseFormItem>
        <baseFormItem label="运营商" prop="orgId" required>
          <select v-model="form.orgId" @change="changeOrg(form.orgId)">
            <option
              v-for="(item, index) in operatorNameList"
              :key="index"
              :value="item.id"
            >
              {{ item.orgName }}
            </option>
          </select>
        </baseFormItem>
        <baseFormItem label="责任部门" prop="dutyDepartment" required>
          <baseCascader
            v-model="form.dutyDepartment"
            :data="dutyDepartmentData"
            placeholder="请输入责任部门"
            :disabled="dialogTitle === '备案详情'"
          />
        </baseFormItem>
        <baseFormItem label="资金来源" prop="fundsSource" required>
          <input
            type="text"
            v-model="form.fundsSource"
            placeholder="请输入资金来源"
          />
        </baseFormItem>
        <baseFormItem label="定级备案" prop="recordValid" required>
          <label>
            <input type="radio" v-model="form.recordValid" :value="1" />
            是
          </label>
          <label>
            <input
              type="radio"
              v-model="form.recordValid"
              :value="0"
              @change="form.recordLevel = ''"
            />
            否
          </label>
        </baseFormItem>
        <baseFormItem
          v-if="form.recordValid === 1"
          label="备案级别"
          prop="recordLevel"
          required
        >
          <label>
            <input type="radio" v-model="form.recordLevel" value="1" />
            1
          </label>
          <label>
            <input type="radio" v-model="form.recordLevel" value="2" />
            2
          </label>
          <label>
            <input type="radio" v-model="form.recordLevel" value="3" />
            3
          </label>
          <label>
            <input type="radio" v-model="form.recordLevel" value="4" />
            4
          </label>
          <label>
            <input type="radio" v-model="form.recordLevel" value="5" />
            5
          </label>
        </baseFormItem>
        <baseFormItem label="是否使用公网IP" prop="ipAddressValid" required>
          <label>
            <input type="radio" v-model="form.ipAddressValid" :value="1" />
            是
          </label>
          <label>
            <input
              type="radio"
              v-model="form.ipAddressValid"
              :value="0"
              @change="form.ipAddressNum = ''"
            />
            否
          </label>
        </baseFormItem>
        <baseFormItem
          v-if="form.ipAddressValid === 1"
          label="使用公网IP数量"
          prop="ipAddressNum"
          required
        >
          <input type="number" v-model="form.ipAddressNum" />
        </baseFormItem>
        <button v-if="dialogTitle !== '备案详情'" type="button" @click="submit">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>

    <!-- 审核 -->
    <baseDialog :visible.sync="dialogCheck" @closed="closedCheck">
      <template #title>项目审核</template>
      <baseForm ref="flowCheckForm" :form="checkForm" :rules="checkRules">
        <baseFormItem label="项目名称">{{ checkForm.name }}</baseFormItem>
        <baseFormItem label="审核结果" prop="examineStatus" required>
          <label>
            <input type="radio" v-model="checkForm.examineStatus" value="1" />
            通过
          </label>
          <label>
            <input type="radio" v-model="checkForm.examineStatus" value="2" />
            未通过
          </label>
        </baseFormItem>
        <baseFormItem label="审核建议" prop="examineSuggest" required>
          <textarea
            cols="30"
            rows="10"
            v-model="checkForm.examineSuggest"
          ></textarea>
        </baseFormItem>
        <button type="button" @click="check">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import {
  getInfoPage,
  saveProjectInfo,
  deleteProjectInfoById,
  getOperator,
  importProject,
  checkExamineStatus,
} from '@api/projectInfo'
import { getSystemOrgNodeTreeById } from '@api/systemOrgNode'
import { downloadTemplate } from '@api/template'
import { projectCode } from '@/utils/validate'
import { orgTree } from '@/assets/mixin/common'
import { mapGetters } from 'vuex'

export default {
  name: 'Filing',
  mixins: [orgTree],
  filters: {
    examineStatusFilter(val) {
      switch (val) {
        case 0:
          return '未审核'
        case 1:
          return '已通过'
        case 2:
          return '未通过'
      }
    },
  },
  data() {
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectCode: '',
        projectName: '',
        orgId: '',
      },
      tableData: {},
      dialog: false,
      dialogTitle: '',
      form: {
        id: '',
        projectCode: '',
        projectName: '',
        projectBudget: '',
        dutyDepartment: '',
        fundsSource: '',
        recordValid: '',
        recordLevel: '',
        ipAddressValid: '',
        ipAddressNum: '',
        orgId: '',
      },
      rules: {
        projectCode: [
          { required: true, message: '请输入项目编号', trigger: 'blur' },
          {
            validator: projectCode,
            message: '请输入由字母、数字、- 、 _ 或 . 组成的6-32位项目编号',
            trigger: 'blur',
          },
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        projectBudget: [
          { required: true, message: '请输入项目预算', trigger: 'blur' },
        ],
        dutyDepartment: [
          { required: true, message: '请输入责任部门', trigger: 'blur' },
        ],
        fundsSource: [
          { required: true, message: '请输入资金来源', trigger: 'blur' },
        ],
        recordValid: [
          { required: true, message: '请选择是否定级备案', trigger: 'change' },
        ],
        recordLevel: [
          { required: true, message: '请选择备案级别', trigger: 'change' },
        ],
        ipAddressValid: [
          {
            required: true,
            message: '请选择是否使用公网IP',
            trigger: 'change',
          },
        ],
        ipAddressNum: [
          { required: true, message: '请输入公网IP个数', trigger: 'blur' },
        ],
        orgId: [
          { required: true, message: '请输入选择运营商', trigger: 'change' },
        ],
      },
      dutyDepartmentData: [],
      operatorNameList: [],
      dialogCheck: false,
      checkForm: {
        name: '',
        id: '',
        examineStatus: '',
        examineSuggest: '',
      },
      checkRules: {
        examineStatus: [
          { required: true, message: '请选择审核结果', trigger: 'change' },
        ],
        examineSuggest: [
          { required: true, message: '请输入审核建议', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['info']),
  },
  created() {
    this.init()
  },
  methods: {
    init(isSearch) {
      if (isSearch) this.tableForm.startPage = 1
      getInfoPage(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    clickTable(item) {
      this.openDialog('备案详情', item)
    },
    openDialog(type, info) {
      this.dialogTitle = type
      // 获取运营商列表
      getOperator().then((res) => {
        this.operatorNameList = res.data
      })
      // 获取责任部门
      if (info) {
        getSystemOrgNodeTreeById(info.orgId).then((res) => {
          this.dutyDepartmentData = res.data
          this.form = JSON.parse(JSON.stringify(info))
          if (type === '备案详情') {
            this.$nextTick(() => {
              this.$refs.filingForm.$el
                .querySelectorAll('input, select')
                .forEach((item) => (item.disabled = true))
            })
          }
        })
      }
      this.dialog = true
    },
    closedDialog() {
      for (const i in this.form) this.form[i] = ''
      this.$refs.filingForm.clearErr()
      this.$nextTick(() => {
        this.$refs.filingForm.$el
          .querySelectorAll('input, select')
          .forEach((item) => (item.disabled = false))
      })
    },
    remove(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteProjectInfoById(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    openCheck(info) {
      this.checkForm.name = info.projectName
      this.checkForm.id = info.id
      this.checkForm.examineStatus = info.examineStatus
      this.checkForm.examineSuggest = info.examineSuggest
      this.dialogCheck = true
    },
    closedCheck() {
      for (const i in this.checkForm) this.checkForm[i] = ''
      this.$refs.flowCheckForm.clearErr()
    },
    check() {
      if (!this.$refs.flowCheckForm.validate()) return
      checkExamineStatus(this.checkForm).then((res) => {
        this.init()
        this.$message({ content: res.message, type: 'success' })
        this.dialogCheck = false
      })
    },
    submit() {
      if (!this.$refs.filingForm.validate()) return
      saveProjectInfo(this.form).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.init()
        this.dialog = false
      })
    },
    changeOrg(id) {
      getSystemOrgNodeTreeById(id).then((res) => {
        this.form.dutyDepartment = ''
        this.dutyDepartmentData = res.data
      })
    },
    // 下载模板
    downloadFile() {
      downloadTemplate(1)
    },
    // 上传备案
    uploadFile() {
      this.$refs.filingFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      let formData = new FormData()
      formData.append('myfile', e.target.files[0])
      importProject(formData).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.init()
      })
      this.$refs.filingFile.value = null
    },
    tableRowClassName(row) {
      if (row.examineStatus === 2) return 'prompt'
    },
  },
}
</script>

<style lang="scss" scoped>
table {
  cursor: pointer;
}

.filing {
  /deep/ .prompt {
    background: #ffecec;
  }
}
</style>
