<template>
  <div class="report-form">
    <!-- 上传文件input -->
    <input type="file" ref="reportFile" @change="upload($event)" />

    <!-- 漏洞 -->
    <baseDialog :visible.sync="flawDialog" top="0" width="100%">
      <template #title>漏洞扫描报告</template>
      <baseForm ref="reportFlawForm" :form="flawForm" :rules="flawRules">
        <baseFormItem label="单位名称" prop="orgName" required>
          <input type="text" v-model="flawForm.orgName" />
        </baseFormItem>
        <baseFormItem label="姓名" prop="personName" required>
          <input type="text" v-model="flawForm.personName" />
        </baseFormItem>
        <baseFormItem label="联系方式" prop="tel" required>
          <input type="text" v-model="flawForm.tel" />
        </baseFormItem>
        <baseFormItem label="邮箱">
          <input type="text" v-model="flawForm.email" />
        </baseFormItem>
        <baseFormItem label="上传漏洞文件" prop="file" required>
          <button type="button" @click="uploadFile">
            点击上传
          </button>
          <span v-if="flawForm.file"> {{ flawForm.file.name }} </span>
        </baseFormItem>
        <baseFormItem> </baseFormItem>
        <button type="button" @click="submitFlaw" style="margin-right: 10px;">
          <svg-icon icon-class="save" />保存
        </button>
        <button type="button" @click="closePage">
          <svg-icon icon-class="close" />关闭
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import { uploadFlawReport } from '@/api/flawCommon'

export default {
  name: 'ReportForm',
  data() {
    return {
      processId: '',
      flawDialog: true,
      flawForm: {
        orgName: null,
        personName: null,
        tel: null,
        email: null,
        file: null,
      },
      flawRules: {
        orgName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' },
        ],
        personName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        tel: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        file: [{ required: true, message: '请上传文件', trigger: 'change' }],
      },
    }
  },
  created() {
    this.processId = this.$route.query.processId
  },
  methods: {
    uploadFile() {
      this.$refs.reportFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      this.flawForm.file = e.target.files[0]
      this.$refs.reportFile.value = null
    },
    closePage() {
      window.close()
    },
    submitFlaw() {
      if (!this.$refs.reportFlawForm.validate()) return
      let formData = new FormData()
      formData.append('processId ', this.processId)
      for (const key in this.flawForm) {
        formData.append(key, this.flawForm[key])
      }
      uploadFlawReport(formData).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.closePage()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
form {
  text-align: center;
  button {
    display: inline-block;
  }
}
</style>
