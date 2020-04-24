<template>
  <div class="report">
    <div class="search-box">
      <label>
        项目编号
        <input
          type="text"
          placeholder="请输入项目编号"
          v-model="tableForm.projectCode"
        />
      </label>
      <label>
        项目名称
        <input
          type="text"
          placeholder="请输入项目名称"
          v-model="tableForm.projectName"
        />
      </label>
      <label>
        当前所处节点
        <select v-model="tableForm.processNode">
          <option :value="0">全部</option>
          <option :value="1">立项</option>
          <option :value="2">设计</option>
          <option :value="3">建设</option>
          <option :value="4">初验</option>
          <option :value="5">终验</option>
          <option :value="6">转维</option>
          <option :value="7">暂停</option>
          <option :value="8">完成</option>
        </select>
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <!-- 上传文件input -->
    <input type="file" ref="reportFile" @change="upload($event)" />

    <baseTable :tableData="tableData.list">
      <baseCol prop="projectCode" label="项目编号" />
      <baseCol prop="projectName" label="项目名称" />
      <baseCol prop="processNodeName" label="当前所处节点" />
      <baseCol prop="reportTime" label="基线检查报告">
        <template #button="props">
          <div class="report-col">
            <div>
              <span
                v-if="props.row.reportChilds[0][0].name"
                class="link"
                @click="downloadFile(props.row.reportChilds[0][0].path)"
              >
                {{ props.row.reportChilds[0][0].name }}
              </span>
              <span v-if="props.row.reportChilds[0][0].name">
                初查填写人：{{ props.row.reportChilds[0][0].uploadName }}
              </span>
              <span v-if="props.row.reportChilds[0][0].name">
                初查填写时间：{{ props.row.reportChilds[0][0].uploadTime }}
              </span>
            </div>
            <span
              v-if="props.row.reportChilds[0][0].statusVisble"
              @click="
                openBaseDialog(
                  props.row.reportChilds[0][0],
                  props.row.projectId
                )
              "
              >初查</span
            >
            <div>
              <span
                v-if="props.row.reportChilds[0][1].name"
                class="link"
                @click="downloadFile(props.row.reportChilds[0][1].path)"
              >
                {{ props.row.reportChilds[0][1].name }}
              </span>
              <span v-if="props.row.reportChilds[0][1].name">
                初查填写人：{{ props.row.reportChilds[0][1].uploadName }}
              </span>
              <span v-if="props.row.reportChilds[0][1].name">
                初查填写时间：{{ props.row.reportChilds[0][1].uploadTime }}
              </span>
            </div>
            <span
              style="top:66px;"
              v-if="props.row.reportChilds[0][1].statusVisble"
              @click="
                openBaseDialog(
                  props.row.reportChilds[0][1],
                  props.row.projectId
                )
              "
              >复查</span
            >
          </div>
        </template>
      </baseCol>
      <baseCol prop="dutyDepartmentName" label="渗透测试报告">
        <template #button="props">
          <div class="report-col">
            <div>
              <span
                v-if="props.row.reportChilds[1][0].name"
                class="link"
                @click="downloadFile(props.row.reportChilds[1][0].path)"
              >
                {{ props.row.reportChilds[1][0].name }}
              </span>
              <span v-if="props.row.reportChilds[1][0].name">
                初查填写人：{{ props.row.reportChilds[1][0].uploadName }}
              </span>
              <span v-if="props.row.reportChilds[1][0].name">
                初查填写时间：{{ props.row.reportChilds[1][0].uploadTime }}
              </span>
            </div>
            <span
              v-if="props.row.reportChilds[1][0].statusVisble"
              @click="
                openSeepDialog(
                  props.row.reportChilds[1][0],
                  props.row.projectId
                )
              "
              >初查</span
            >
            <div>
              <span
                v-if="props.row.reportChilds[1][1].name"
                class="link"
                @click="downloadFile(props.row.reportChilds[1][1].path)"
              >
                {{ props.row.reportChilds[1][1].name }}
              </span>
              <span v-if="props.row.reportChilds[1][1].name">
                初查填写人：{{ props.row.reportChilds[1][1].uploadName }}
              </span>
              <span v-if="props.row.reportChilds[1][1].name">
                初查填写时间：{{ props.row.reportChilds[1][1].uploadTime }}
              </span>
            </div>
            <span
              style="top:66px;"
              v-if="props.row.reportChilds[1][1].statusVisble"
              @click="
                openSeepDialog(
                  props.row.reportChilds[1][1],
                  props.row.projectId
                )
              "
              >复查</span
            >
          </div>
        </template>
      </baseCol>
      <baseCol prop="fundsSource" label="漏洞扫描报告">
        <template #button="props">
          <div class="report-col">
            <div>
              <span
                v-if="props.row.reportChilds[2][0].name"
                class="link"
                @click="downloadFile(props.row.reportChilds[2][0].path)"
              >
                {{ props.row.reportChilds[2][0].name }}
              </span>
              <span v-if="props.row.reportChilds[2][0].name">
                上传人：{{ props.row.reportChilds[2][0].uploadName }}
              </span>
              <span v-if="props.row.reportChilds[2][0].name">
                上传时间：{{ props.row.reportChilds[2][0].uploadTime }}
              </span>
            </div>
            <span
              v-if="props.row.reportChilds[2][0].statusVisble"
              @click="uploadFile(3, null, null, 1, props.row.projectId)"
              >初查</span
            >
            <div>
              <span
                v-if="props.row.reportChilds[2][1].name"
                class="link"
                @click="downloadFile(props.row.reportChilds[2][1].path)"
              >
                {{ props.row.reportChilds[2][1].name }}
              </span>
              <span v-if="props.row.reportChilds[2][1].name">
                上传人：{{ props.row.reportChilds[2][1].uploadName }}
              </span>
              <span v-if="props.row.reportChilds[2][1].name">
                上传时间：{{ props.row.reportChilds[2][1].uploadTime }}
              </span>
            </div>
            <span
              style="top:66px;"
              v-if="props.row.reportChilds[2][1].statusVisble"
              @click="uploadFile(3, null, null, 2)"
              >复查</span
            >
          </div>
        </template>
      </baseCol>
      <baseCol label="操作">
        <template #button>
          <button>
            导出报告
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

    <!-- 基线dialog -->
    <baseDialog :visible.sync="dialogBase" width="80%" top="0">
      <template #title>{{ dialogBaseTitle }}</template>
      <div ref="reportBaseForm" class="base-form">
        <div v-for="(item, index) in baseInfo" :key="index" class="group">
          <div class="caption">{{ item.num }}、{{ item.title }}</div>
          <div
            v-for="(item2, index2) in item.childData"
            :key="index2"
            class="item"
          >
            <div class="title">
              {{ item.num }}.{{ item2.num }}、<em>*</em>{{ item2.title }}
            </div>
            <div class="radio-box">
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
            </div>
            <div>检测图片</div>
            <div class="file-box">
              <button
                v-if="item2.type === 1"
                @click="uploadFile(1, index, index2)"
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
            </div>
            <div v-if="item2.type === 2"><em>*</em>整改结果</div>
            <div v-if="item2.type === 2" class="file-box">
              <button @click="uploadFile('整改', index, index2)">
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
            </div>
          </div>
        </div>
        <button @click="submitBase" style="display:block;margin:0 auto;">
          <svg-icon icon-class="save" />保存
        </button>
      </div>
    </baseDialog>

    <!-- 渗透测试报告 -->
    <baseDialog :visible.sync="dialogSeep" width="80%" top="0">
      <template #title>{{ dialogSeepTitle }}</template>
      <div v-if="currentCell && currentCell.status === 1" class="seep-form">
        <baseForm ref="reportSeepForm" :form="seepForm" :rules="seepRules">
          <baseFormItem label="漏洞名称" prop="leakTitle" required>
            <input type="text" v-model="seepForm.leakTitle" />
          </baseFormItem>
          <baseFormItem label="等级" prop="hazardLevel" required>
            <select v-model="seepForm.hazardLevel">
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
            </select>
          </baseFormItem>
          <baseFormItem label="CVE编号" prop="cevNum" required>
            <input type="text" v-model="seepForm.cevNum" />
          </baseFormItem>
          <baseFormItem label="漏洞地址" prop="leakAddress" required>
            <input type="text" v-model="seepForm.leakAddress" />
          </baseFormItem>
          <baseFormItem label="漏洞危害说明" prop="leakHazardDesc" required>
            <textarea
              cols="30"
              rows="3"
              v-model="seepForm.leakHazardDesc"
            ></textarea>
          </baseFormItem>
          <baseFormItem label="整改建议" prop="reformDesc" required>
            <textarea
              cols="30"
              rows="3"
              v-model="seepForm.reformDesc"
            ></textarea>
          </baseFormItem>
          <baseFormItem label="漏洞效果及截图" required>
            <button type="button" @click="uploadFile(2)">
              点击上传
            </button>
            <span
              v-for="(img, imgIndex) in seepForm.imgs"
              :key="imgIndex"
              class="remove-button"
            >
              {{ img.url | imgName }}
              <svg-icon icon-class="close" @click="removeSeepImg(imgIndex)" />
            </span>
          </baseFormItem>
          <button type="button" @click="addSeep">新增</button>
        </baseForm>
      </div>
      <baseTable :tableData="seepInfoIndex">
        <baseCol prop="leakTitle" label="漏洞名称" />
        <baseCol prop="hazardLevel" label="等级" />
        <baseCol prop="cevNum" label="CVE编号" />
        <baseCol prop="leakAddress" label="漏洞地址" />
        <baseCol prop="imgs" label="漏洞效果及截图">
          <template #button="props">
            <span v-for="(img, imgIndex) in props.row.imgs" :key="imgIndex">
              {{ img.url | imgName }}
            </span>
          </template>
        </baseCol>
        <baseCol prop="leakHazardDesc" label="漏洞危害说明" />
        <baseCol prop="reformDesc" label="整改建议" />
        <baseCol label="操作">
          <template #button="props">
            <button
              v-if="currentCell && currentCell.status === 1"
              class="remove"
              @click="seepRemove(props.row.index)"
            >
              删除
            </button>
            <button
              v-else
              @click="seepRectification(props.row.uuid)"
              style="padding:0 5px;"
            >
              整改完成
            </button>
          </template>
        </baseCol>
      </baseTable>
      <button
        v-if="currentCell && currentCell.status === 1"
        @click="submitSeep"
        style="display:block;margin:20px auto 0;"
      >
        <svg-icon icon-class="save" />保存
      </button>
    </baseDialog>
  </div>
</template>

<script>
import {
  getReportList,
  getProjectReport,
  uploadReport,
  saveBaseline,
  getPenetrationByProjectId,
  savePenetration,
  reformPenetration
} from '@/api/reportCommon'
import { download } from '@/api/sftp'

export default {
  name: 'Report',
  filters: {
    buttonTxt(val) {
      switch (val) {
        case 1:
          return '初查'
        case 2:
          return '复查'
      }
    },
    imgName(val) {
      return val.slice(val.lastIndexOf('/') + 1)
    }
  },
  data() {
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectCode: '',
        projectName: '',
        processNode: 0
      },
      tableData: {},
      currentCell: {},
      dialogBase: false,
      dialogBaseTitle: '',
      baseInfo: [],
      dialogSeep: false,
      dialogSeepTitle: '',
      seepInfo: [],
      seepForm: {
        leakTitle: null,
        hazardLevel: null,
        cevNum: null,
        leakAddress: null,
        leakHazardDesc: null,
        reformDesc: null,
        imgs: []
      },
      seepRules: {
        leakTitle: [
          { required: true, message: '请输入漏洞名称', trigger: 'blur' }
        ],
        hazardLevel: [
          { required: true, message: '请选择等级', trigger: 'blur' }
        ],
        cevNum: [{ required: true, message: '请输入CVE编号', trigger: 'blur' }],
        leakAddress: [
          { required: true, message: '请输入漏洞地址', trigger: 'blur' }
        ],
        leakHazardDesc: [
          { required: true, message: '请输入漏洞危害说明', trigger: 'blur' }
        ],
        reformDesc: [
          { required: true, message: '请输入整改建议', trigger: 'blur' }
        ],
        imgs: [
          { required: true, message: '请上传漏洞效果及截图', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    seepInfoIndex() {
      let res = this.seepInfo
      res.forEach((item, index) => {
        item['index'] = index
      })
      return res
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(isSearch) {
      if (isSearch) this.tableForm.startPage = 1
      getReportList(this.tableForm).then(res => {
        this.tableData = res.data
      })
    },
    uploadFile(type, level1, level2, status, projectId) {
      // 1:基线;2:渗透,3:漏洞
      this.currentCell.type = type
      if (type === 3) {
        this.currentCell.status = status
        this.currentCell.projectId = projectId
      }
      this.currentCell.level1 = level1
      this.currentCell.level2 = level2
      this.$refs.reportFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      let formData = new FormData()
      formData.append('file', e.target.files[0])
      formData.append('projectId', this.currentCell.projectId)
      formData.append(
        'type',
        this.currentCell.type === '整改' ? 1 : this.currentCell.type
      )
      formData.append('status', this.currentCell.status)
      uploadReport(formData).then(res => {
        this.$message({ content: res.message, type: 'success' })
        switch (this.currentCell.type) {
          case 1:
            this.baseInfo[this.currentCell.level1].childData[
              this.currentCell.level2
            ].imgs.push({ url: res.data })
            break
          case '整改':
            this.baseInfo[this.currentCell.level1].childData[
              this.currentCell.level2
            ].newImgs.push({ url: res.data })
            break
          case 2:
            this.seepForm.imgs.push({ url: res.data })
            break
          case 3:
            this.init()
            break
        }
      })
      this.$refs.reportFile.value = null
    },
    downloadFile(path) {
      download(path)
    },
    // closedDialog() {
    //   Object.assign(this.$data.baseInfo, this.$options.data().baseInfo)
    //   // this.$refs.reportForm.clearErr()
    // },
    openBaseDialog(info, projectId) {
      this.currentCell = info
      this.currentCell.projectId = projectId
      info.status === 1
        ? (this.dialogBaseTitle = '初查安全防护基线配置要求')
        : (this.dialogBaseTitle = '复查安全防护基线配置要求')
      getProjectReport(projectId, info.status).then(res => {
        this.baseInfo = res.data
        this.dialogBase = true
      })
    },
    removeBaseImg(type, index, index2, imgIndex) {
      this.baseInfo[index].childData[index2][type].splice(imgIndex, 1)
    },
    submitBase() {
      this.$confirm('确认保存？', '提示').then(() => {
        let res = {
          projectId: null,
          childData: [],
          status: this.currentCell.status
        }
        res.projectId = this.currentCell.projectId
        this.baseInfo.forEach(item => {
          item.childData.forEach(item2 => {
            res.childData.push({
              key: item2.key,
              value: item2.value,
              other: item2.other,
              imgs: item2.imgs,
              newImgs: item2.newImgs
            })
          })
        })
        saveBaseline(res).then(res => {
          this.init()
          this.dialogBase = false
          this.$message({ content: res.message, type: 'success' })
        })
      })
    },
    openSeepDialog(info, projectId) {
      this.currentCell = info
      this.currentCell.projectId = projectId
      info.status === 1
        ? (this.dialogSeepTitle = '初查渗透测试结果记录')
        : (this.dialogSeepTitle = '复查渗透测试结果记录')
      getPenetrationByProjectId(projectId, info.status).then(res => {
        this.seepInfo = res.data
        this.dialogSeep = true
      })
    },
    removeSeepImg(index) {
      this.seepForm.imgs.splice(index, 1)
    },
    addSeep() {
      if (!this.$refs.reportSeepForm.validate()) return
      this.seepForm.projectId = this.currentCell.projectId
      this.seepInfo.push(JSON.parse(JSON.stringify(this.seepForm)))
    },
    submitSeep() {
      this.$confirm('确认保存？', '提示').then(() => {
        savePenetration(this.seepInfo).then(res => {
          this.init()
          this.dialogSeep = false
          this.$message({ content: res.message, type: 'success' })
        })
      })
    },
    seepRemove(index) {
      this.seepInfo.splice(index, 1)
    },
    seepRectification(uuid) {
      this.$confirm('确认完成？', '提示').then(() => {
        reformPenetration(uuid).then(res => {
          this.dialogSeepTitle = '复查渗透测试结果记录'
          // 刷新表格
          getPenetrationByProjectId(
            this.currentCell.projectId,
            this.currentCell.status
          ).then(res => {
            this.seepInfo = res.data
            this.dialogSeep = true
          })
          this.$message({ content: res.message, type: 'success' })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.report-col {
  position: relative;
  display: flex;
  flex-flow: column;
  min-width: 150px;
  > div:nth-child(1) {
    border-bottom: 1px solid #d0e8fa;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
  > div {
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    height: 60px;
    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  > span {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16%;
    height: 30px;
    top: -5px;
    right: 0;
    background: #ebebeb;
    cursor: pointer;
    &:hover {
      background: #158ae7;
      color: #fff;
    }
  }
}

.base-form {
  padding: 0 5%;
  em {
    color: red;
    margin-right: 5px;
  }
  .group {
    .caption {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .item {
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
      padding-left: 30px;
      .title {
        margin-left: -30px;
      }
      .radio-box {
        margin: 5px 0;
        label {
          margin-right: 20px;
          input[type='text'] {
            width: unset;
          }
        }
      }
      .file-box {
        button {
          background: #fff;
          border: 1px solid #158ae7;
          color: #158ae7;
          &:hover {
            background: #158ae7;
            color: #fff;
          }
        }
      }
    }
  }
}

.seep-form {
  form {
    /deep/.form-gound {
      width: 50%;
      display: inline-block;
    }
  }
}

.remove-button {
  max-width: unset;
  display: inline-block;
  height: 40px;
  line-height: 40px;
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
