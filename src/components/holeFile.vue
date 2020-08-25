<template>
  <div class="hole-file">
    <baseTable :tableData="tableData.list">
      <baseCol prop="cveId" label="CVE编号" />
      <baseCol prop="name" label="漏洞标题" />
      <baseCol prop="ip" label="IP地址" />
      <baseCol prop="port" label="端口" />
      <baseCol prop="uploadTime" label="上传时间" />
      <baseCol prop="level" label="危险级别 ">
        <template #button="props">
          <span
            class="level"
            :class="[
              {
                high:
                  props.row.status === '未整改' && props.row.level === '严重',
              },
              {
                middle:
                  props.row.status === '未整改' && props.row.level === '高危',
              },
              {
                low:
                  props.row.status === '未整改' && props.row.level === '中危',
              },
            ]"
            >{{ props.row.level }}</span
          >
        </template>
      </baseCol>
      <baseCol prop="status" label="漏洞状态 " />
      <baseCol label="操作">
        <template #button="props">
          <button @click="openDialog(props.row)">查看</button>
        </template>
      </baseCol>
    </baseTable>

    <basePagination
      :currentPage.sync="tableForm.startPage"
      :total="tableData.total"
      :pages="tableData.pages"
      @changeCurrentPage="init"
    />

    <baseDialog :visible.sync="dialogFlawFiles">
      <template #title>漏洞详情</template>
      <baseForm ref="flawFiles" :form="flawFileForm">
        <baseFormItem label="CVE编号" required>
          <input type="text" v-model="flawFileForm.cveId" />
        </baseFormItem>
        <baseFormItem label="IP地址" required>
          <input type="text" v-model="flawFileForm.ip" />
        </baseFormItem>
        <baseFormItem label="端口" required>
          <input type="text" v-model="flawFileForm.port" />
        </baseFormItem>
        <baseFormItem label="漏洞标题" required>
          <textarea rows="3" v-model="flawFileForm.name" />
        </baseFormItem>
        <baseFormItem label="危险级别" required>
          <input type="text" v-model="flawFileForm.level" />
        </baseFormItem>
        <baseFormItem label="漏洞描述" required>
          <textarea rows="10" v-model="flawFileForm.description"></textarea>
        </baseFormItem>
        <baseFormItem label="解决方案" required>
          <textarea rows="10" v-model="flawFileForm.solution"></textarea>
        </baseFormItem>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
export default {
  name: 'HoleFile',
  props: {
    tableForm: {
      type: Object,
    },
    tableData: {
      type: Object,
    },
  },
  data() {
    return {
      dialogFlawFiles: false,
      flawFileForm: {},
    }
  },
  methods: {
    init() {
      this.$emit('init')
    },
    openDialog(info) {
      this.$nextTick(() => {
        this.$refs.flawFiles.$el
          .querySelectorAll('input, select, textarea')
          .forEach((item) => (item.disabled = true))
      })
      this.dialogFlawFiles = true
      this.flawFileForm = info
    },
  },
}
</script>

<style lang="scss" scoped>
.hole-file {
  width: 90%;
  margin: 20px auto;
  .level {
    position: relative;
    display: inline-block;
    margin-left: 18px;
    &::before {
      background: #5bd60a;
      position: absolute;
      width: 12px;
      height: 4px;
      content: '';
      left: -15px;
      top: 7px;
    }
  }
  .high {
    &::before {
      background: #a70101;
    }
  }
  .middle {
    &::before {
      background: #ff0000;
    }
  }
  .low {
    &::before {
      background: #ffe600;
    }
  }
}
</style>
