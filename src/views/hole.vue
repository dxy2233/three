<template>
  <div class="hole">
    <div class="search-box">
      <button v-if="info.visibleMap.addFlaw" @click="openDialog('新建漏洞')">
        <svg-icon icon-class="add" />新建漏洞
      </button>
      <button v-if="info.visibleMap.addFlaw" @click="uploadFile(2)">
        <svg-icon icon-class="import" />漏洞导入
      </button>
      <label>
        项目名称
        <input
          type="text"
          placeholder="请输入项目名称"
          v-model="tableForm.projectName"
        />
      </label>
      <label>
        漏洞类型
        <select v-model="tableForm.leakType">
          <option :value="null">全部</option>
          <option :value="0">通用型漏洞</option>
        </select>
      </label>
      <label>
        危害级别
        <select v-model="tableForm.hazardLevel">
          <option :value="null">全部</option>
          <option :value="0">低</option>
          <option :value="1">中</option>
          <option :value="2">高</option>
        </select>
      </label>
      <label>
        漏洞标题
        <input
          type="text"
          placeholder="请输入漏洞标题"
          v-model="tableForm.title"
        />
      </label>
      <label>
        录入开始时间
        <input
          type="date"
          placeholder="请输入录入开始时间"
          v-model="tableForm.startTime"
        />
      </label>
      <label>
        录入结束时间
        <input
          type="date"
          placeholder="请输入录入结束时间"
          v-model="tableForm.endTime"
        />
      </label>
      <label>
        数据来源
        <select v-model="tableForm.sourceState">
          <option :value="null">全部</option>
          <option :value="0">录入</option>
          <option :value="1">导入</option>
        </select>
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable :tableData="tableData.list">
      <baseCol prop="name" label="项目名称" />
      <baseCol prop="operationUnit" label="运营单位" />
      <baseCol prop="ipAddr" label="IP" />
      <baseCol prop="title" label="漏洞标题" />
      <baseCol prop="leakType" label="漏洞类型">
        <template #button="props">
          {{ props.row.leakType | leakTypeFilter }}
        </template>
      </baseCol>
      <baseCol prop="sourceState" label="数据来源" />
      <baseCol prop="addTime" label="录入日期" />
      <baseCol prop="repairTime" label="整改时间" />
      <baseCol prop="hazardLevel" label="危害级别">
        <template #button="props">
          {{ props.row.hazardLevel | hazardLevelFilter }}
        </template>
      </baseCol>
      <baseCol label="操作">
        <template #button="props">
          <button
            v-if="props.row.editVisble"
            @click="openDialog('编辑漏洞', props.row)"
          >
            编辑
          </button>
          <button
            v-if="props.row.repairVisble"
            @click="changeHoleTime(props.row.id)"
          >
            整改
          </button>
          <button
            v-if="props.row.deleteVisble"
            class="remove"
            @click="remove(props.row.id)"
          >
            删除
          </button>
          <button v-if="props.row.exportVisble" @click="uploadWord(props.row)">
            导出
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

    <!-- 上传文件input -->
    <input type="file" ref="holeFile" @change="upload($event)" />

    <baseDialog :visible.sync="dialog" @closed="closedDialog">
      <template #title>{{ dialogTitle }}</template>
      <baseForm ref="holeForm" :form="form" :rules="rules">
        <baseFormItem label="项目名称" prop="projectId" required>
          <select v-model="form.projectId">
            <option
              v-for="(item, index) in maintainStatusProject"
              :key="index"
              :value="item.id"
              >{{ item.name }}</option
            >
          </select>
        </baseFormItem>
        <baseFormItem label="漏洞名称" prop="title" required>
          <input type="text" v-model="form.title" />
        </baseFormItem>
        <baseFormItem label="危害级别" prop="hazardLevel" required>
          <select v-model="form.hazardLevel">
            <option :value="0">低</option>
            <option :value="1">中</option>
            <option :value="2">高</option>
          </select>
        </baseFormItem>
        <baseFormItem label="影响系统" prop="influencingProducts" required>
          <textarea v-model="form.influencingProducts" rows="5"></textarea>
        </baseFormItem>
        <baseFormItem label="漏洞描述" prop="leakDescribe" required>
          <textarea v-model="form.leakDescribe" rows="5"></textarea>
        </baseFormItem>
        <baseFormItem label="漏洞解决方案">
          <textarea v-model="form.leakSolution" rows="5"></textarea>
        </baseFormItem>
        <baseFormItem label="漏洞类型" prop="leakType" required>
          <select v-model="form.leakType">
            <option :value="0">通用型漏洞</option>
          </select>
        </baseFormItem>
        <baseFormItem label="漏洞链接">
          <input type="text" v-model="form.flawLink" />
        </baseFormItem>
        <baseFormItem label="参考链接">
          <input type="text" v-model="form.referenceLink" />
        </baseFormItem>
        <baseFormItem label="验证信息">
          <select v-model="form.verificationInformation">
            <option :value="0">未验证</option>
            <option :value="1">验证</option>
          </select>
        </baseFormItem>
        <baseFormItem label="厂商补丁">
          <input type="text" v-model="form.vendorPatch" />
        </baseFormItem>
        <baseFormItem label="漏洞附件">
          <button type="button" @click="uploadFile(1)">点击上传附件</button>
          <div v-if="dialogTitle === '编辑漏洞' && form.attachmentName">
            <span @click="download(form.attachmentUrl)" class="down">{{
              form.attachmentName
            }}</span>
          </div>
        </baseFormItem>
        <button type="button" @click="submit">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import {
  getFlawPage,
  saveFlaw,
  flawAttachUpload,
  deleteFlawById,
  getFlawById,
  importFlaw,
  repairFlaw,
  downloadWord,
} from '@/api/flaw'
import { download } from '@/api/sftp'
import { getMaintainStatusProject } from '@/api/projectInfo'
import { mapGetters } from 'vuex'

export default {
  name: 'Hole',
  filters: {
    leakTypeFilter(val) {
      switch (val) {
        case 0:
          return '通用型漏洞'
      }
    },
    hazardLevelFilter(val) {
      switch (val) {
        case 0:
          return '低'
        case 1:
          return '中'
        case 2:
          return '高'
      }
    },
  },
  data() {
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectName: '',
        leakType: null,
        hazardLevel: null,
        title: '',
        startTime: '',
        endTime: '',
        sourceState: '',
      },
      tableData: {},
      dialog: false,
      dialogTitle: '',
      maintainStatusProject: [], // 进行中的项目
      form: {
        projectId: '',
        title: '',
        hazardLevel: '',
        influencingProducts: '',
        leakDescribe: '',
        leakSolution: '',
        leakType: '',
        flawLink: '',
        referenceLink: '',
        verificationInformation: '',
        vendorPatch: '',
        attachmentName: '',
        attachmentUrl: '',
      },
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' },
        ],
        title: [{ required: true, message: '请输入漏洞名称', trigger: 'blur' }],
        hazardLevel: [
          { required: true, message: '请选择危害级别', trigger: 'change' },
        ],
        influencingProducts: [
          { required: true, message: '请输入影响系统', trigger: 'blur' },
        ],
        leakDescribe: [
          { required: true, message: '请输入漏洞描述', trigger: 'blur' },
        ],
        leakType: [
          { required: true, message: '请选择漏洞类型', trigger: 'blur' },
        ],
      },
      uploadType: '',
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
      getFlawPage(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    openDialog(type, info) {
      this.dialogTitle = type
      // 获取进行中的项目
      getMaintainStatusProject().then((res) => {
        this.maintainStatusProject = res.data
      })
      if (info) {
        getFlawById(info.id).then((res) => {
          this.form = res.data
        })
      }
      this.dialog = true
    },
    closedDialog() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.holeForm.clearErr()
    },
    submit() {
      if (!this.$refs.holeForm.validate()) return
      saveFlaw(this.form).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.init()
        this.dialog = false
      })
    },
    uploadFile(type) {
      this.uploadType = type
      this.$refs.holeFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      let formData = new FormData()
      switch (this.uploadType) {
        case 1:
          formData.append('file', e.target.files[0])
          flawAttachUpload(formData).then((res) => {
            this.$message({ content: res.message, type: 'success' })
            this.form.attachmentName = res.data.attachmentName
            this.form.attachmentUrl = res.data.attachmentUrl
          })
          break
        case 2:
          formData.append('myfile', e.target.files[0])
          importFlaw(formData).then((res) => {
            this.$message({ content: res.message, type: 'success' })
            this.init()
          })
          break
      }
      this.$refs.holeFile.value = null
    },
    download(path) {
      download(path)
    },
    remove(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteFlawById(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    // 漏洞整改
    changeHoleTime(id) {
      repairFlaw(id).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.init()
      })
    },
    // 导出word文档
    uploadWord(info) {
      downloadWord(info)
    },
  },
}
</script>

<style lang="scss" scoped>
.down {
  color: #158ae7;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
