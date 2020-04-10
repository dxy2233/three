<template>
  <div class="check">
    <div class="search-box">
      <button
        v-if="info.visibleMap.createExaminationGroup"
        @click="openDialog('启动审计流程')"
      >
        <svg-icon icon-class="add" />启动审计流程
      </button>
      <button v-if="info.visibleMap.exportExamination">
        <svg-icon icon-class="export" />导出报表
      </button>
      <label>
        项目名称
        <input
          type="text"
          placeholder="请输入项目名称"
          v-model="tableForm.projectName"
        />
      </label>
      <label>
        运营单位
        <baseCascader
          v-if="info.visibleMap.orgTree"
          v-model="tableForm.orgId"
          :data="systemOrgNodeTree"
        />
      </label>
      <label>
        是否过期
        <select v-model="tableForm.expired">
          <option :value="null">全部</option>
          <option :value="false">未过期</option>
          <option :value="true">已过期</option>
        </select>
      </label>
      <label>
        审计状态
        <select v-model="tableForm.examineStatus">
          <option :value="null">全部</option>
          <option :value="0">待审计</option>
          <option :value="1">审计中</option>
          <option :value="2">审计通过</option>
        </select>
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable :tableData="tableData.pageInfo.list">
      <baseCol prop="projectNumber" label="项目编号" />
      <baseCol prop="projectName" label="项目名称" />
      <baseCol prop="orgName" label="运营单位" />
      <baseCol prop="leaderName" label="审计组长" />
      <baseCol prop="personName" label="审计人员" />
      <baseCol prop="examineStatus" label="审计状态" />
      <baseCol prop="startTime" label="审计开始时间" />
      <baseCol prop="endTime" label="审计结束时间" />
      <baseCol label="操作">
        <template #button="props">
          <button v-if="props.row.dataVisible" @click="openFile(props.row)">
            相关资料
          </button>
          <button @click="openReport(props.row)">审计报告</button>
          <button
            v-if="props.row.deleteVisible"
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
      :total="tableData.pageInfo.total"
      :pages="tableData.pageInfo.pages"
      @changeCurrentPage="init"
    />

    <!-- 上传文件input -->
    <input type="file" ref="checkFile" @change="upload($event)" />

    <baseDialog :visible.sync="dialog">
      <template #title>{{ dialogTitle }}</template>
      <div class="content">
        <div class="result">
          <header>创建审计</header>
          <div class="item">
            <label> 审计组名称 </label>
            <input type="text" v-model="examinationForm.name" />
          </div>
          <div class="item">
            <label> 审计人员 </label>
            <div class="item-list scroll-bar">
              <label v-for="(item, index) in expertIdList" :key="index">
                <input
                  :value="item.id"
                  type="radio"
                  v-model="examinationForm.expertLeaderId"
                />
                {{ item.name }}
              </label>
              <span class="tips">请在右则选择专家,点击姓名为组长</span>
            </div>
          </div>
          <div class="item">
            <label> 选取审计项目 </label>
            <div class="item-list scroll-bar">
              <span v-for="(item, index) in projectIdList" :key="index">{{
                item.name
              }}</span>
              <span class="tips">请在右侧选择项目名称</span>
            </div>
          </div>
          <div class="item">
            <label> 审计开始时间 </label>
            <input type="date" v-model="examinationForm.startTime" />
          </div>
          <div class="item">
            <label> 审计结束时间 </label>
            <input type="date" v-model="examinationForm.endTime" />
          </div>
        </div>

        <div class="staff">
          <header>
            人员列表
            <span
              >{{ examinationForm.expertIdList.length }}/{{
                staffs.length
              }}</span
            >
          </header>
          <div class="staff-list scroll-bar">
            <input
              type="text"
              v-model="staffsSearch"
              style="margin-bottom:5px;"
            />
            <label v-for="(item, index) in staffsSearched" :key="index">
              <input
                :value="item.id"
                type="checkbox"
                v-model="examinationForm.expertIdList"
              />
              {{ item.name }}
            </label>
          </div>
        </div>

        <div class="term">
          <header>
            项目列表
            <span
              >{{ examinationForm.projectIdList.length }}/{{
                terms.length
              }}</span
            >
          </header>
          <div class="term-list scroll-bar">
            <input
              type="text"
              v-model="termsSearch"
              style="margin-bottom:5px;"
            />
            <label v-for="(item, index) in termsSearched" :key="index">
              <input
                :value="item.id"
                type="checkbox"
                v-model="examinationForm.projectIdList"
              />
              {{ item.name }}
            </label>
          </div>
          <div class="random">
            <input
              type="number"
              v-model="randomVal"
              min="1"
              placeholder="请输入随机抽取的数量"
            />
            <button @click="randomLot">抽取</button>
          </div>
        </div>
        <button @click="addExaminationGroup">
          <svg-icon icon-class="save" />保 存
        </button>
      </div>
    </baseDialog>

    <!-- 相关资料 -->
    <baseDialog :visible.sync="fileDialog" @closed="closedFileDialog">
      <template #title>相关资料</template>
      <nav>
        <span @click="catList(false)">返回上一级</span>|
        <span>{{
          activeFileData.map(item => item.folderName).join(' > ')
        }}</span>
      </nav>
      <div v-if="activeFileData.length > 0" class="folder-wrap">
        <baseTable
          v-show="activeFileData[activeFileData.length - 1].fileList.length > 0"
          :tableData="activeFileData[activeFileData.length - 1].fileList"
        >
          <baseCol prop="fileName" label="文件名">
            <template #button="props">
              <span class="link" @click="download(1, props.row)">{{
                props.row.fileName
              }}</span>
            </template>
          </baseCol>
          <baseCol prop="fileSize" label="大小" />
          <baseCol prop="updateTime" label="时间" />
        </baseTable>
        <div class="folder-box">
          <div
            v-for="(item, index) in activeFileData[activeFileData.length - 1]
              .children"
            :key="index"
            @click="catList(item)"
          >
            <svg-icon icon-class="folder" />
            <p>{{ item.folderName }}</p>
          </div>
        </div>
      </div>
    </baseDialog>

    <!-- 审计报告 -->
    <baseDialog :visible.sync="reportDialog">
      <template #title>审计报告</template>
      <button v-if="activeRow.uploadReportVisible" @click="uploadFile">
        <svg-icon icon-class="up" /> 上传审计报告
      </button>
      <button v-if="activeRow.uploadReportVisible" @click="reportPass">
        <svg-icon icon-class="sure" />通过审计
      </button>
      <baseTable :tableData="reportTable">
        <baseCol prop="fileName" label="文件名">
          <template #button="props">
            <span @click="download(2, props.row)">{{
              props.row.fileName
            }}</span>
          </template>
        </baseCol>
        <baseCol prop="fileSize" label="大小" />
        <baseCol prop="uploadTime" label="时间" />
        <baseCol prop="uploadPerson" label="上传人" />
      </baseTable>
    </baseDialog>
  </div>
</template>

<script>
import {
  getExaminationGroupByUser,
  deleteProjectById,
  getExpertList,
  getBaseInfoList,
  saveExaminationGroup,
  getReportList,
  uploadReport,
  getRelateFileListById,
  downloadReport,
  confirm
} from '@/api/examinationGroup'
import { downloadFile } from '@/api/file'
import { orgTree } from '@/assets/mixin/common'
import { mapGetters } from 'vuex'

export default {
  name: 'Check',
  mixins: [orgTree],
  data() {
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectName: '',
        expired: '',
        orgId: '',
        examineStatus: null
      },
      tableData: {
        pageInfo: {
          list: []
        }
      },
      dialog: false,
      dialogTitle: '',
      staffs: [],
      staffsSearch: '',
      terms: [],
      termsSearch: '',
      examinationForm: {
        name: '',
        expertLeaderId: '',
        projectIdList: [],
        expertIdList: [],
        startTime: '',
        endTime: ''
      },
      randomVal: '',
      activeRow: {},
      reportDialog: false,
      reportTable: [],
      fileDialog: false,
      fileData: [],
      activeFileData: []
    }
  },
  computed: {
    ...mapGetters(['info']),
    // 选中的审计项目信息
    projectIdList() {
      return this.terms.filter(item =>
        this.examinationForm.projectIdList.includes(item.id)
      )
    },
    // 选中的专家信息
    expertIdList() {
      return this.staffs.filter(item =>
        this.examinationForm.expertIdList.includes(item.id)
      )
    },
    // 搜索后的人员列表
    staffsSearched() {
      return this.staffs.filter(item => item.name.includes(this.staffsSearch))
    },
    // 搜索后的项目列表
    termsSearched() {
      return this.terms.filter(item => item.name.includes(this.termsSearch))
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getExaminationGroupByUser(this.tableForm).then(res => {
        this.tableData = res.data
      })
    },
    openDialog(type) {
      this.dialogTitle = type
      Promise.all([getExpertList(), getBaseInfoList()]).then(res => {
        this.staffs = res[0].data
        this.terms = res[1].data
        this.dialog = true
      })
    },
    remove(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteProjectById(id).then(res => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    // 随机抽取
    randomLot() {
      // 筛选出可选列表
      let list = this.terms.filter(
        item => !this.examinationForm.projectIdList.includes(item.id)
      )
      for (let i = 1; i <= this.randomVal; i++) {
        // 计算随机索引
        let ranIndex = Math.floor(Math.random() * list.length)
        // 添加选中的id
        this.examinationForm.projectIdList.push(list[ranIndex].id)
        // 删除已选中的数据
        list.splice(ranIndex, 1)
      }
      this.randomVal = ''
    },
    addExaminationGroup() {
      for (const i in this.examinationForm) {
        if (!this.examinationForm[i]) {
          this.$message({ content: '请填写完整', type: 'warning' })
          return
        }
      }
      let subData = JSON.parse(JSON.stringify(this.examinationForm))
      saveExaminationGroup([subData]).then(res => {
        this.init()
        this.dialog = false
        this.$message({ content: res.message, type: 'success' })
      })
    },
    // 上传相关文件
    uploadFile() {
      this.$refs.checkFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      let formData = new FormData()
      formData.append('file', e.target.files[0])
      formData.append('id', this.activeRow.id)
      this.$refs.checkFile.value = null
      uploadReport(formData).then(res => {
        this.$message({ content: res.message, type: 'success' })
        this.openReport()
      })
    },
    // 下载文件
    // type:1为相关资料,2为审计报告
    download(type, info) {
      switch (type) {
        case 1:
          downloadFile(info.fileId, info.isExamineFile)
          break
        case 2:
          downloadReport(info.id)
          break
      }
    },
    openReport(info) {
      if (info) this.activeRow = info
      const parameter = info ? info.id : this.activeRow.id
      getReportList(parameter).then(res => {
        this.reportTable = res.data
        this.reportDialog = true
      })
    },
    reportPass() {
      this.$confirm('确认通过？', '提示').then(() => {
        confirm(this.activeRow.id).then(res => {
          this.init()
          this.$message({ content: res.message, type: 'success' })
          this.reportDialog = false
        })
      })
    },
    openFile(info) {
      getRelateFileListById(info.id).then(res => {
        this.fileData = res.data
        this.activeFileData.push(res.data)
        this.fileDialog = true
      })
    },
    closedFileDialog() {
      this.activeFileData = []
    },
    // 相关资料点击事件
    catList(row) {
      row ? this.activeFileData.push(row) : this.activeFileData.pop()
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 500px;
  padding-bottom: 50px;
  text-align: center;
  > div {
    text-align: left;
    background: #fff;
    box-sizing: border-box;
    header {
      height: 35px;
      line-height: 35px;
      background: #0196e0;
      color: #fff;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
  .result {
    float: left;
    width: calc(65% - 20px);
    height: 100%;
    margin-right: 20px;
    .item {
      padding: 5px 0;
      display: flex;
      flex-wrap: wrap;
      > label {
        &:first-child {
          text-align: right;
          width: 30%;
          margin: 5px 2% 0 0;
        }
      }
      .item-list {
        width: calc(60% - 20px);
        max-height: 100px;
        background: #e5f4fc;
        padding: 5px 10px;
        overflow-y: auto;
        span {
          padding: 3px 0;
          display: block;
        }
        span.tips {
          color: #0196e0;
        }
        label {
          margin-right: 10px;
        }
      }
      // input[type='radio'] {
      //   width: auto;
      // }
      input[type='text'],
      input[type='date'] {
        width: 60%;
      }
    }
  }
  .staff {
    float: right;
    width: 35%;
    height: 50%;
    .staff-list {
      padding: 0 20px;
      height: calc(78%);
      overflow-y: auto;
      label {
        width: 50%;
        display: block;
        float: left;
        // input[type='checkbox'] {
        //   width: unset;
        // }
      }
      // label {
      // width: 33.3%;
      // display: block;
      // float: left;
      // }
    }
  }
  .term {
    float: right;
    width: 35%;
    height: calc(50% - 20px);
    margin-top: 20px;
    position: relative;
    .term-list {
      padding: 0 20px;
      overflow-y: auto;
      height: calc(50% - 10px);
      label {
        display: flex;
        input {
          margin-right: 5px;
        }
      }
    }
    .random {
      width: 100%;
      text-align: center;
      border-top: 1px solid #ccc;
      position: absolute;
      left: 0;
      bottom: 10px;
      white-space: nowrap;
      input {
        margin: 0 10px;
        width: 70%;
      }
    }
  }
}
nav {
  span:first-child {
    color: #045fc9;
    cursor: pointer;
    margin-right: 5px;
    &:hover {
      text-decoration: underline;
    }
  }
}
.folder-wrap {
  padding: 10px 0;
  .folder-box {
    display: flex;
    text-align: center;
    flex-wrap: wrap;
    padding: 5px 0;
    > div {
      padding: 10px 20px;
      svg {
        font-size: 38px;
      }
      p {
        margin: 0;
      }
      &:hover {
        background: #fff;
      }
    }
  }
}
</style>
