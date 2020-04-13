<template>
  <div class="report">
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
        当前所处节点
        <select v-model="tableForm.processNode">
          <option :value="0">全部</option>
          <option :value="1">立项</option>
          <option :value="2">设计</option>
          <option :value="3">建设</option>
          <option :value="4">初验</option>
          <option :value="5">终验</option>
          <option :value="6">转维</option>
          <option :value="7">暂停</option>
          <option :value="8">完成</option>
        </select>
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <!-- 上传文件input -->
    <input type="file" ref="reportFile" @change="upload($event)" />

    <baseTable :tableData="tableData.list">
      <baseCol prop="projectCode" label="项目编号" />
      <baseCol prop="projectName" label="项目名称" />
      <baseCol prop="processNodeName" label="当前所处节点" />
      <baseCol prop="reportTime" label="基线检查报告">
        <template #button="props">
          <div v-if="props.row.reportChild[0].name" class="report-col">
            <span class="link">{{ props.row.reportChild[0].name }}</span>
            <span>上传人：{{ props.row.reportChild[0].uploadName }}</span>
            <span>上传时间：{{ props.row.reportChild[0].uploadTime }}</span>
            <span @click="remove(props.row.reportChild[0])"
              ><svg-icon icon-class="delete"
            /></span>
          </div>
        </template>
      </baseCol>
      <baseCol prop="dutyDepartmentName" label="渗透测试报告">
        <template #button="props">
          <div v-if="props.row.reportChild[1].name" class="report-col">
            <span class="link">{{ props.row.reportChild[1].name }}</span>
            <span>上传人：{{ props.row.reportChild[1].uploadName }}</span>
            <span>上传时间：{{ props.row.reportChild[1].uploadTime }}</span>
            <span @click="remove(props.row.reportChild[1])"
              ><svg-icon icon-class="delete"
            /></span>
          </div>
        </template>
      </baseCol>
      <baseCol prop="fundsSource" label="漏洞扫描报告">
        <template #button="props">
          <div v-if="props.row.reportChild[2].name" class="report-col">
            <span class="link">{{ props.row.reportChild[2].name }}</span>
            <span>上传人：{{ props.row.reportChild[2].uploadName }}</span>
            <span>上传时间：{{ props.row.reportChild[2].uploadTime }}</span>
            <span @click="remove(props.row.reportChild[2])"
              ><svg-icon icon-class="delete"
            /></span>
          </div>
        </template>
      </baseCol>
      <baseCol label="操作">
        <template #button="props">
          <button @click="openDialog(props.row)">
            上传报告
          </button>
          <button>
            导出报告
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
      <baseForm ref="reportForm" :form="form" :rules="rules">
        <baseFormItem label="报告类型" prop="type" required>
          <select v-model="form.type">
            <option :value="1">基线检查报告</option>
            <option :value="2">渗透测试报告</option>
            <option :value="3">漏洞扫描报告</option>
          </select>
        </baseFormItem>
        <baseFormItem
          v-if="form.type === 1"
          label="报告生成方式"
          prop="mode"
          required
        >
          <label>
            <input type="radio" v-model="form.mode" value="1" />
            扫描工具生成
          </label>
          <label>
            <input type="radio" v-model="form.mode" value="2" />
            手工模板录入
          </label>
        </baseFormItem>
        <baseFormItem label="报告文件" prop="file" required>
          <button type="button" style="margin-left:5px" @click="uploadFile">
            点击上传
          </button>
          {{ form.file }}
        </baseFormItem>
        <button type="button" @click="submit">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import { getReportList, uploadReport, deleteReport } from '@/api/report'

export default {
  name: 'Report',
  data() {
    const formFileRule = function(form) {
      if (form.file) return true
      else return false
    }
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectCode: '',
        projectName: '',
        processNode: 0
      },
      tableData: {},
      dialog: false,
      dialogTitle: '上传报告',
      form: {
        id: null,
        type: null,
        mode: null,
        file: null
      },
      formData: new FormData(),
      rules: {
        type: [{ required: true, message: '请选择报告类型', trigger: 'blur' }],
        mode: [
          { required: true, message: '请选择报告生成方式', trigger: 'blur' }
        ],
        file: [
          {
            other: formFileRule,
            message: '请上传报告',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(isSearch) {
      if (isSearch) this.tableForm.startPage = 1
      getReportList(this.tableForm).then(res => {
        this.tableData = res.data
      })
    },
    uploadFile() {
      this.$refs.reportFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      this.formData.append('file', e.target.files[0])
      this.form.file = e.target.files[0].name
      this.$refs.reportFile.value = null
    },
    openDialog(info) {
      this.form.if = info.uuid
      this.dialog = true
    },
    closedDialog() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.reportForm.clearErr()
    },
    submit() {
      if (!this.$refs.reportForm.validate()) return
      this.formData.append('projectId', this.form.id)
      this.formData.append('type', this.form.type)
      if (this.form.type === 1) this.formData.append('mode', this.form.mode)
      uploadReport(this.formData).then(res => {
        this.$message({ content: res.message, type: 'success' })
        this.init()
        this.dialog = false
      })
    },
    remove(info) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteReport(info.fileId).then(res => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.report-col {
  position: relative;
  display: flex;
  flex-flow: column;
  padding-right: 10px;
  span {
    width: 90%;
  }
  span:nth-child(4) {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
    top: -5px;
    right: 0;
    bottom: -5px;
    background: #ebebeb;
    cursor: pointer;
    &:hover {
      background: #ff4949;
      svg {
        color: #fff;
      }
    }
    svg {
      color: #999;
      margin-right: -2px;
    }
  }
}
</style>
