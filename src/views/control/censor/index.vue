<template>
  <div class="censor">
    <div class="search-box">
      <button
        v-if="info.visibleMap.addExaminationPerson"
        @click="openDialog('新增人员')"
      >
        <svg-icon icon-class="add" />新增人员
      </button>
      <label>
        姓名
        <input
          type="text"
          placeholder="请输入检查人员姓名"
          v-model="tableForm.name"
        />
      </label>
      <label>
        联系方式
        <input
          type="text"
          placeholder="请输入手机号"
          v-model="tableForm.phone"
        />
      </label>
      <label>
        单位名称
        <input
          type="text"
          placeholder="请输入单位名称"
          v-model="tableForm.orgNodeName"
        />
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable :tableData="tableData.list">
      <baseCol prop="name" label="姓名" />
      <baseCol prop="sex" label="性别">
        <template #button="props">
          {{ props.row.sex | sexFilter }}
        </template>
      </baseCol>
      <baseCol prop="phone" label="联系方式" />
      <baseCol prop="idCard" label="身份证号" />
      <baseCol prop="orgNodeName" label="所属单位" />
      <baseCol prop="tel" label="办公电话" />
      <baseCol prop="qq" label="QQ" />
      <baseCol prop="email" label="邮件" />
      <baseCol label="操作">
        <template #button="props">
          <button @click="openDialog('编辑备案', props.row)">编辑</button>
          <button class="remove" @click="remove(props.row.id)">删除</button>
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
      <baseForm ref="censorForm" :form="form" :rules="relues">
        <baseFormItem label="姓名" prop="name" required>
          <input type="text" v-model="form.name" />
        </baseFormItem>
        <baseFormItem label="性别">
          <label>
            <input type="radio" value="1" v-model="form.sex" />
            男
          </label>
          <label>
            <input type="radio" value="0" v-model="form.sex" />
            女
          </label>
        </baseFormItem>
        <baseFormItem label="身份证号" prop="idCard" required>
          <input type="text" v-model="form.idCard" />
        </baseFormItem>
        <baseFormItem label="所属单位名称" prop="orgNodeName" required>
          <input type="text" v-model="form.orgNodeName" />
        </baseFormItem>
        <baseFormItem label="手机号码" prop="phone" required>
          <input type="text" v-model="form.phone" />
        </baseFormItem>
        <baseFormItem label="办公电话">
          <input type="text" v-model="form.tel" />
        </baseFormItem>
        <baseFormItem label="QQ">
          <input type="text" v-model="form.qq" />
        </baseFormItem>
        <baseFormItem label="邮件" prop="email" required>
          <input type="text" v-model="form.email" />
        </baseFormItem>
        <button type="button" @click="submit">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import { getExpertPage, save, deleteById } from '@/api/expert'
import { contact, email } from '@/utils/validate'
import { mapGetters } from 'vuex'

export default {
  name: 'Censor',
  filters: {
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
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        name: '',
        phone: '',
        orgNodeName: '',
      },
      tableData: {},
      dialog: false,
      dialogTitle: '',
      form: {
        id: '',
        name: '',
        sex: '',
        idCard: '',
        orgNodeName: '',
        phone: '',
        tel: '',
        qq: '',
        email: '',
      },
      relues: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          // { validator: idCard, message: '请输入正确的身份证', trigger: 'blur' }
        ],
        orgNodeName: [
          { required: true, message: '请输入所属单位名称', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: contact,
            message: '请输入正确的联系方式',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮件', trigger: 'blur' },
          { validator: email, message: '请输入正确的邮件', trigger: 'blur' },
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
      getExpertPage(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    openDialog(type, info) {
      this.dialogTitle = type
      if (info) this.form = JSON.parse(JSON.stringify(info))
      this.dialog = true
    },
    closedDialog() {
      for (const i in this.form) this.form[i] = ''
      this.$refs.censorForm.clearErr()
    },
    remove(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteById(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    submit() {
      if (!this.$refs.censorForm.validate()) return
      save(this.form).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.init()
        this.dialog = false
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>>
