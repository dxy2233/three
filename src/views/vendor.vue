<template>
  <div class="vendor">
    <div class="search-box">
      <button @click="openDialog('新增厂商')">
        <svg-icon icon-class="add" />新增厂商
      </button>
      <label>
        厂商名称
        <input
          type="text"
          placeholder="请输入厂商名称"
          v-model="tableForm.name"
        />
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable :tableData="tableData.list">
      <baseCol prop="firmCode" label="编号" />
      <baseCol prop="name" label="厂商名称" />
      <!-- <baseCol prop="projectBudget" label="所属运营商" /> -->
      <baseCol label="操作">
        <template #button="props">
          <button
            v-if="props.row.editVisble"
            @click="openDialog('编辑厂商', props.row)"
          >
            编辑
          </button>
          <button
            v-if="props.row.deleteVisble"
            class="remove"
            @click="remove(props.row.id)"
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

    <baseDialog :visible.sync="dialog" @closed="closedDialog">
      <template #title>{{ dialogTitle }}</template>
      <baseForm ref="vendorForm" :form="form" :rules="rules">
        <baseFormItem label="厂商名称" prop="name" required>
          <input type="text" v-model="form.name" />
        </baseFormItem>
        <button type="button" @click="submit">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import { getFirmManagePage, save, deleteProjectInfoById } from '@api/firmManage'

export default {
  name: 'Vendor',
  data() {
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        name: '',
      },
      tableData: {},
      dialog: false,
      dialogTitle: '',
      form: {
        name: '',
      },
      rules: {
        name: [{ required: true, message: '请输入厂商名称', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(isSearch) {
      if (isSearch) this.tableForm.startPage = 1
      getFirmManagePage(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    openDialog(type, info) {
      this.dialogTitle = type
      if (info) this.form = JSON.parse(JSON.stringify(info))
      this.dialog = true
    },
    closedDialog() {},
    submit() {
      if (!this.$refs.vendorForm.validate()) return
      save(this.form).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.init()
        this.dialog = false
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
  },
}
</script>

<style lang="scss" scoped></style>
