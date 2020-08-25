<template>
  <div class="list">
    <div class="search-box">
      <button @click="downloadList">
        <svg-icon icon-class="export" />导出报表
      </button>
    </div>
    <baseTable :tableData="tableData">
      <baseCol prop="name" label="统计项名称">
        <template #button="props">
          <span :class="{ blod: props.row.isBold }">{{ props.row.name }}</span>
        </template>
      </baseCol>
      <baseCol prop="count" label="数量（个）" />
      <baseCol prop="proportion" label="占比" />
    </baseTable>
  </div>
</template>

<script>
import { getList, downloadList } from '@api/statistics'

export default {
  name: 'List',
  data() {
    return {
      tableData: [],
    }
  },
  created() {
    getList().then((res) => {
      this.tableData = res.data
    })
  },
  methods: {
    downloadList() {
      downloadList().then(() => {
        this.$message({ content: '下载成功', type: 'success' })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.blod {
  font-weight: bold;
}
</style>
