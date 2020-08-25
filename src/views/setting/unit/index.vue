<template>
  <div class="unit">
    <nav class="scroll-bar">
      <baseTree
        ref="unitTree"
        :treeData="treeData"
        label="orgName"
        children="nextNodes"
        @nodeClick="getTreeNode"
      />
    </nav>
    <main>
      <div class="title">{{ nodeData.orgName }}</div>
      <div class="content">
        <div class="item">
          <label>单位编码</label>
          <span>{{ nodeData.orgCode }}</span>
        </div>
        <div class="item">
          <label>邮政编码</label>
          <span>{{ nodeData.postalCode }}</span>
        </div>
        <div class="item">
          <label>行政区划编码</label>
          <span>{{ nodeData.regionCode }}</span>
        </div>
        <div class="item">
          <label>单位地址</label>
          <span>{{ nodeData.orgAdd }}</span>
        </div>
      </div>
      <button
        v-if="info.visibleMap.editOrg"
        v-show="nodeData.id"
        @click="openDialog"
      >
        <svg-icon icon-class="edit" />编辑
      </button>
    </main>

    <baseDialog :visible.sync="dialog" @closed="closedDialog">
      <template #title>编辑单位</template>
      <baseForm ref="unitForm" :form="form" :rules="rules">
        <baseFormItem label="单位编码">
          <input type="text" v-model="form.orgCode" />
        </baseFormItem>
        <baseFormItem label="邮政编码">
          <input type="text" v-model="form.postalCode" />
        </baseFormItem>
        <baseFormItem label="单位地址">
          <input type="text" v-model="form.orgAdd" />
        </baseFormItem>
        <button type="button" @click="submit">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import { getSystemOrgNodeTree, saveSystemOrgNode } from '@api/systemOrgNode'
import { mapGetters } from 'vuex'

export default {
  name: 'Unit',
  data() {
    return {
      treeData: [],
      nodeData: {},
      dialog: false,
      form: {
        id: '',
        orgCode: '',
        postalCode: '',
        orgAdd: '',
      },
      rules: {
        orgCode: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        postalCode: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        orgAdd: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['info']),
  },
  created() {
    getSystemOrgNodeTree().then((res) => {
      this.treeData = res.data
      this.$refs.unitTree.nodeClick(this.treeData[0])
    })
  },
  methods: {
    getTreeNode(node) {
      this.nodeData = node
    },
    openDialog() {
      this.form = JSON.parse(JSON.stringify(this.nodeData))
      this.dialog = true
    },
    closedDialog() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.unitForm.clearErr()
    },
    submit() {
      if (!this.$refs.unitForm.validate()) return
      saveSystemOrgNode(this.form).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        getSystemOrgNodeTree().then((res) => {
          this.treeData = res.data
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
          loop(this.treeData, this.form.id)
          this.nodeData = resData
          this.dialog = false
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.unit {
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  margin: -20px;
  display: flex;
  nav {
    width: 330px;
    overflow-y: auto;
    background: #e5f4fc;
  }
  main {
    width: calc(100% + 300px);
    background: url('../../../assets/img/earth.png') no-repeat right bottom;
    text-align: center;
    .title {
      text-align: center;
      color: #045fc9;
      font-size: 22px;
      padding: 20px 0;
    }
    .content {
      text-align: left;
      border: 1px solid #cce8f6;
      width: 70%;
      margin: 20px auto;
      display: flex;
      flex-wrap: wrap;
      padding: 2%;
      .item {
        flex: 50%;
        margin: 15px 0;
        label {
          background: #e5f4fc;
          padding: 5px 10px;
          margin: 0 10px;
        }
      }
    }
    button {
      background: #045fc9;
      color: #fff;
      padding: 0 10px;
      &:hover {
        background: #0196e0;
      }
    }
  }
}
</style>
