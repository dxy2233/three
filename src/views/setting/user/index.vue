<template>
  <div class="user">
    <div class="search-box">
      <button
        v-if="info.visibleMap.addCommonUser"
        @click="openDialog('新增普通用户', null, 1)"
      >
        <svg-icon icon-class="add" />普通用户
      </button>
      <button
        v-if="info.visibleMap.addFacilitatorUser"
        @click="openDialog('新增服务商用户', null, 2)"
      >
        <svg-icon icon-class="add" />服务商用户
      </button>
      <label for="name">姓名</label>
      <input
        type="text"
        id="name"
        placeholder="请输入检查人员姓名"
        v-model="tableForm.name"
      />
      <label for="phone">联系方式</label>
      <input
        type="text"
        id="phone"
        placeholder="请输入手机号"
        v-model="tableForm.phone"
      />
      <label for="orgId">所属单位</label>
      <baseCascader
        id="orgId"
        v-model="tableForm.orgId"
        :data="systemOrgNodeTree"
      />
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable :tableData="tableData.list">
      <baseCol prop="id" label="编号" />
      <baseCol prop="username" label="账号" />
      <baseCol prop="name" label="姓名" />
      <baseCol prop="phone" label="联系方式" />
      <baseCol prop="roles" label="角色">
        <template #button="props">
          {{ props.row.roles | roleFilter }}
        </template>
      </baseCol>
      <baseCol prop="orgName" label="所属单位" />
      <baseCol prop="address" label="地址" />
      <baseCol prop="remark" label="备注" />
      <baseCol label="操作">
        <template #button="props">
          <button
            v-if="props.row.editVisble"
            @click="openDialog(null, props.row, props.row.type)"
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
          <button
            v-if="props.row.resetPasswordVisble"
            @click="resetPwd(props.row.id)"
          >
            重置密码
          </button>
          <button v-if="props.row.unlockVisble" @click="unlock(props.row.id)">
            解锁
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
      <baseForm ref="userForm" :form="form" :rules="rules">
        <baseFormItem
          v-if="form.type === 1 || form.type === 3"
          label="账号"
          prop="username"
          required
        >
          <input
            type="text"
            v-model="form.username"
            :disabled="dialogTitle.includes('编辑')"
          />
        </baseFormItem>

        <baseFormItem v-else label="所属服务商" prop="facilitatorId" required>
          <select
            v-if="dialogTitle === '新增服务商用户'"
            v-model="form.facilitatorId"
            @change="form.name = ''"
          >
            <option
              v-for="(item, index) in facilitatorList"
              :key="index"
              :value="item.id"
              >{{ item.name }}</option
            >
          </select>
          <input v-else type="text" v-model="form.orgName" disabled />
        </baseFormItem>

        <baseFormItem
          v-if="form.type === 1 || form.type === 3"
          label="姓名"
          prop="name"
          required
        >
          <input type="text" v-model="form.name" />
        </baseFormItem>
        <baseFormItem v-else label="姓名">
          <select
            v-if="dialogTitle === '新增服务商用户'"
            v-model="form.name"
            @change="changeName"
          >
            <option
              v-for="(item, index) in selectedFacilitator.personBOS"
              :key="index"
              :value="item.name"
              >{{ item.name }}</option
            >
          </select>
          <input v-else type="text" v-model="form.name" disabled />
        </baseFormItem>

        <baseFormItem v-if="form.type === 2" label="账号" required>
          <input type="text" v-model="form.username" disabled />
        </baseFormItem>

        <baseFormItem
          v-if="form.type !== 2"
          label="联系方式"
          prop="phone"
          required
        >
          <input type="text" v-model="form.phone" />
        </baseFormItem>
        <baseFormItem v-else label="联系方式" required>
          <input type="text" v-model="form.phone" disabled />
        </baseFormItem>

        <baseFormItem
          v-if="form.type === 1 || form.type === 3"
          label="角色"
          required
        >
          <label v-if="form.type === 1">
            <input type="checkbox" checked disabled />
            一般用户
          </label>
          <label v-else>
            <input type="checkbox" checked disabled />
            审计/检查人员
          </label>
        </baseFormItem>

        <baseFormItem v-else label="角色" required>
          <label>
            <input type="checkbox" checked disabled />
            服务商人员
          </label>
        </baseFormItem>

        <baseFormItem
          v-if="form.type === 1 || form.type === 3"
          label="联系地址"
        >
          <input type="text" v-model="form.address" />
        </baseFormItem>

        <baseFormItem v-if="form.type === 1" label="所属单位">
          <baseCascader v-model="form.sysOrgNodeId" :data="systemOrgNodeTree" />
        </baseFormItem>
        <baseFormItem v-if="form.type === 3" label="所属单位">
          {{ form.orgName }}
        </baseFormItem>

        <baseFormItem label="备注">
          <input type="text" v-model="form.remark" />
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
  getUserList,
  deleteUser,
  resetPassword,
  saveUser,
  unLockUser,
} from '@/api/user'
import { getRoles } from '@/api/role'
import { getFacilitatorAndPerson } from '@/api/facilitator'
import { contact } from '@/utils/validate'
import { orgTree } from '@/assets/mixin/common'
import { mapGetters } from 'vuex'
let that

export default {
  name: 'User',
  mixins: [orgTree],
  filters: {
    roleFilter(val) {
      let res = val.map((item) => {
        for (let i = 0; i <= that.roles.length; i++) {
          if (that.roles[i].id === item) {
            item = that.roles[i].name
            break
          }
        }
        return item
      })
      return res.join('，')
    },
  },
  data() {
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        name: '',
        phone: '',
        orgId: '',
      },
      tableData: {},
      dialog: false,
      dialogTitle: '',
      form: {
        id: '',
        name: '',
        phone: '',
        address: '',
        username: '',
        remark: '',
        roles: [],
        facilitatorId: '',
        sysOrgNodeId: '',
        type: '',
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        facilitatorId: [
          { required: true, message: '请选择所属服务商', trigger: 'change' },
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          {
            validator: contact,
            message: '请输入正确的联系方式',
            trigger: 'blur',
          },
        ],
      },
      roles: [],
      facilitatorList: [],
    }
  },
  computed: {
    // 服务商选择姓名的数据
    selectedFacilitator() {
      return this.form.facilitatorId
        ? this.facilitatorList.filter(
            (item) => item.id === this.form.facilitatorId
          )[0]
        : {}
    },
    ...mapGetters(['info']),
  },
  beforeCreate() {
    that = this
  },
  created() {
    getRoles().then((res) => {
      this.roles = res.data
    })
    this.init()
  },
  methods: {
    init(isSearch) {
      if (isSearch) this.tableForm.startPage = 1
      getUserList(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    openDialog(type, info, userType) {
      getFacilitatorAndPerson().then((res) => {
        this.facilitatorList = res.data
      })
      if (!type) {
        switch (userType) {
          case 1:
            this.dialogTitle = '编辑普通用户'
            break
          case 2:
            this.dialogTitle = '编辑普通用户'
            break
          case 3:
            // this.dialogTitle = '编辑检查人员'
            this.dialogTitle = '编辑审计/检查人员用户'
        }
      } else {
        this.dialogTitle = type
        this.form.sysOrgNodeId = this.info.sysOrgNodeId
      }
      if (info) this.form = JSON.parse(JSON.stringify(info))
      this.form.type = userType
      this.dialog = true
    },
    closedDialog() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.userForm.clearErr()
    },
    remove(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteUser(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    resetPwd(id) {
      this.$confirm('确认重置？', '提示').then(() => {
        resetPassword(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    unlock(id) {
      this.$confirm('确认解锁？', '提示').then(() => {
        unLockUser(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    changeName() {
      // 后端遗留问题，清除关键词字段，增加姓名的id,账号，联系方式
      if (this.selectedFacilitator.personBOS.length > 0) {
        for (let i = 0; i < this.selectedFacilitator.personBOS.length; i++) {
          if (this.selectedFacilitator.personBOS[i].name === this.form.name) {
            this.form.personId = this.selectedFacilitator.personBOS[i].id
            this.form.username = this.selectedFacilitator.personBOS[i].username
            this.form.phone = this.selectedFacilitator.personBOS[i].practiceMode
            break
          }
        }
      }
    },
    submit() {
      if (!this.$refs.userForm.validate()) return
      // 后端遗留问题，清除关键词字段，增加姓名的id
      if (this.form.type === 2) delete this.form.sysOrgNodeId
      saveUser(this.form).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.init()
        this.dialog = false
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>>
