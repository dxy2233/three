<template>
  <div class="assets">
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
      <label v-if="info.visibleMap.orgTree">
        所属部门
        <baseCascader
          v-if="info.visibleMap.orgTree"
          v-model="tableForm.orgId"
          :data="systemOrgNodeTree"
        />
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable :tableData="tableData.list">
      <baseCol prop="projectCode" label="项目编号" />
      <baseCol prop="projectName" label="项目名称" />
      <baseCol prop="orgName" label="所属部门" />
      <baseCol label="操作">
        <template #button="props">
          <button @click="openDialog('资产详情', props.row)">查看</button>
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
    <input type="file" ref="assetsFile" @change="upload($event)" />

    <baseDialog :visible.sync="dialog" width="80%">
      <template #title>资产详情</template>
      <button
        v-if="detailTable.importVisible"
        @click="dialogInputAssets = true"
      >
        <svg-icon icon-class="import" />导入资产
      </button>
      <button @click="downloadTem">
        <svg-icon icon-class="down" />下载模板
      </button>
      <button @click="downloadAssets">
        <svg-icon icon-class="down" />导出资产
      </button>
      <div class="table-wrap">
        <baseTable :tableData="detailTable.deviceList">
          <baseCol prop="serialNumber" label="序号" />
          <baseCol prop="importName" label="导入人" />
          <baseCol prop="deviceName" label="设备名称" />
          <baseCol prop="deviceSort" label="设备类型" />
          <baseCol prop="deviceType" label="设备厂家/型号" />
          <baseCol prop="position" label="机房位置" />
          <baseCol prop="cabinetNumber" label="机柜编号" />
          <baseCol prop="systemVersion" label="操作系统版本" />
          <baseCol prop="midVersion" label="中间件版本" />
          <baseCol prop="dbVersion" label="数据库版本" />
          <baseCol prop="privateAddress" label="私网IP地址" />
          <baseCol prop="dcnAddress" label="DCN网地址" />
          <baseCol prop="publicAddress" label="公网IP地址" />
          <baseCol prop="url" label="URL地址" />
          <baseCol prop="port" label="开放端口" />
          <baseCol prop="remark" label="备注" />
          <baseCol label="操作">
            <template #button="props">
              <button v-if="props.row.editVisible" @click="openEdit(props.row)">
                编辑
              </button>
              <button
                v-if="props.row.deleteVisible"
                class="remove"
                @click="removeAssets(props.row.id)"
              >
                删除
              </button>
            </template>
          </baseCol>
        </baseTable>
      </div>
    </baseDialog>

    <baseDialog :visible.sync="dialogInputAssets" @closed="closeInputAssets">
      <template #title>导入资产</template>
      <baseForm
        ref="inputAssetsForm"
        :form="inputAssetsForm"
        :rules="inputAssetsRules"
      >
        <baseFormItem label="导入人员" prop="importName" required>
          <input type="text" v-model="inputAssetsForm.importName" />
        </baseFormItem>
        <baseFormItem label="导入资产文件" prop="fileName" required>
          <button type="button" @click="uploadFile">点击上传文件</button>
          {{ inputAssetsForm.fileName }}
        </baseFormItem>
        <button type="button" @click="saveInputAssets">
          <svg-icon icon-class="save" />确认导入
        </button>
      </baseForm>
    </baseDialog>

    <baseDialog :visible.sync="dialogEditAssets">
      <template #title>编辑资产</template>
      <baseForm
        ref="assetsEditForm"
        :form="editAssetsForm"
        :rules="editAssetsRules"
      >
        <baseFormItem label="序号">
          <input type="text" v-model="editAssetsForm.serialNumber" />
        </baseFormItem>
        <baseFormItem label="设备名称" prop="deviceName" required>
          <input type="text" v-model="editAssetsForm.deviceName" />
        </baseFormItem>
        <baseFormItem label="设备类型" prop="deviceSort" required>
          <select v-model="editAssetsForm.deviceSort">
            <option value="服务器">服务器</option>
            <option value="网络设备">网络设备</option>
            <option value="安全设备">安全设备</option>
            <option value="web应用系统">web应用系统</option>
            <option value="其他">其他</option>
          </select>
        </baseFormItem>
        <baseFormItem label="设备厂家/型号">
          <input type="text" v-model="editAssetsForm.deviceType" />
        </baseFormItem>
        <baseFormItem label="机房位置">
          <input type="text" v-model="editAssetsForm.position" />
        </baseFormItem>
        <baseFormItem label="机柜编号">
          <input type="text" v-model="editAssetsForm.cabinetNumber" />
        </baseFormItem>
        <baseFormItem
          v-if="editAssetsForm.deviceSort === '服务器'"
          key="systemVersion1"
          label="操作系统版本"
          prop="systemVersion"
          required
        >
          <input type="text" v-model="editAssetsForm.systemVersion" />
        </baseFormItem>
        <baseFormItem v-else key="systemVersion2" label="操作系统版本">
          <input type="text" v-model="editAssetsForm.systemVersion" />
        </baseFormItem>
        <baseFormItem label="中间件版本">
          <input type="text" v-model="editAssetsForm.midVersion" />
        </baseFormItem>
        <baseFormItem label="数据库版本">
          <input type="text" v-model="editAssetsForm.dbVersion" />
        </baseFormItem>
        <baseFormItem label="私网IP地址">
          <input type="text" v-model="editAssetsForm.privateAddress" disabled />
        </baseFormItem>
        <baseFormItem label="DCN网地址">
          <input type="text" v-model="editAssetsForm.dcnAddress" disabled />
        </baseFormItem>
        <baseFormItem label="公网IP地址">
          <input type="text" v-model="editAssetsForm.publicAddress" disabled />
        </baseFormItem>
        <baseFormItem label="应用WEB URL地址">
          <input type="text" v-model="editAssetsForm.url" />
        </baseFormItem>
        <baseFormItem label="端口">
          <input type="text" v-model="editAssetsForm.port" />
        </baseFormItem>
        <baseFormItem label="备注">
          <input type="text" v-model="editAssetsForm.remark" />
        </baseFormItem>
        <button type="button" @click="saveEditAssets">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import { getProcessList } from '@api/process'
import {
  getDeviceList,
  importDevice,
  saveDevice,
  deleteDeviceById,
  downloadDevice,
} from '@api/device'
import { downloadTemplate } from '@api/template'
import { orgTree } from '@/assets/mixin/common'
import { mapGetters } from 'vuex'

export default {
  name: 'Assets',
  mixins: [orgTree],
  data() {
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectCode: '',
        projectName: '',
        type: 0,
        from: 1,
      },
      tableData: {},
      rowInfo: {},
      dialog: false,
      detailTable: {},
      dialogInputAssets: false,
      inputAssetsForm: {
        importName: '',
        fileName: '',
      },
      inputAssetsRules: {
        importName: [
          { required: true, message: '请输入导入人员', trigger: 'blur' },
        ],
        fileName: [
          { required: true, message: '请上传文件', trigger: 'change' },
        ],
      },
      inputAssetsFormData: new FormData(),
      dialogEditAssets: false,
      editAssetsForm: {
        id: '',
        processId: '',
        serialNumber: '',
        deviceName: '',
        deviceType: '',
        position: '',
        cabinetNumber: '',
        systemVersion: '',
        midVersion: '',
        dbVersion: '',
        privateAddress: '',
        dcnAddress: '',
        publicAddress: '',
        url: '',
        port: '',
        remark: '',
      },
      editAssetsRules: {
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
        deviceSort: [
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        systemVersion: [
          { required: true, message: '请输入操作系统版本', trigger: 'change' },
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
      getProcessList(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    openDialog(type, info) {
      this.rowInfo = info
      getDeviceList(info.processId).then((res) => {
        this.detailTable = res.data
        this.dialog = true
      })
    },
    uploadFile() {
      this.$refs.assetsFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      this.inputAssetsFormData.append('file', e.target.files[0])
      this.inputAssetsForm.fileName = e.target.files[0].name
      this.$refs.inputAssetsForm.validate()
      this.$refs.assetsFile.value = null
    },
    // 下载资产模板
    downloadTem() {
      downloadTemplate(2)
    },
    // 下载资产
    downloadAssets() {
      downloadDevice(this.rowInfo.processId)
    },
    saveInputAssets() {
      if (!this.$refs.inputAssetsForm.validate()) return
      this.inputAssetsFormData.append('processId', this.rowInfo.processId)
      this.inputAssetsFormData.append(
        'importName',
        this.inputAssetsForm.importName
      )
      importDevice(this.inputAssetsFormData).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        getDeviceList(this.rowInfo.processId).then((res) => {
          this.detailTable = res.data
          this.dialogInputAssets = false
        })
      })
    },
    closeInputAssets() {
      Object.assign(
        this.$data.inputAssetsForm,
        this.$options.data().inputAssetsForm
      )
      this.$refs.inputAssetsForm.clearErr()
      this.inputAssetsFormData = new FormData()
    },
    openEdit(info) {
      this.editAssetsForm = JSON.parse(JSON.stringify(info))
      this.dialogEditAssets = true
    },
    saveEditAssets() {
      if (!this.$refs.assetsEditForm.validate()) return
      saveDevice(this.editAssetsForm).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        getDeviceList(this.rowInfo.processId).then((res) => {
          this.detailTable = res.data
        })
        this.dialogEditAssets = false
      })
    },
    removeAssets(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteDeviceById(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          getDeviceList(this.rowInfo.processId).then((res) => {
            this.detailTable = res.data
          })
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.table-wrap {
  width: 100%;
  overflow-x: auto;
  table {
    width: 3000px;
  }
}
</style>
