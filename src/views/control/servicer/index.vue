<template>
  <div class="servicer">
    <div class="search-box">
      <button
        v-if="info.visibleMap.addFacilitator"
        @click="openDialog('新建服务商')"
      >
        <svg-icon icon-class="add" />新建服务商
      </button>
      <label>
        编号
        <input
          type="text"
          placeholder="请输入服务商编号"
          v-model="tableForm.id"
        />
      </label>
      <label>
        服务商名称<input
          type="text"
          placeholder="请输入服务商名称"
          v-model="tableForm.name"
        />
      </label>
      <label v-if="info.visibleMap.orgTree">
        所属单位<baseCascader
          v-if="info.visibleMap.orgTree"
          v-model="tableForm.orgId"
          :data="systemOrgNodeTree"
        />
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable :tableData="tableData.list">
      <baseCol prop="id" label="编号" />
      <baseCol prop="name" label="服务商名称" />
      <baseCol prop="startTime" label="服务开始时间" />
      <baseCol prop="endTime" label="服务结束时间" />
      <baseCol prop="personNames" label="服务人员" />
      <baseCol prop="orgName" label="填报单位" />
      <baseCol prop="qualification" label="是否符合资质">
        <template #button="props">
          {{ props.row.qualification | whether }}
        </template>
      </baseCol>
      <baseCol prop="qualificationName" label="资质证明">
        <template #button="props">
          <span
            @click="downloadQualification(props.row.qualificationPath)"
            class="link"
            >{{ props.row.qualificationName }}</span
          >
        </template>
      </baseCol>
      <baseCol label="操作">
        <template #button="props">
          <button @click="openStaffDialog(false, props.row)">人员管理</button>
          <button
            v-if="props.row.editVisble"
            @click="openDialog('编辑服务商', props.row)"
          >
            编辑
          </button>
          <button
            v-if="props.row.deleteVisble"
            class="remove"
            @click="removeService(props.row.id)"
          >
            删除
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
    <input type="file" ref="servicerFile" @change="upload($event)" />

    <!-- 服务商 -->
    <baseDialog :visible.sync="dialog" @closed="closedDialog">
      <template #title>{{ dialogTitle }}</template>
      <baseForm ref="servicerForm" :form="form" :rules="rules">
        <baseFormItem label="服务商名称" prop="name" required>
          <input type="text" v-model="form.name" />
        </baseFormItem>
        <baseFormItem label="服务开始时间" prop="startTime" required>
          <input type="date" v-model="form.startTime" />
        </baseFormItem>
        <baseFormItem label="服务结束时间" prop="endTime" required>
          <input type="date" v-model="form.endTime" />
        </baseFormItem>
        <baseFormItem label="是否符合资质" prop="qualification" required>
          <label>
            <input type="radio" v-model="form.qualification" :value="true" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.qualification" :value="false" />
            否
          </label>
        </baseFormItem>
        <baseFormItem label="资质证明" required>
          <button type="button" style="margin-left: 5px;" @click="uploadFile">
            点击上传
          </button>
          {{ form.qualificationName }}
        </baseFormItem>
        <button type="button" @click="submitService">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
    <!-- 人员管理 -->
    <baseDialog :visible.sync="dialogStaff">
      <template #title>人员管理</template>
      <button
        v-if="info.visibleMap.addFacilitator"
        @click="openStaffOne('增加人员')"
      >
        <svg-icon icon-class="add" />新增人员
      </button>
      <baseTable :tableData="staffTable">
        <baseCol prop="name" label="姓名" />
        <baseCol prop="sex" label="性别">
          <template #button="props">
            {{ props.row.sex | sexFilter }}
          </template>
        </baseCol>
        <baseCol prop="idCard" label="身份证" />
        <baseCol prop="practiceMode" label="联系方式" />
        <baseCol label="操作">
          <template #button="props">
            <button
              v-if="info.visibleMap.addFacilitator"
              @click="openStaffOne('编辑人员', props.row)"
            >
              编辑
            </button>
            <button
              v-if="info.visibleMap.addFacilitator"
              class="remove"
              @click="removeStaff(props.row.id)"
            >
              删除
            </button>
          </template>
        </baseCol>
      </baseTable>
    </baseDialog>
    <!-- 增加/编辑人员 -->
    <baseDialog :visible.sync="dialogStaffOne" @closed="closedStaffOne">
      <template #title>{{ dialogStaffOneTitle }}</template>
      <baseForm ref="staffOneForm" :form="staffOneForm" :rules="rulesStaffOne">
        <baseFormItem label="姓名" prop="name" required>
          <input type="text" v-model="staffOneForm.name" />
        </baseFormItem>
        <baseFormItem label="性别" prop="sex" required>
          <label>
            <input type="radio" v-model="staffOneForm.sex" value="1" />
            男
          </label>
          <label>
            <input type="radio" v-model="staffOneForm.sex" value="0" />
            女
          </label>
        </baseFormItem>
        <baseFormItem label="身份证" prop="idCard" required>
          <input type="text" v-model="staffOneForm.idCard" />
        </baseFormItem>
        <baseFormItem label="联系方式" prop="practiceMode" required>
          <input type="text" v-model="staffOneForm.practiceMode" />
        </baseFormItem>
        <button type="button" @click="submitStaff">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import {
  getInfoPage,
  saveFacilitator,
  qualificationUpload,
  deleteFacilitatorById,
  getPersonByFacilitatorId,
  saveFacilitatorPerson,
  deleteFacilitatorPersonById,
} from '@/api/facilitator'
import { download } from '@/api/sftp'
import { contact } from '@/utils/validate'
import { orgTree } from '@/assets/mixin/common'
import { mapGetters } from 'vuex'

export default {
  name: 'Servicer',
  mixins: [orgTree],
  filters: {
    whether(val) {
      return val ? '是' : '否'
    },
    sexFilter(val) {
      switch (val) {
        case 1:
          return '男'
        case 0:
          return '女'
      }
    },
  },
  data() {
    const qualificationRule = function (form) {
      if (form.qualification && form.qualificationPath === '') return false
      else return true
    }
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        id: '',
        name: '',
        orgId: '',
      },
      tableData: {},
      dialog: false,
      dialogTitle: '',
      form: {
        id: '',
        name: '',
        startTime: '',
        endTime: '',
        qualification: '',
        qualificationName: '',
        qualificationPath: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入服务商名称', trigger: 'blur' },
        ],
        startTime: [
          { required: true, message: '请输入服务开始时间', trigger: 'blur' },
        ],
        endTime: [
          { required: true, message: '请输入服务结束时间', trigger: 'blur' },
        ],
        qualification: [
          { required: true, message: '请输入是否符合资质', trigger: 'change' },
          {
            other: qualificationRule,
            message: '请上传资质证明',
            trigger: 'change',
          },
        ],
      },
      dialogStaff: false,
      staffTable: [],
      dialogStaffOne: false,
      dialogStaffOneTitle: '',
      staffOneForm: {
        id: '',
        facilitatorId: '',
        name: '',
        sex: '',
        idCard: '',
        practiceMode: '',
      },
      rulesStaffOne: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请输入性别', trigger: 'change' }],
        idCard: [
          { required: true, message: '请输入身份证', trigger: 'blur' },
          // { validator: idCard, message: '请输入正确的身份证', trigger: 'blur' }
        ],
        practiceMode: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          {
            validator: contact,
            message: '请输入正确的联系方式',
            trigger: 'blur',
          },
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
    downloadQualification(path) {
      download(path)
    },
    openDialog(type, info) {
      this.dialogTitle = type
      if (info) {
        this.form = JSON.parse(JSON.stringify(info))
      }
      this.dialog = true
    },
    closedDialog() {
      for (const i in this.form) this.form[i] = ''
      this.$refs.servicerForm.clearErr()
    },
    // 上传服务商信息
    submitService() {
      if (!this.$refs.servicerForm.validate()) return
      let subData = JSON.parse(JSON.stringify(this.form))
      saveFacilitator(subData).then((res) => {
        this.init()
        this.dialog = false
        this.$message({ content: res.message, type: 'success' })
      })
    },
    // 删除服务商
    removeService(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteFacilitatorById(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    // 打开人员管理
    openStaffDialog(type, info) {
      getPersonByFacilitatorId(info.id).then((res) => {
        this.staffTable = res.data
        this.staffOneForm.facilitatorId = info.id // 添加服务商id
        this.dialogStaff = true
      })
    },
    // 新增||编辑人员个人信息
    openStaffOne(type, info) {
      this.dialogStaffOneTitle = type
      if (info) {
        this.staffOneForm = {
          facilitatorId: this.staffOneForm.facilitatorId,
          ...JSON.parse(JSON.stringify(info)),
        }
      }
      this.dialogStaffOne = true
    },
    // 保存人员信息
    submitStaff() {
      if (!this.$refs.staffOneForm.validate()) return
      saveFacilitatorPerson(this.staffOneForm).then(() => {
        getPersonByFacilitatorId(this.staffOneForm.facilitatorId).then(
          (res) => {
            this.staffTable = res.data
            this.$message({ content: res.message, type: 'success' })
            this.dialogStaffOne = false
            this.init()
          }
        )
      })
    },
    // 关闭人员信息编辑的回调,保留facilitatorId
    closedStaffOne() {
      for (const i in this.staffOneForm)
        if (i !== 'facilitatorId') this.staffOneForm[i] = ''
      this.$refs.staffOneForm.clearErr()
    },
    removeStaff(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteFacilitatorPersonById(id).then(() => {
          getPersonByFacilitatorId(this.staffOneForm.facilitatorId).then(
            (res) => {
              this.staffTable = res.data
            }
          )
        })
      })
    },
    // 上传文件
    uploadFile() {
      this.$refs.servicerFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      let formData = new FormData()
      formData.append('file', e.target.files[0])
      this.$refs.servicerFile.value = null
      qualificationUpload(formData).then((res) => {
        this.form.qualificationName = res.data.qualificationName
        this.form.qualificationPath = res.data.qualificationPath
        this.$message({ content: res.message, type: 'success' })
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
