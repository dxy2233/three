<template>
  <div class="otherterm">
    <div class="search-box">
      <label>
        项目名称
        <input
          type="text"
          placeholder="请输入项目名称"
          v-model="tableForm.projectName"
        />
      </label>
      <label>
        系统/平台名称
        <input
          type="text"
          placeholder="请输入系统名称"
          v-model="tableForm.platformName"
        />
      </label>
      <label>
        系统/平台影响范围
        <baseCascader
          v-model="tableForm.cityId"
          :data="cityData"
          :childrenName="'cityBOList'"
          label="name"
        />
      </label>
      <button @click="init(true)"><svg-icon icon-class="search" />搜索</button>
    </div>

    <baseTable :tableData="tableData.list">
      <baseCol prop="projectName" label="项目名称" />
      <baseCol prop="platformName" label="系统/平台名称" />
      <baseCol prop="supervisorOrgName" label="系统/平台主管单位名称" />
      <baseCol prop="maintainOrgName" label="系统/平台运营单位名称" />
      <baseCol
        prop="infoLevel"
        label="系统/平台内存储或可查询用户个人信息最高等级"
      />
      <baseCol prop="city" label="平台影响范围" />
      <baseCol prop="realName" label="平台账号实名制管理" />
      <baseCol label="操作">
        <template #button="props">
          <button @click.stop="openDialog(props.row)">查看</button>
          <button @click.stop="downloadTableRow(props.row.processId)">
            导出
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

    <baseDialog :visible.sync="dialog" top="0">
      <template #title>{{ dialogTitle }}第三方使用管理情况统计表</template>
      <baseForm ref="otherTermForm" :form="form">
        <!-- <baseFormItem label="项目名称" required>
          <input type="text" v-model="form.platformName" />
        </baseFormItem> -->
        <baseFormItem label="系统/平台名称" required>
          <input type="text" v-model="form.platformName" />
        </baseFormItem>
        <baseFormItem label="系统/平台主管单位名称（账号管理单位）" required>
          <input type="text" v-model="form.supervisorOrgName" />
        </baseFormItem>
        <baseFormItem label="系统/平台运营单位名称（运行维护单位）" required>
          <input type="text" v-model="form.maintainOrgName" />
        </baseFormItem>
        <baseFormItem
          label="系统/平台内存储或可查询用户个人信息或重要信息类型"
          required
        >
          <label>
            <input type="checkbox" v-model="form.infoTypeList" :value="1" />
            身份信息
          </label>
          <label>
            <input type="checkbox" v-model="form.infoTypeList" :value="2" />
            业务/合作信息
          </label>
          <label>
            <input type="checkbox" v-model="form.infoTypeList" :value="3" />
            通信信息
          </label>
          <label>
            <input type="checkbox" v-model="form.infoTypeList" :value="4" />
            消费信息
          </label>
          <label>
            <input type="checkbox" v-model="form.infoTypeList" :value="5" />
            用户账号密码信息
          </label>
          <label>
            <input type="checkbox" v-model="form.infoTypeList" :value="0" />
            其它
          </label>
        </baseFormItem>
        <baseFormItem
          label="系统/平台内存储或可查询用户个人信息最高等级"
          required
        >
          <label>
            <input type="radio" v-model="form.infoLevel" :value="1" />
            1
          </label>
          <label>
            <input type="radio" v-model="form.infoLevel" :value="2" />
            2
          </label>
          <label>
            <input type="radio" v-model="form.infoLevel" :value="3" />
            3
          </label>
        </baseFormItem>
        <baseFormItem label="系统/平台影响范围" required>
          <baseCascader
            v-model="form.cityId"
            :data="cityData"
            :childrenName="'cityBOList'"
            label="name"
            disabled
          />
        </baseFormItem>
        <baseFormItem label="系统/平台账号实名制管理" required>
          <label>
            <input type="radio" v-model="form.realName" :value="2" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.realName" :value="1" />
            否
          </label>
        </baseFormItem>
        <baseFormItem label="系统/平台登陆日志保存时间(月)" required>
          <input type="text" v-model="form.loginRecord" />
        </baseFormItem>
        <baseFormItem label="系统/平台操作日志保存时间(月)" required>
          <input type="text" v-model="form.operateRecord" />
        </baseFormItem>
        <baseFormItem label="系统/平台默认口令复杂度" required>
          <label>
            <input type="radio" v-model="form.complexity" :value="1" />
            1级
          </label>
          <label>
            <input type="radio" v-model="form.complexity" :value="2" />
            2级
          </label>
          <label>
            <input type="radio" v-model="form.complexity" :value="3" />
            3级
          </label>
          <label>
            <input type="radio" v-model="form.complexity" :value="4" />
            4级
          </label>
        </baseFormItem>
        <baseFormItem label="系统/平台默认口令有效期(天)" required>
          <input type="text" v-model="form.expiration" />
        </baseFormItem>
        <baseFormItem label="定期审计账号/操作周期(月)" required>
          <input type="text" v-model="form.auditCycle" />
        </baseFormItem>
        <baseFormItem
          label="系统/平台是否开设了第三方账号（包括把内部账号授予第三方使用）"
          required
        >
          <label>
            <input type="radio" v-model="form.thirdAccount" :value="2" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.thirdAccount" :value="1" />
            否
          </label>
        </baseFormItem>
        <baseFormItem label="有无决定引入第三方的程序和决策审核流程" required>
          <label>
            <input type="radio" v-model="form.useThird" :value="2" />
            有
          </label>
          <label>
            <input type="radio" v-model="form.useThird" :value="1" />
            无
          </label>
        </baseFormItem>
        <baseFormItem
          v-show="form.useThird === 2"
          label="决定引入第三方的程序和决策审核流程具体决策人"
          required
        >
          <input type="text" v-model="form.policyPersonName" />
        </baseFormItem>
        <baseFormItem
          label="有分配、授权第三方人员使用系统/平台账号相关审批管理规定"
          required
        >
          <label>
            <input type="radio" v-model="form.regulation" :value="2" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.regulation" :value="1" />
            否
          </label>
        </baseFormItem>
        <baseFormItem label="第三方账号是否具有批量信息导出权限" required>
          <label>
            <input type="radio" v-model="form.export" :value="2" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.export" :value="1" />
            否
          </label>
        </baseFormItem>
        <baseFormItem label="第三方账号是否有系统/平台关闭、重启权限" required>
          <label>
            <input type="radio" v-model="form.reboot" :value="2" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.reboot" :value="1" />
            否
          </label>
        </baseFormItem>
        <baseFormItem
          label="第三方账号权限是否可查看用户个人信息及重要信息"
          required
        >
          <label>
            <input type="radio" v-model="form.importantInfo" :value="2" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.importantInfo" :value="1" />
            否
          </label>
        </baseFormItem>
        <baseFormItem label="第三方单位名称" required>
          <input type="text" v-model="form.thirdOrgName" />
        </baseFormItem>
        <baseFormItem label="第三方项目类型" required>
          <select v-model="form.projectType">
            <option :value="1">系统/平台集成</option>
            <option :value="2">外包、代维、维保、业务合作</option>
            <option :value="3">技术支撑、赠送</option>
          </select>
        </baseFormItem>
        <baseFormItem label="第三方项目来源方式" required>
          <select v-model="form.sourceType">
            <option :value="0">其它</option>
            <option :value="1">招标</option>
            <option :value="2">比选</option>
            <option :value="3">定向谈判</option>
            <option :value="4">免费服务</option>
          </select>
        </baseFormItem>
        <baseFormItem label="第三方人员数量" required>
          <input type="text" v-model="form.thirdNumber" />
        </baseFormItem>
        <baseFormItem label="第三方人员参与模式" required>
          <label>
            <input type="checkbox" v-model="form.modeList" :value="1" />
            现场
          </label>
          <label>
            <input type="checkbox" v-model="form.modeList" :value="2" />
            远程
          </label>
        </baseFormItem>
        <baseFormItem label="第三方合同中明确网信安职责" required>
          <label>
            <input type="radio" v-model="form.respon" :value="2" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.respon" :value="1" />
            否
          </label>
        </baseFormItem>
        <baseFormItem label="是否明确第三方违约责任/罚则" required>
          <label>
            <input type="radio" v-model="form.penalty" :value="2" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.penalty" :value="1" />
            否
          </label>
        </baseFormItem>
        <baseFormItem label="第三方人员全部签订安全及保密协议" required>
          <label>
            <input type="radio" v-model="form.protocol" :value="2" />
            是
          </label>
          <label>
            <input type="radio" v-model="form.protocol" :value="1" />
            否
          </label>
        </baseFormItem>
        <baseFormItem v-if="form.protocol === 2" label="附件" required>
          <span
            @click="download(form.protocolFileBO.fileId, false)"
            class="link"
            style="margin: 0; height: 23px"
            >{{ form.protocolFileBO.fileName }}</span
          >
        </baseFormItem>
        <baseFormItem
          label="定期检查第三方网络安全责任落实情况周期(月)"
          required
        >
          <input type="text" v-model="form.checkCycle" />
        </baseFormItem>
        <baseFormItem label="第三方网信安措施效果评估周期(月)" required>
          <input type="text" v-model="form.evaluateCycle" />
        </baseFormItem>
        <baseFormItem label="第三方网信安措施效果评估结果 " required>
          <textarea rows="5" v-model="form.evaluateResult" />
        </baseFormItem>
        <baseFormItem label="备注" required>
          <textarea rows="5" v-model="form.remark" />
        </baseFormItem>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import {
  getCity,
  getProjectList,
  getStatisticsTableByProcessId,
  downloadTableByProcessId,
} from '@api/process'
import { previewFile } from '@api/file'

export default {
  name: 'Otherterm',
  data() {
    return {
      tableForm: {
        startPage: 1,
        pageSize: 20,
        projectName: '',
        platformName: '',
        cityId: '',
      },
      cityData: [],
      tableData: {},
      dialog: false,
      dialogTitle: '',
      form: {},
    }
  },
  created() {
    // 获取转维节点影响范围的城市信息
    getCity().then((res) => {
      this.cityData = res.data
    })
    this.init()
  },
  methods: {
    init(isSearch) {
      if (isSearch) this.tableForm.startPage = 1
      getProjectList(this.tableForm).then((res) => {
        this.tableData = res.data
      })
    },
    openDialog(info) {
      this.dialogTitle = info.platformName
      this.$nextTick(() => {
        this.$refs.otherTermForm.$el
          .querySelectorAll('input, select, textarea')
          .forEach((item) => (item.disabled = true))
      })
      getStatisticsTableByProcessId(info.processId).then((res) => {
        this.form = res.data
        this.dialog = true
      })
    },
    download(id, isExamineFile) {
      previewFile(id, isExamineFile)
    },
    downloadTableRow(processId) {
      downloadTableByProcessId(processId)
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/.dialog-body {
  height: calc(100vh - 45px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track-piece {
    background-color: #fafafa;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:vertical {
    background-color: #ccc;
    border-radius: 3px;
  }
}
</style>
