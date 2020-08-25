<template>
  <div class="department">
    <nav class="scroll-bar">
      <button @click="openDialog('新增部门')">
        <svg-icon icon-class="add" />新增部门
      </button>
      <baseTree
        ref="departmentTree"
        :treeData="systemOrgNodeTree"
        label="orgName"
        children="nextNodes"
        removeField="deleteVisble"
        @nodeClick="getTreeNode"
        @remove="treeNodeRemove"
      />
    </nav>

    <main>
      <div class="title">
        <span>{{ nodeData.orgName }}</span>
        <button
          v-show="nodeData.createVisble"
          @click="openStaffDialog('新增人员')"
        >
          <svg-icon icon-class="add" /> 新增人员
        </button>
        <button
          v-show="nodeData.editVisble"
          @click="openDialog('编辑部门', nodeData)"
        >
          <svg-icon icon-class="edit" />编辑部门
        </button>
      </div>
      <div class="content">
        <div class="item">
          <label>部门编码:</label>
          <span>{{ nodeData.orgCode }}</span>
        </div>
        <div class="item">
          <label>部门名称:</label>
          <span>{{ nodeData.orgName }}</span>
        </div>
        <div class="item">
          <label>部门类型:</label>
          <span>{{ nodeData.orgType }}</span>
        </div>
      </div>

      <baseTable :tableData="tableData.list">
        <baseCol prop="name" label="姓名" />
        <baseCol prop="sex" label="性别">
          <template #button="props">
            {{ props.row.sex | sexFilter }}
          </template>
        </baseCol>
        <baseCol prop="idCard" label="身份证号" />
        <baseCol prop="phone" label="联系方式" />
        <baseCol label="操作">
          <template #button="props">
            <button
              v-if="props.row.editVisble"
              @click="openStaffDialog('编辑人员', props.row)"
            >
              编辑
            </button>
            <button
              v-if="props.row.deleteVisble"
              class="remove"
              @click="removeStaff(props.row.id)"
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
    </main>

    <baseDialog
      :visible.sync="dialog"
      @closed="closedDialog('form', 'departmentForm')"
    >
      <template #title>{{ dialongTitle }}</template>
      <baseForm ref="departmentForm" :form="form" :rules="rules">
        <baseFormItem label="部门编号" prop="orgCode" required>
          <input type="text" v-model="form.orgCode" />
        </baseFormItem>
        <baseFormItem label="部门名称" prop="orgName" required>
          <input type="text" v-model="form.orgName" />
        </baseFormItem>
        <baseFormItem label="部门类型" prop="orgType" required>
          <input type="text" v-model="form.orgType" />
        </baseFormItem>
        <baseFormItem label="上级节点" prop="parentId" required>
          <baseCascader v-model="form.parentId" :data="systemOrgNodeTree" />
        </baseFormItem>
        <button type="button" @click="submit">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>

    <baseDialog
      :visible.sync="dialogStaff"
      @closed="closedDialog('staffForm', 'departmentStaffForm')"
    >
      <template #title>{{ dialogStaffTitle }}</template>
      <baseForm ref="departmentStaffForm" :form="staffForm" :rules="staffRules">
        <baseFormItem label="姓名" prop="name" required>
          <input type="text" v-model="staffForm.name" />
        </baseFormItem>
        <baseFormItem label="性别" prop="sex" required>
          <label>
            <input type="radio" v-model="staffForm.sex" :value="1" />
            男
          </label>
          <label>
            <input type="radio" v-model="staffForm.sex" :value="0" />
            女
          </label>
        </baseFormItem>
        <baseFormItem label="身份证号" prop="idCard" required>
          <input type="text" v-model="staffForm.idCard" />
        </baseFormItem>
        <baseFormItem label="联系方式" prop="phone" required>
          <input type="text" v-model="staffForm.phone" />
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
  saveSystemOrgNode,
  getOrgPersonPage,
  saveSystemOrgNodePerson,
  deleteOrgNodePersonById,
  deleteSystemOrgNodeById,
} from '@api/systemOrgNode'
import { contact } from '@/utils/validate'
import { mapGetters } from 'vuex'

export default {
  name: 'Department',
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
      nodeData: {}, // 当前tree节点的数据
      tableForm: {
        startPage: 1,
        pageSize: 20,
        orgId: '',
      },
      tableData: {},
      dialog: false,
      dialongTitle: '',
      form: {
        id: '',
        orgName: '',
        orgCode: '',
        orgType: '',
        parentId: '',
      },
      rules: {
        orgName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
        ],
        orgCode: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
        ],
        orgType: [
          { required: true, message: '请输入部门类型', trigger: 'blur' },
        ],
        parentId: [
          { required: true, message: '请输入上级部门ID', trigger: 'change' },
        ],
      },
      dialogStaff: false,
      dialogStaffTitle: '',
      staffForm: {
        id: '',
        orgId: '',
        name: '',
        sex: '',
        idCard: '',
        phone: '',
      },
      staffRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        idCard: [
          { required: true, message: '请输入身份号', trigger: 'blur' },
          // { validator: idCard, message: '请输入正确的身份证', trigger: 'blur' }
        ],
        phone: [
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
    ...mapGetters(['systemOrgNodeTree']),
  },
  async mounted() {
    if (this.systemOrgNodeTree.length === 0)
      await this.$store.dispatch('publicData/getOrgTree')
    this.$refs.departmentTree.nodeClick(this.systemOrgNodeTree[0])
  },
  methods: {
    getTreeNode(node) {
      this.nodeData = node
      this.tableForm.orgId = node.id
      this.tableForm.startPage = 1
      this.init()
    },
    treeNodeRemove(info) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteSystemOrgNodeById(info.id).then(async (res) => {
          this.$message({ content: res.message, type: 'success' })
          await this.$store.dispatch('publicData/getOrgTree')
          this.$refs.departmentTree.nodeClick(this.systemOrgNodeTree[0])
        })
      })
    },
    init() {
      getOrgPersonPage(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    openDialog(type, info) {
      this.dialongTitle = type
      if (info) this.form = JSON.parse(JSON.stringify(info))
      this.dialog = true
    },
    closedDialog(name, refName) {
      Object.assign(this.$data[name], this.$options.data()[name])
      this.$refs[refName].clearErr()
    },
    submit() {
      if (!this.$refs.departmentForm.validate()) return
      saveSystemOrgNode(this.form).then(async (res) => {
        this.$message({ content: res.message, type: 'success' })
        let resData = {}
        function loop(array, id) {
          for (let index = 0; index < array.length; index++) {
            if (array[index].id === id) {
              resData = array[index]
              break
            } else {
              if (array[index].nextNodes) loop(array[index].nextNodes, id)
            }
          }
        }
        await this.$store.dispatch('publicData/getOrgTree')
        loop(this.systemOrgNodeTree, this.form.id)
        this.nodeData = resData
        this.dialog = false
      })
    },
    openStaffDialog(type, info) {
      this.dialogStaffTitle = type
      if (info) this.staffForm = JSON.parse(JSON.stringify(info))
      this.dialogStaff = true
    },
    submitStaff() {
      if (!this.$refs.departmentStaffForm.validate()) return
      this.staffForm.orgId = this.nodeData.id
      saveSystemOrgNodePerson(this.staffForm).then(() => {
        this.init()
        this.dialogStaff = false
      })
    },
    removeStaff(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteOrgNodePersonById(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.department {
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  margin: -20px;
  display: flex;
  nav {
    width: 330px;
    overflow-y: auto;
    background: #e5f4fc;
    button {
      margin: 10px 20px;
      color: #fff;
      background: #045fc9;
      &:hover {
        background: #158ae7;
      }
    }
  }
  main {
    width: calc(100% + 300px);
    background: url('../../../assets/img/earth.png') no-repeat right bottom;
    text-align: center;
    padding: 20px;
    .title {
      text-align: center;
      color: #045fc9;
      font-size: 22px;
      button {
        background: #045fc9;
        color: #fff;
        padding: 0 10px;
        margin-left: 10px;
        float: right;
        &:hover {
          background: #158ae7;
        }
      }
    }
    .content {
      text-align: left;
      border: 1px solid #0196e0;
      background: #d4f1ff;
      margin: 20px 0;
      display: flex;
      padding: 10px 2%;
      justify-content: space-between;
      .item {
        margin: 15px 0;
        label {
          margin: 0 5px;
        }
      }
    }
  }
}
</style>
