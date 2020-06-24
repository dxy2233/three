<template>
  <div class="report-form">
    <!-- 上传文件input -->
    <input type="file" ref="reportFile" @change="upload($event)" />

    <!-- 基线 -->
    <baseDialog v-if="type === '1'" :visible.sync="dialog" top="0" width="100%">
      <template #title>
        <span v-if="assetInfo">【{{ assetInfo }}】</span>
        {{ `${status === '2' ? '复' : '初'}` }}查安全防护基线配置要求
      </template>
      <baseForm ref="reportBaseForm" :form="baseForm" :rules="baseRules">
        <div class="content">
          <h4>填写人相关信息</h4>
          <div class="box">
            <baseFormItem label="单位名称" prop="orgName" required>
              <input type="text" v-model="baseForm.orgName" />
            </baseFormItem>
            <baseFormItem label="姓名" prop="nickName" required>
              <input type="text" v-model="baseForm.nickName" />
            </baseFormItem>
            <baseFormItem label="联系方式" prop="phone" required>
              <input type="text" v-model="baseForm.phone" />
            </baseFormItem>
            <baseFormItem label="邮箱">
              <input type="text" v-model="baseForm.email" />
            </baseFormItem>
          </div>
        </div>
        <br />
        <div class="content">
          <h4>安全防护基线信息</h4>
          <div class="box">
            <baseFormItem
              v-if="!deviceId"
              label="选择资产"
              required
              class="f-full"
            >
              <select v-model="baseForm.deviceId" @change="changeDeviceId">
                <option
                  v-for="(item, index) in baseAssetsData"
                  :key="index"
                  :value="item.deviceId"
                  >{{ item.assets }}</option
                >
              </select>
            </baseFormItem>
            <baseFormItem
              v-for="(item, index) in baseSelectList"
              :key="index"
              :label="item.title"
              required
            >
              <select v-model="baseSelectValue[index]">
                <option
                  v-for="(item2, index2) in item.asstesValueBOS"
                  :key="index2"
                  :value="item2.dictionId"
                  >{{ item2.dictionName }}</option
                >
              </select>
            </baseFormItem>
            <!-- <baseFormItem v-if="!deviceId" label="操作系统版本">
              <select v-model="baseForm.osCode">
                <option
                  v-for="(item, index) in this.baseSelectData.system"
                  :key="index"
                  :value="item.dictionId"
                  >{{ item.dictionName }}</option
                >
              </select>
            </baseFormItem>
            <baseFormItem v-if="!deviceId" label="中间件版本">
              <select v-model="baseForm.middlewareCode">
                <option
                  v-for="(item, index) in this.baseSelectData.middleware"
                  :key="index"
                  :value="item.dictionId"
                  >{{ item.dictionName }}</option
                >
              </select>
            </baseFormItem>
            <baseFormItem v-if="!deviceId" label="数据库版本">
              <select v-model="baseForm.dataBaseCode">
                <option
                  v-for="(item, index) in this.baseSelectData.db"
                  :key="index"
                  :value="item.dictionId"
                  >{{ item.dictionName }}</option
                >
              </select>
            </baseFormItem> -->
          </div>
        </div>
        <div class="details">
          <div v-for="(item, index) in baseInfo" :key="index" class="group">
            <div v-if="!item.childData" class="title">{{ item.title }}</div>
            <div v-else class="caption">{{ item.num }}、{{ item.title }}</div>
            <div
              v-for="(item2, index2) in item.childData"
              :key="index2"
              class="item"
            >
              <baseFormItem
                :label="item.num + '.' + item2.num + item2.title"
                :required="item2.isCheck"
                class="radio-box"
              >
                <label v-for="(item3, index3) in item2.options" :key="index3">
                  <input
                    type="radio"
                    :value="item3.value"
                    v-model="item2.value"
                  />
                  {{ item3.label }}
                  <input
                    v-if="item3.value === 0"
                    type="text"
                    v-model="item2.other"
                  />
                </label>
              </baseFormItem>
              <baseFormItem label="检测图片" class="file-box">
                <button
                  v-if="item2.type === 1"
                  @click="uploadFile(index, index2)"
                  type="button"
                  style="margin: 10px 5px 10px 0;"
                >
                  点击添加附件
                </button>
                <span
                  v-for="(img, imgIndex) in item2.imgs"
                  :key="imgIndex"
                  @click="downloadFile(img.url)"
                  class="remove-button link"
                >
                  {{ img.url | imgName }}
                  <svg-icon
                    v-if="item2.type === 1"
                    icon-class="close"
                    @click.stop="removeBaseImg('imgs', index, index2, imgIndex)"
                  />
                </span>
              </baseFormItem>
              <baseFormItem
                v-if="item2.type === 2"
                label="整改结果"
                class="file-box"
              >
                <button
                  @click="uploadFile(index, index2)"
                  type="button"
                  style="margin: 10px 5px 10px 0;"
                >
                  点击添加附件
                </button>
                <span
                  v-for="(img, imgIndex) in item2.newImgs"
                  :key="imgIndex"
                  @click="downloadFile(img.url)"
                  class="remove-button link"
                >
                  {{ img.url | imgName }}
                  <svg-icon
                    icon-class="close"
                    @click.stop="
                      removeBaseImg('newImgs', index, index2, imgIndex)
                    "
                  />
                </span>
              </baseFormItem>
            </div>
          </div>
        </div>
        <button type="button" @click="submitBase">
          <svg-icon icon-class="word" />生成报告
        </button>
        <button type="button" @click="closePage">
          <svg-icon icon-class="close" />关闭
        </button>
      </baseForm>
    </baseDialog>

    <!-- 渗透 -->
    <baseDialog
      v-else-if="type === '2'"
      :visible.sync="dialog"
      top="0"
      width="100%"
    >
      <template #title>
        {{ `${status === '2' ? '复' : '初'}` }}查渗透测试结果记录
      </template>
      <div class="content">
        <h4>填写人相关信息</h4>
        <baseForm
          ref="reportSeepForm"
          :form="seepForm"
          :rules="seepRules"
          class="box"
        >
          <baseFormItem label="单位名称" prop="orgName" required>
            <input type="text" v-model="seepForm.orgName" />
          </baseFormItem>
          <baseFormItem label="姓名" prop="nickName" required>
            <input type="text" v-model="seepForm.nickName" />
          </baseFormItem>
          <baseFormItem label="联系方式" prop="phone" required>
            <input type="text" v-model="seepForm.phone" />
          </baseFormItem>
          <baseFormItem label="邮箱">
            <input type="text" v-model="seepForm.email" />
          </baseFormItem>
        </baseForm>
      </div>
      <br />
      <div class="content">
        <h4>渗透测试结果记录</h4>
        <baseForm
          v-if="status === '1'"
          ref="reportSeepResForm"
          :form="seepResForm"
          :rules="seepResRules"
        >
          <div class="box">
            <baseFormItem label="IP地址" prop="leakIp" required>
              <select v-model="seepResForm.leakIp">
                <option
                  v-for="(item, index) in baseAssetsData"
                  :key="index"
                  :value="item.leakIp"
                  >{{ item.leakIp }}</option
                >
              </select>
            </baseFormItem>
            <baseFormItem label="URL地址">
              <input type="text" v-model="seepResForm.url" />
            </baseFormItem>
            <baseFormItem label="是否存在漏洞" prop="leakStatus" required>
              <label>
                <input
                  type="radio"
                  v-model="seepResForm.leakStatus"
                  value="1"
                />
                是
              </label>
              <label>
                <input
                  type="radio"
                  v-model="seepResForm.leakStatus"
                  value="0"
                />
                否
              </label>
            </baseFormItem>
            <baseFormItem
              v-if="seepResForm.leakStatus === '1'"
              label="漏洞名称"
              prop="leakTitle"
              required
            >
              <input type="text" v-model="seepResForm.leakTitle" />
            </baseFormItem>
            <baseFormItem
              v-if="seepResForm.leakStatus === '1'"
              label="CVE编号"
              prop="cevNum"
              required
            >
              <input type="text" v-model="seepResForm.cevNum" />
            </baseFormItem>
            <baseFormItem
              v-if="seepResForm.leakStatus === '1'"
              label="等级"
              prop="hazardLevel"
              required
            >
              <select v-model="seepResForm.hazardLevel">
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            </baseFormItem>
            <baseFormItem
              v-if="seepResForm.leakStatus === '1'"
              label="漏洞危害说明"
              prop="leakHazardDesc"
              required
            >
              <textarea
                cols="30"
                rows="6"
                v-model="seepResForm.leakHazardDesc"
              ></textarea>
            </baseFormItem>
            <baseFormItem
              v-if="seepResForm.leakStatus === '1'"
              label="整改建议"
              prop="reformDesc"
              required
            >
              <textarea
                cols="30"
                rows="6"
                v-model="seepResForm.reformDesc"
              ></textarea>
            </baseFormItem>
            <baseFormItem
              v-if="seepResForm.leakStatus === '1'"
              label="漏洞效果及截图"
              prop="imgs"
              required
            >
              <button type="button" @click="uploadFile">
                点击上传
              </button>
              <span
                v-for="(img, imgIndex) in seepResForm.imgs"
                :key="imgIndex"
                class="remove-button"
              >
                {{ img.url | imgName }}
                <svg-icon icon-class="close" @click="removeSeepImg(imgIndex)" />
              </span>
            </baseFormItem>
          </div>
          <button type="button" @click="addSeep">
            新增
          </button>
        </baseForm>
        <baseTable :tableData="seepTableIndex">
          <baseCol prop="leakIp" label="漏洞IP地址" />
          <baseCol prop="url" label="漏洞URL地址" />
          <baseCol prop="leakTitle" label="漏洞名称" />
          <baseCol prop="hazardLevel" label="等级" />
          <baseCol prop="cevNum" label="CVE编号" />
          <baseCol prop="imgs" label="漏洞效果及截图">
            <template #button="props">
              <span
                v-for="(img, imgIndex) in props.row.imgs"
                :key="imgIndex"
                @click="downloadFile(img.url)"
                class="link"
                style="max-width: unset;"
              >
                {{ img.url | imgName }}
              </span>
            </template>
          </baseCol>
          <baseCol prop="leakHazardDesc" label="漏洞危害说明" />
          <baseCol prop="reformDesc" label="整改建议" />
          <baseCol v-if="status === '2'" prop="reformStatus" label="当前状态">
            <template #button="props">
              {{ props.row.reformStatus | statusFilter }}
            </template>
          </baseCol>
          <baseCol label="操作">
            <template #button="props">
              <button
                v-if="status === '1'"
                class="remove"
                @click="seepRemove(props.row.index)"
              >
                删除
              </button>
              <button
                v-if="status === '2' && props.row.reformStatus === 0"
                @click="seepRectification(props.row.uuid)"
              >
                整改完成
              </button>
            </template>
          </baseCol>
        </baseTable>
        <button type="button" @click="submitSeep">
          <svg-icon icon-class="word" />生成报告
        </button>
        <button type="button" @click="closePage">
          <svg-icon icon-class="close" />关闭
        </button>
        <br />
        <br />
      </div>
    </baseDialog>

    <!-- 漏洞 -->
    <baseDialog
      v-else-if="type === '3'"
      :visible.sync="dialog"
      top="0"
      width="100%"
    >
      <template #title>漏洞扫描报告</template>
      <baseForm ref="reportFlawForm" :form="flawForm" :rules="flawRules">
        <div class="content">
          <h4>填写人相关信息</h4>
          <div class="box">
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
          </div>
        </div>
        <br />
        <div class="content">
          <h4>漏洞文件</h4>
          <div class="box">
            <baseFormItem label="上传漏洞文件" prop="file" required>
              <button type="button" @click="uploadFile">
                点击上传
              </button>
              <span v-if="flawForm.file"> {{ flawForm.file.name }} </span>
            </baseFormItem>
            <baseFormItem> </baseFormItem>
          </div>
          <button type="button" @click="submitFlaw(1)">
            <svg-icon icon-class="save" />保存
          </button>
          <button type="button" @click="closePage">
            <svg-icon icon-class="close" />关闭
          </button>
        </div>
      </baseForm>
    </baseDialog>

    <!-- 漏洞整改附件 -->
    <baseDialog
      v-else-if="type === '4'"
      :visible.sync="dialog"
      top="0"
      width="100%"
    >
      <template #title>漏洞整改附件</template>
      <baseForm ref="reportFlawForm" :form="flawForm" :rules="flawRules">
        <div class="content">
          <h4>填写人相关信息</h4>
          <div class="box">
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
          </div>
        </div>
        <br />
        <div class="content">
          <h4>整改附件</h4>
          <div class="box">
            <baseFormItem label="上传整改附件" prop="file" required>
              <button type="button" @click="uploadFile">
                点击上传
              </button>
              <span v-if="flawForm.file"> {{ flawForm.file.name }} </span>
            </baseFormItem>
            <baseFormItem> </baseFormItem>
          </div>
          <button type="button" @click="submitFlaw(2)">
            <svg-icon icon-class="save" />保存
          </button>
          <button type="button" @click="closePage">
            <svg-icon icon-class="close" />关闭
          </button>
        </div>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import {
  getReportListData,
  uploadReport,
  saveBaseline,
  getBaselineByDeviceId,
  savePenetration,
  getPenetrationByProcessId,
  reformPenetration,
  saveReviewPenetration,
} from '@/api/reportCommon'
import { uploadFlawReport } from '@/api/flawCommon'
import { getDeviceAssetsById, getAsstesByDeviceId } from '@/api/device'
import { download } from '@/api/sftp'

export default {
  name: 'ReportForm',
  filters: {
    imgName(val) {
      return val.slice(val.lastIndexOf('/') + 1)
    },
    statusFilter(val) {
      switch (val) {
        case 0:
          return '未整改'
        case 1:
          return '已整改'
      }
    },
  },
  data() {
    return {
      type: null,
      processId: null,
      status: null,
      deviceId: null,
      assetInfo: null,
      currentCell: {},
      dialog: true,
      baseForm: {
        orgName: null,
        nickName: null,
        phone: null,
        email: null,
        deviceId: null,
      },
      baseSelectList: [],
      baseSelectValue: [],
      baseAssetsData: [], // 资产信息
      baseInfo: [],
      baseRules: {
        orgName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' },
        ],
        nickName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
      },
      seepForm: {
        orgName: null,
        nickName: null,
        phone: null,
        email: null,
      },
      seepRules: {
        orgName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' },
        ],
        nickName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
      },
      seepResForm: {
        leakIp: null,
        url: null,
        leakStatus: null,
        leakTitle: null,
        hazardLevel: null,
        cevNum: null,
        leakAddress: null,
        leakHazardDesc: null,
        reformDesc: null,
        imgs: [],
      },
      seepResRules: {
        leakIp: [
          { required: true, message: '请选择漏洞IP地址', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入漏洞URL地址', trigger: 'blur' },
        ],
        leakStatus: [
          { required: true, message: '请选择是否存在漏洞', trigger: 'change' },
        ],
        leakTitle: [
          { required: true, message: '请输入漏洞名称', trigger: 'blur' },
        ],
        hazardLevel: [
          { required: true, message: '请选择等级', trigger: 'blur' },
        ],
        cevNum: [{ required: true, message: '请输入CVE编号', trigger: 'blur' }],
        leakAddress: [
          { required: true, message: '请输入漏洞地址', trigger: 'blur' },
        ],
        leakHazardDesc: [
          { required: true, message: '请输入漏洞危害说明', trigger: 'blur' },
        ],
        reformDesc: [
          { required: true, message: '请输入整改建议', trigger: 'blur' },
        ],
        imgs: [
          {
            required: true,
            message: '请上传漏洞效果及截图',
            trigger: 'blur',
          },
        ],
      },
      seepTable: [],
      flawForm: {
        orgName: '',
        personName: '',
        tel: '',
        email: '',
        file: '',
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
  computed: {
    // baseAssetsDataOptional() {
    //   let res = []
    //   res = this.baseAssetsData.filter(
    //     (item) => !this.seepTable.some((item2) => item2.leakIp === item.leakIp)
    //   )
    //   return res
    // },
    seepTableIndex() {
      let res = this.seepTable
      res.forEach((item, index) => {
        item['index'] = index
      })
      return res
    },
  },
  watch: {
    baseSelectValue: {
      deep: true,
      handler: function (newVal) {
        if (
          this.type === '1' &&
          !this.deviceId &&
          newVal.every((item) => item)
        ) {
          getReportListData({ dictionIds: newVal }).then((res) => {
            this.baseInfo = res.data
          })
        }
      },
    },
  },
  created() {
    for (const key in this.$route.query) {
      this[key] = this.$route.query[key]
    }
    // base
    if (this.type === '1' && !this.deviceId) {
      getDeviceAssetsById(this.processId, 1).then((res) => {
        this.baseAssetsData = res.data
      })
    } else if (this.type === '1' && this.deviceId) {
      getBaselineByDeviceId(this.deviceId, this.status).then((res) => {
        this.baseInfo = res.data.simBaselineReportBOS
        this.baseForm.orgName = res.data.reportUserBaseBO.orgName
        this.baseForm.nickName = res.data.reportUserBaseBO.nickName
        this.baseForm.phone = res.data.reportUserBaseBO.phone
        this.baseForm.email = res.data.reportUserBaseBO.email
        this.baseForm.deviceId = res.data.deviceId
      })
    }
    // seep
    if (this.type === '2') {
      getDeviceAssetsById(this.processId, 2).then((res) => {
        this.baseAssetsData = res.data
      })
      getPenetrationByProcessId(this.processId, this.status).then((res) => {
        if (this.status === '1') {
          this.seepForm.orgName = res.data.reportUserBaseBO.orgName
          this.seepForm.nickName = res.data.reportUserBaseBO.nickName
          this.seepForm.phone = res.data.reportUserBaseBO.phone
          this.seepForm.email = res.data.reportUserBaseBO.email
        }
        this.seepTable = res.data.simReportPenetrationBOS
      })
    }
  },
  methods: {
    uploadFile(level1, level2) {
      this.currentCell.level1 = level1
      this.currentCell.level2 = level2
      this.$refs.reportFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      if (this.type === '1') {
        let formData = new FormData()
        formData.append('file', e.target.files[0])
        formData.append('processId', this.processId)
        formData.append('type', this.type)
        formData.append('status', this.status)
        uploadReport(formData).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          switch (this.status) {
            case '1':
              this.baseInfo[this.currentCell.level1].childData[
                this.currentCell.level2
              ].imgs.push({ url: res.data })
              break
            case '2':
              this.baseInfo[this.currentCell.level1].childData[
                this.currentCell.level2
              ].newImgs.push({ url: res.data })
              break
          }
        })
      } else if (this.type === '2') {
        let formData = new FormData()
        formData.append('file', e.target.files[0])
        formData.append('processId', this.processId)
        formData.append('type', this.type)
        formData.append('status', this.status)
        uploadReport(formData).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.seepResForm.imgs.push({ url: res.data })
          this.$refs.reportSeepResForm.validate()
        })
      } else if (this.type === '3' || this.type === '4') {
        this.flawForm.file = e.target.files[0]
      }
      this.$refs.reportFile.value = null
    },
    closePage() {
      window.close()
    },
    downloadFile(path) {
      download(path)
    },
    removeBaseImg(type, index, index2, imgIndex) {
      this.baseInfo[index].childData[index2][type].splice(imgIndex, 1)
    },
    changeDeviceId(val) {
      getAsstesByDeviceId(val.target.value).then((res) => {
        this.baseSelectList = res.data
        this.baseSelectValue = []
        this.baseSelectList.forEach((item, index) => {
          this.baseSelectValue.push('')
          if (item.asstesValueBOS.length === 1)
            this.baseSelectValue[index] = item.asstesValueBOS[0].dictionId
        })
      })
    },
    // 基线提交
    submitBase() {
      this.$confirm('确认保存？', '提示').then(() => {
        let res = {
          reportUserBaseBO: {
            orgName: this.baseForm.orgName,
            nickName: this.baseForm.nickName,
            phone: this.baseForm.phone,
            email: this.baseForm.email,
          },
          deviceId: this.baseForm.deviceId,
          status: this.status,
          childData: [],
        }
        this.baseInfo.forEach((item) => {
          if (item.childData) {
            item.childData.forEach((item2) => {
              res.childData.push({
                key: item2.key,
                value: item2.value,
                other: item2.other,
                imgs: item2.imgs,
                newImgs: item2.newImgs,
                dictionId: item2.dictionId,
              })
            })
          }
        })
        saveBaseline(res).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.closePage()
        })
      })
    },
    // 渗透相关
    addSeep() {
      if (!this.$refs.reportSeepResForm.validate()) return
      if (this.seepResForm.leakStatus === '0') {
        this.seepResForm.leakTitle = '无'
        this.seepResForm.cevNum = '无'
        this.seepResForm.hazardLevel = '无'
        this.seepResForm.leakHazardDesc = '无'
        this.seepResForm.reformDesc = '无'
      }
      this.seepTable.push(JSON.parse(JSON.stringify(this.seepResForm)))
      Object.assign(this.$data.seepResForm, this.$options.data().seepResForm)
    },
    removeSeepImg(index) {
      this.seepResForm.imgs.splice(index, 1)
    },
    seepRemove(index) {
      this.seepTable.splice(index, 1)
    },
    submitSeep() {
      if (!this.$refs.reportSeepForm.validate()) return
      let res = {
        reportUserBaseBO: {
          orgName: this.seepForm.orgName,
          nickName: this.seepForm.nickName,
          phone: this.seepForm.phone,
          email: this.seepForm.email,
        },
        reportPenetrationBO: this.status === '1' ? this.seepTable : null,
        processId: this.processId,
      }
      if (this.status === '1') {
        savePenetration(res).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.closePage()
        })
      } else {
        saveReviewPenetration(res).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.closePage()
        })
      }
    },
    seepRectification(uuid) {
      this.$confirm('确认完成？', '提示').then(() => {
        reformPenetration(uuid).then((res) => {
          getPenetrationByProcessId(this.processId, this.status).then((res) => {
            this.seepTable = res.data.simReportPenetrationBOS
          })
          this.$message({ content: res.message, type: 'success' })
        })
      })
    },
    // 漏洞提交
    submitFlaw(fileType) {
      if (!this.$refs.reportFlawForm.validate()) return
      this.$confirm('确认保存？', '提示').then(() => {
        let formData = new FormData()
        formData.append('processId ', this.processId)
        formData.append('fileType ', fileType)
        for (const key in this.flawForm) {
          formData.append(key, this.flawForm[key])
        }
        uploadFlawReport(formData).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.closePage()
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  background: #ebebeb;
  /deep/ .wrap {
    box-shadow: none;
    .dialog-title {
      font-size: 22px;
      margin: 0 auto;
      color: #045fc9;
      background: #ebebeb;
      padding: 10px 3% 0 3%;
      > span:last-child {
        display: none;
      }
    }
    .dialog-body {
      padding: 10px 3%;
      .content {
        text-align: center;
        background: #fff;
        h4 {
          background: #0196e0;
          color: #fff;
          text-align: left;
          padding: 8px 15px;
        }
        .box {
          text-align: left;
          padding: 20px 0;
          display: flex;
          flex-wrap: wrap;
          width: 80%;
          margin: 0 auto;
          .form-gound {
            width: 50%;
          }
          .f-full {
            width: 100%;
            .form-item > label {
              flex: 1;
            }
            .form-item > span {
              flex: 8;
              select {
                width: 43.4%;
              }
            }
          }
        }
        table {
          width: 96%;
          margin: 15px auto;
          border: 1px solid #608ad2;
          thead > tr {
            background: #608ad2;
          }
        }
      }
      .details {
        padding: 0 20px 20px 20px;
        background: #fff;
        .group > .title {
          color: #0196e0;
          font-weight: bold;
          border-bottom: 1px solid #ccc;
          padding-bottom: 10px;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .group {
          text-align: left;
          .caption {
            font-weight: bold;
          }
          .item {
            border-bottom: 1px solid #ccc;
            margin-bottom: 10px;
            margin-left: 20px;
            .form-item {
              flex-flow: column;
              padding: unset;
              > label {
                text-align: left;
              }
              > span {
                width: 100%;
              }
            }
            .radio-box {
              label {
                input[type='text'] {
                  width: unset;
                }
              }
            }
          }
        }
      }
    }
  }
}
form {
  width: 100%;
  text-align: center;
  button {
    display: inline-block;
    margin: 10px;
  }
}
.remove-button {
  max-width: unset;
  margin: 0 10px 0 0;
  svg {
    position: relative;
    top: -3px;
    color: #ff4949;
    font-size: 10px;
    background: #fff;
    border: 1px solid #ff4949;
    border-radius: 50%;
  }
}
</style>
