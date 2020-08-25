<template>
  <div v-if="allData.initiateBO" class="flow-form">
    <h1>{{ allData.projectName }}</h1>
    <div class="detail">
      <div class="item">
        <label>项目编号:</label>
        <span>{{ allData.projectCode }}</span>
      </div>
      <div class="item">
        <label>填报人:</label>
        <span>{{ allData.reportName }}</span>
      </div>
      <div class="item">
        <label>填报时间:</label>
        <span>{{ allData.reportTime }}</span>
      </div>
      <div class="item">
        <label>责任部门:</label>
        <span>{{ allData.orgName }}</span>
      </div>
      <div class="item">
        <label>备案等级:</label>
        <span>{{ allData.level }}</span>
      </div>
      <div class="item">
        <label>使用公网IP数量:</label>
        <span>{{ allData.ipNum }}</span>
      </div>
    </div>

    <main>
      <nav>
        <div
          v-for="(item, index) in stepData"
          :key="index"
          class="step"
          :class="{
            finish: item.status === '完成',
            ing: item.status === '进行中',
            active: step === index + 1,
          }"
        >
          <span class="txt">{{ item.txt }}</span>
          <span class="cyc"></span>
          <span class="archive" v-if="allData[item.key + 'Archive']">{{
            allData[item.key + 'Archive']
          }}</span>
        </div>
      </nav>

      <article class="scroll-bar">
        <div class="title">{{ stepData[step - 1].txt }}</div>
        <div
          v-for="(item, index) in stepData"
          :key="index"
          v-show="step === index + 1"
          class="content"
        >
          <!-- 立项 -->
          <div v-if="item.key === 'initiate'">
            <div class="items">
              <div class="item">
                <label><em>*</em>需求单位</label>
                <input
                  type="text"
                  v-model="allData.initiateBO.org"
                  :disabled="item.lock"
                />
              </div>
              <div class="item">
                <label><em>*</em>支出方式</label>
                <select v-model="allData.initiateBO.type" :disabled="item.lock">
                  <option value="1">成本</option>
                  <option value="2">资本</option>
                </select>
              </div>
              <div class="item">
                <label><em>*</em>立项单位</label>
                <input
                  type="text"
                  v-model="allData.initiateBO.resOrg.org"
                  :disabled="item.lock"
                />
              </div>
              <div class="item">
                <label><em>*</em>责任人</label>
                <input
                  type="text"
                  v-model="allData.initiateBO.resOrg.principal"
                  :disabled="item.lock"
                />
              </div>
              <div class="item">
                <label><em>*</em>联系方式</label>
                <input
                  type="text"
                  v-model="allData.initiateBO.resOrg.tel"
                  :disabled="item.lock"
                />
              </div>
              <div class="item">
                <label><em>*</em>邮箱</label>
                <input
                  type="text"
                  v-model="allData.initiateBO.resOrg.email"
                  :disabled="item.lock"
                />
              </div>
            </div>
          </div>

          <div v-else-if="item.key === 'design'">
            <div class="items">
              <div class="item">
                <label><em>*</em>设计单位</label>
                <input
                  type="text"
                  v-model="allData.designBO.org"
                  :disabled="item.lock"
                />
              </div>
              <div class="item">
                <label><em>*</em>责任人</label>
                <input
                  type="text"
                  v-model="allData.designBO.principal"
                  :disabled="item.lock"
                />
              </div>
              <div class="item">
                <label><em>*</em>联系方式</label>
                <input
                  type="text"
                  v-model="allData.designBO.tel"
                  :disabled="item.lock"
                />
              </div>
              <div class="item">
                <label><em>*</em>邮箱</label>
                <input
                  type="text"
                  v-model="allData.designBO.email"
                  :disabled="item.lock"
                />
              </div>
              <div class="item">
                <label>通信地址</label>
                <input
                  type="text"
                  v-model="allData.designBO.address"
                  :disabled="item.lock"
                />
              </div>
              <div class="item" style="width: 66.6%">
                <label style="width: 15%">变更签证</label>
                <button
                  v-if="allData.designBO.visa.uploadVisible"
                  @click="uploadFile(null, 4)"
                >
                  点击上传附件
                </button>
                <span
                  @click="download(allData.designBO.visa.fileId, false)"
                  class="visa"
                >
                  {{ allData.designBO.visa.name }}
                </span>
              </div>
            </div>
          </div>
          <!-- 建设 -->
          <div v-else-if="item.key === 'construction'">
            <div class="items">
              <div class="item item-w">
                <label><em>*</em>选择项目厂商</label>
                <select
                  v-model="allData.constructionBO.firmId"
                  :disabled="item.lock"
                >
                  <option
                    v-for="(item2, index2) in constructionVendor"
                    :key="index2"
                    :value="item2.id"
                  >
                    {{ item2.name }}
                  </option>
                </select>
              </div>
              <div class="item item-w"></div>
              <div class="item item-w">
                <label><em>*</em>建设单位</label>
                <input
                  type="text"
                  v-model="allData.constructionBO.buildOrg.org"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>责任人</label>
                <input
                  type="text"
                  v-model="allData.constructionBO.buildOrg.principal"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>联系方式</label>
                <input
                  type="text"
                  v-model="allData.constructionBO.buildOrg.tel"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>邮箱</label>
                <input
                  type="text"
                  v-model="allData.constructionBO.buildOrg.email"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>承建单位</label>
                <input
                  type="text"
                  v-model="allData.constructionBO.contractOrg.org"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>责任人</label>
                <input
                  type="text"
                  v-model="allData.constructionBO.contractOrg.principal"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>联系方式</label>
                <input
                  type="text"
                  v-model="allData.constructionBO.contractOrg.tel"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>邮箱</label>
                <input
                  type="text"
                  v-model="allData.constructionBO.contractOrg.email"
                  :disabled="item.lock"
                />
              </div>
            </div>
            <div class="btn">
              <!-- <button @click="initConstruction(true)">
                <svg-icon icon-class="search" />搜索
              </button> -->
              <button
                v-if="constructionTable.importVisible"
                @click="uploadFile(allData.constructionBO, 6)"
              >
                <svg-icon icon-class="import" />导入资产
              </button>
              <button
                v-if="constructionTable.importVisible"
                @click="downloadTem"
              >
                <svg-icon icon-class="down" />下载模板
              </button>
            </div>
            <div class="assets-wrap">
              <baseTable :tableData="constructionTable.deviceList">
                <baseCol prop="serialNumber" label="序号" />
                <baseCol prop="importName" label="导入人" />
                <baseCol prop="deviceName" label="设备名称" />
                <baseCol prop="deviceSort" label="设备类型" />
                <baseCol prop="deviceType" label="设备厂家/型号" />
                <baseCol prop="position" label="机房位置" />
                <baseCol prop="cabinetNumber" label="机柜编号" />
                <baseCol prop="systemVersion" label="操作系统版本" />
                <baseCol prop="midVersion" label="中间件版本" />
                <baseCol prop="dbVersion" label="数据库版本" />
                <baseCol prop="privateAddress" label="私网IP地址" />
                <baseCol prop="dcnAddress" label="DCN网地址" />
                <baseCol prop="publicAddress" label="公网IP地址" />
                <baseCol prop="url" label="URL地址" />
                <baseCol prop="port" label="开放端口" />
                <baseCol prop="remark" label="备注" />
                <baseCol label="操作">
                  <template #button="props">
                    <button
                      v-show="props.row.editVisible"
                      @click="openBuild(props.row)"
                    >
                      编辑
                    </button>
                    <button
                      v-show="props.row.deleteVisible"
                      class="remove"
                      @click="removeBuild(props.row.id)"
                    >
                      删除
                    </button>
                  </template>
                </baseCol>
              </baseTable>
            </div>
            <!-- 基线 -->
            <div class="baseline report-wrap">
              <h5>基线检查报告</h5>
              <button
                v-if="baseLine.startVisble"
                @click="toNewPage(1, row.processId, 1)"
                class="major"
                style="margin-right: 5px"
              >
                初查
              </button>
              <baseTable :tableData="baseLine.reportChildBOS">
                <baseCol prop="assetInfo" label="资产信息" />
                <baseCol label="初查基线检查报告名称">
                  <template #button="props">
                    <span
                      @click="
                        downloadBaseSeepFlaw(props.row.reportBasicBO.path)
                      "
                      class="link"
                    >
                      {{ props.row.reportBasicBO.name }}
                    </span>
                  </template>
                </baseCol>
                <baseCol prop="mediumNum" label="初查基线检查报告信息">
                  <template #button="props">
                    <div v-if="props.row.reportBasicBO.name">
                      <span class="info"
                        ><i>姓名：</i
                        ><i>{{ props.row.reportBasicBO.nickName }}</i>
                      </span>
                      <span class="info"
                        ><i>单位名称：</i
                        ><i>{{ props.row.reportBasicBO.orgName }}</i></span
                      >
                      <span class="info"
                        ><i>联系方式：</i
                        ><i>{{ props.row.reportBasicBO.phone }}</i>
                      </span>
                      <span class="info"
                        ><i>填写时间：</i
                        ><i>{{ props.row.reportBasicBO.uploadTime }}</i></span
                      >
                    </div>
                  </template>
                </baseCol>
                <baseCol prop="highNum" label="复查基线检查报告名称">
                  <template #button="props">
                    <span
                      @click="
                        downloadBaseSeepFlaw(props.row.reviewReportBasicBO.path)
                      "
                      class="link"
                    >
                      {{ props.row.reviewReportBasicBO.name }}
                    </span>
                  </template>
                </baseCol>
                <baseCol prop="highNum" label="复查基线检查报告信息">
                  <template #button="props">
                    <div v-if="props.row.reviewReportBasicBO.name">
                      <span class="info"
                        ><i>姓名：</i
                        ><i>{{ props.row.reviewReportBasicBO.nickName }}</i>
                      </span>
                      <span class="info"
                        ><i>单位名称：</i
                        ><i>{{ props.row.reviewReportBasicBO.orgName }}</i>
                      </span>
                      <span class="info"
                        ><i>联系方式：</i
                        ><i>{{ props.row.reviewReportBasicBO.phone }}</i>
                      </span>
                      <span class="info"
                        ><i>填写时间：</i
                        ><i>{{ props.row.reviewReportBasicBO.uploadTime }}</i>
                      </span>
                    </div>
                  </template>
                </baseCol>
                <baseCol label="操作">
                  <template #button="props">
                    <button
                      v-if="props.row.editVisble"
                      @click="
                        toNewPage(
                          1,
                          row.processId,
                          1,
                          props.row.deviceId,
                          props.row.assetInfo
                        )
                      "
                    >
                      编辑
                    </button>
                    <button
                      v-if="props.row.reviewVisble"
                      @click="
                        toNewPage(
                          1,
                          row.processId,
                          2,
                          props.row.deviceId,
                          props.row.assetInfo
                        )
                      "
                    >
                      复查
                    </button>
                  </template>
                </baseCol>
              </baseTable>
            </div>
            <!-- 渗透 -->
            <div class="report-wrap infiltration">
              <h5>渗透测试报告</h5>
              <button
                v-if="seep.startVisble"
                @click="toNewPage(2, row.processId, 1)"
                class="major"
                style="margin-right: 5px"
              >
                初查
              </button>
              <baseTable :tableData="seep.reportChildBOS">
                <baseCol label="初查渗透测试报告名称">
                  <template #button="props">
                    <span
                      @click="
                        downloadBaseSeepFlaw(props.row.reportBasicBO.path)
                      "
                      class="link"
                    >
                      {{ props.row.reportBasicBO.name }}
                    </span>
                  </template>
                </baseCol>
                <baseCol prop="mediumNum" label="初查渗透测试报告信息">
                  <template #button="props">
                    <div v-if="props.row.reportBasicBO.name">
                      <span class="info"
                        ><i>姓名：</i
                        ><i>{{ props.row.reportBasicBO.nickName }}</i>
                      </span>
                      <span class="info"
                        ><i>单位名称：</i
                        ><i>{{ props.row.reportBasicBO.orgName }}</i>
                      </span>
                      <span class="info"
                        ><i>联系方式：</i
                        ><i>{{ props.row.reportBasicBO.phone }}</i>
                      </span>
                      <span class="info"
                        ><i>填写时间：</i
                        ><i>{{ props.row.reportBasicBO.uploadTime }}</i>
                      </span>
                    </div>
                  </template>
                </baseCol>
                <baseCol prop="highNum" label="复查渗透测试报告名称">
                  <template #button="props">
                    <span
                      @click="
                        downloadBaseSeepFlaw(props.row.reviewReportBasicBO.path)
                      "
                      class="link"
                    >
                      {{ props.row.reviewReportBasicBO.name }}
                    </span>
                  </template>
                </baseCol>
                <baseCol prop="highNum" label="复查渗透测试报告信息">
                  <template #button="props">
                    <div v-if="props.row.reviewReportBasicBO.name">
                      <span class="info"
                        ><i>姓名：</i
                        ><i>{{ props.row.reviewReportBasicBO.nickName }}</i>
                      </span>
                      <span class="info"
                        ><i>单位名称：</i
                        ><i>{{ props.row.reviewReportBasicBO.orgName }}</i>
                      </span>
                      <span class="info"
                        ><i>联系方式：</i
                        ><i>{{ props.row.reviewReportBasicBO.phone }}</i>
                      </span>
                      <span class="info"
                        ><i>填写时间：</i
                        ><i>{{ props.row.reviewReportBasicBO.uploadTime }}</i>
                      </span>
                    </div>
                  </template>
                </baseCol>
                <baseCol label="操作">
                  <template #button="props">
                    <button
                      v-if="props.row.editVisble"
                      @click="
                        toNewPage(2, row.processId, 1, props.row.deviceId)
                      "
                    >
                      编辑
                    </button>
                    <button
                      v-if="props.row.reviewVisble"
                      @click="
                        toNewPage(2, row.processId, 2, props.row.deviceId)
                      "
                    >
                      复查
                    </button>
                  </template>
                </baseCol>
              </baseTable>
            </div>
            <!-- 漏洞通过 -->
            <div class="report-wrap loophole">
              <h5>漏洞扫描报告</h5>
              <button
                v-if="FlawTable.uploadVisible"
                @click="toNewPage(3, row.processId)"
                class="major"
              >
                上传
              </button>
              <button
                v-if="FlawTable.attachmentVisible"
                @click="toNewPage(4, row.processId)"
                class="major"
              >
                上传整改说明附件
              </button>
              <button
                v-if="FlawTable.passVisible"
                @click="passFlaw(allData[nowKey + 'BO'].processId)"
                class="major"
              >
                通过
              </button>
              <baseTable :tableData="FlawTable.flawList">
                <baseCol prop="fileName" label="漏洞文件名">
                  <template #button="props">
                    <span @click="downloadFlaw(props.row.fileId)" class="link">
                      {{ props.row.fileName }}</span
                    >
                  </template>
                </baseCol>
                <baseCol prop="fileSize" label="文件大小" />
                <baseCol prop="highNum" label="高危数量" />
                <baseCol prop="mediumNum" label="中危数量" />
                <baseCol prop="personName" label="上传人" />
                <baseCol prop="orgName" label="单位名称" />
                <baseCol prop="tel" label="联系方式" />
                <baseCol prop="uploadTime" label="上传时间" />
                <baseCol label="操作">
                  <template #button="props">
                    <button
                      v-show="props.row.downloadVisible"
                      @click="
                        toNewPage(5, null, null, null, null, props.row.fileId)
                      "
                    >
                      查看
                    </button>
                    <button
                      v-show="props.row.downloadVisible"
                      @click="downloadFlaw(props.row.fileId)"
                    >
                      下载
                    </button>
                    <button
                      v-show="props.row.reviewVisible"
                      @click="review(props.row.fileId)"
                    >
                      申请复评
                    </button>
                    <button
                      v-show="props.row.deleteVisible"
                      class="remove"
                      @click="removeFlawFile(props.row.fileId)"
                    >
                      删除
                    </button>
                  </template>
                </baseCol>
              </baseTable>
              <baseTable :tableData="FlawTable.attachmentList">
                <baseCol prop="fileName" label="漏洞整改说明附件">
                  <template #button="props">
                    <span @click="downloadFlaw(props.row.fileId)" class="link">
                      {{ props.row.fileName }}</span
                    >
                  </template>
                </baseCol>
                <baseCol prop="fileSize" label="文件大小" />
                <baseCol prop="personName" label="上传人" />
                <baseCol prop="orgName" label="单位名称" />
                <baseCol prop="tel" label="联系方式" />
                <baseCol prop="uploadTime" label="上传时间" />
                <baseCol label="操作">
                  <template #button="props">
                    <button
                      v-show="props.row.deleteVisible"
                      class="remove"
                      @click="removeFlawFile(props.row.fileId)"
                    >
                      删除
                    </button>
                  </template>
                </baseCol>
              </baseTable>
            </div>
          </div>
          <!-- 验收 -->
          <div v-else-if="item.key === 'accept'">
            <div class="items">
              <div class="item item-w">
                <label><em>*</em>建设单位</label>
                <input
                  type="text"
                  v-model="allData.acceptBO.buildOrg.org"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>责任人</label>
                <input
                  type="text"
                  v-model="allData.acceptBO.buildOrg.principal"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>联系方式</label>
                <input
                  type="text"
                  v-model="allData.acceptBO.buildOrg.tel"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>邮箱</label>
                <input
                  type="text"
                  v-model="allData.acceptBO.buildOrg.email"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>承建单位</label>
                <input
                  type="text"
                  v-model="allData.acceptBO.contractOrg.org"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>责任人</label>
                <input
                  type="text"
                  v-model="allData.acceptBO.contractOrg.principal"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>联系方式</label>
                <input
                  type="text"
                  v-model="allData.acceptBO.contractOrg.tel"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>邮箱</label>
                <input
                  type="text"
                  v-model="allData.acceptBO.contractOrg.email"
                  :disabled="item.lock"
                />
              </div>
              <div class="item" style="width: 97%; margin-bottom: 5px">
                <label style="width: 11.8%; margin-right: 1%">
                  <em>*</em>验收结论
                </label>
                <textarea
                  v-model="allData.acceptBO.summary"
                  rows="8"
                  :disabled="item.lock"
                ></textarea>
              </div>
            </div>
          </div>
          <!-- 转维 -->
          <div v-else-if="item.key === 'maintain'">
            <div class="items">
              <div class="item item-w">
                <label><em>*</em>维护单位</label>
                <input
                  type="text"
                  v-model="allData.maintainBO.maintainOrg.org"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>责任人</label>
                <input
                  type="text"
                  v-model="allData.maintainBO.maintainOrg.principal"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>联系方式</label>
                <input
                  type="text"
                  v-model="allData.maintainBO.maintainOrg.tel"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>邮箱</label>
                <input
                  type="text"
                  v-model="allData.maintainBO.maintainOrg.email"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>第三方维护商</label>
                <input
                  type="text"
                  v-model="allData.maintainBO.maintainTrader.org"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>责任人</label>
                <input
                  type="text"
                  v-model="allData.maintainBO.maintainTrader.principal"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>联系方式</label>
                <input
                  type="text"
                  v-model="allData.maintainBO.maintainTrader.tel"
                  :disabled="item.lock"
                />
              </div>
              <div class="item item-w">
                <label><em>*</em>邮箱</label>
                <input
                  type="text"
                  v-model="allData.maintainBO.maintainTrader.email"
                  :disabled="item.lock"
                />
              </div>
            </div>
            <h4>IP地址</h4>
            {{ allData.maintainBO.ipList.join('，') }}
            <h4>
              <input type="checkbox" v-model="allData.maintainBO.isSaveTable" />
              系统平台第三方使用管理情况统计表
            </h4>
            <div
              v-if="allData.maintainBO.isSaveTable"
              class="report-wrap baseline"
            >
              <br />
              <baseForm class="big-label">
                <baseFormItem label="系统/平台名称" required>
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.platformName"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem
                  label="系统/平台主管单位名称（账号管理单位）"
                  required
                >
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.supervisorOrgName"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem
                  label="系统/平台运营单位名称（运行维护单位）"
                  required
                >
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.maintainOrgName"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem
                  label="系统/平台内存储或可查询用户个人信息或重要信息类型"
                  required
                >
                  <label>
                    <input
                      type="checkbox"
                      v-model="allData.maintainBO.table.infoTypeList"
                      :value="1"
                      :disabled="item.lock"
                    />
                    身份信息
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      v-model="allData.maintainBO.table.infoTypeList"
                      :value="2"
                      :disabled="item.lock"
                    />
                    业务/合作信息
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      v-model="allData.maintainBO.table.infoTypeList"
                      :value="3"
                      :disabled="item.lock"
                    />
                    通信信息
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      v-model="allData.maintainBO.table.infoTypeList"
                      :value="4"
                      :disabled="item.lock"
                    />
                    消费信息
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      v-model="allData.maintainBO.table.infoTypeList"
                      :value="5"
                      :disabled="item.lock"
                    />
                    用户账号密码信息
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      v-model="allData.maintainBO.table.infoTypeList"
                      :value="0"
                      :disabled="item.lock"
                    />
                    其它
                  </label>
                </baseFormItem>
                <baseFormItem
                  label="系统/平台内存储或可查询用户个人信息最高等级"
                  required
                >
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.infoLevel"
                      :value="1"
                      :disabled="item.lock"
                    />
                    1
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.infoLevel"
                      :value="2"
                      :disabled="item.lock"
                    />
                    2
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.infoLevel"
                      :value="3"
                      :disabled="item.lock"
                    />
                    3
                  </label>
                </baseFormItem>
                <baseFormItem label="系统/平台影响范围" required>
                  <baseCascader
                    v-model="allData.maintainBO.table.cityId"
                    :data="cityData"
                    :childrenName="'cityBOList'"
                    label="name"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem label="系统/平台账号实名制管理" required>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.realName"
                      :value="2"
                      :disabled="item.lock"
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.realName"
                      :value="1"
                      :disabled="item.lock"
                    />
                    否
                  </label>
                </baseFormItem>
                <baseFormItem label="系统/平台登陆日志保存时间(月)" required>
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.loginRecord"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem label="系统/平台操作日志保存时间(月)" required>
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.operateRecord"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem label="系统/平台默认口令复杂度" required>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.complexity"
                      :value="1"
                      :disabled="item.lock"
                    />
                    1级
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.complexity"
                      :value="2"
                      :disabled="item.lock"
                    />
                    2级
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.complexity"
                      :value="3"
                      :disabled="item.lock"
                    />
                    3级
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.complexity"
                      :value="4"
                      :disabled="item.lock"
                    />
                    4级
                  </label>
                </baseFormItem>
                <baseFormItem label="系统/平台默认口令有效期(天)" required>
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.expiration"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem label="定期审计账号/操作周期(月)" required>
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.auditCycle"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem
                  label="系统/平台是否开设了第三方账号（包括把内部账号授予第三方使用）"
                  required
                >
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.thirdAccount"
                      :value="2"
                      :disabled="item.lock"
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.thirdAccount"
                      :value="1"
                      :disabled="item.lock"
                    />
                    否
                  </label>
                </baseFormItem>
                <baseFormItem
                  label="有无决定引入第三方的程序和决策审核流程"
                  required
                >
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.useThird"
                      :value="2"
                      :disabled="item.lock"
                    />
                    有
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.useThird"
                      :value="1"
                      @change="allData.maintainBO.table.policyPersonName = ''"
                      :disabled="item.lock"
                    />
                    无
                  </label>
                </baseFormItem>
                <baseFormItem
                  v-show="allData.maintainBO.table.useThird === 2"
                  label="决定引入第三方的程序和决策审核流程具体决策人"
                  required
                >
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.policyPersonName"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem
                  label="有分配、授权第三方人员使用系统/平台账号相关审批管理规定"
                  required
                >
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.regulation"
                      :value="2"
                      :disabled="item.lock"
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.regulation"
                      :value="1"
                      :disabled="item.lock"
                    />
                    否
                  </label>
                </baseFormItem>
                <baseFormItem
                  label="第三方账号是否具有批量信息导出权限"
                  required
                >
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.export"
                      :value="2"
                      :disabled="item.lock"
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.export"
                      :value="1"
                      :disabled="item.lock"
                    />
                    否
                  </label>
                </baseFormItem>
                <baseFormItem
                  label="第三方账号是否有系统/平台关闭、重启权限"
                  required
                >
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.reboot"
                      :value="2"
                      :disabled="item.lock"
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.reboot"
                      :value="1"
                      :disabled="item.lock"
                    />
                    否
                  </label>
                </baseFormItem>
                <baseFormItem
                  label="第三方账号权限是否可查看用户个人信息及重要信息"
                  required
                >
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.importantInfo"
                      :value="2"
                      :disabled="item.lock"
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.importantInfo"
                      :value="1"
                      :disabled="item.lock"
                    />
                    否
                  </label>
                </baseFormItem>
                <baseFormItem label="第三方单位名称" required>
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.thirdOrgName"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem label="第三方项目类型" required>
                  <select
                    v-model="allData.maintainBO.table.projectType"
                    :disabled="item.lock"
                  >
                    <option :value="1">系统/平台集成</option>
                    <option :value="2">外包、代维、维保、业务合作</option>
                    <option :value="3">技术支撑、赠送</option>
                  </select>
                </baseFormItem>
                <baseFormItem label="第三方项目来源方式" required>
                  <select
                    v-model="allData.maintainBO.table.sourceType"
                    :disabled="item.lock"
                  >
                    <option :value="0">其它</option>
                    <option :value="1">招标</option>
                    <option :value="2">比选</option>
                    <option :value="3">定向谈判</option>
                    <option :value="4">免费服务</option>
                  </select>
                </baseFormItem>
                <baseFormItem label="第三方人员数量" required>
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.thirdNumber"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem label="第三方人员参与模式" required>
                  <label>
                    <input
                      type="checkbox"
                      v-model="allData.maintainBO.table.modeList"
                      :value="1"
                      :disabled="item.lock"
                    />
                    现场
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      v-model="allData.maintainBO.table.modeList"
                      :value="2"
                      :disabled="item.lock"
                    />
                    远程
                  </label>
                </baseFormItem>
                <baseFormItem label="第三方合同中明确网信安职责" required>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.respon"
                      :value="2"
                      :disabled="item.lock"
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.respon"
                      :value="1"
                      :disabled="item.lock"
                    />
                    否
                  </label>
                </baseFormItem>
                <baseFormItem label="是否明确第三方违约责任/罚则" required>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.penalty"
                      :value="2"
                      :disabled="item.lock"
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.penalty"
                      :value="1"
                      :disabled="item.lock"
                    />
                    否
                  </label>
                </baseFormItem>
                <baseFormItem label="第三方人员全部签订安全及保密协议" required>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.protocol"
                      :value="2"
                      :disabled="item.lock"
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model="allData.maintainBO.table.protocol"
                      :value="1"
                      :disabled="item.lock"
                    />
                    否
                  </label>
                </baseFormItem>
                <baseFormItem
                  v-if="allData.maintainBO.table.protocol === 2"
                  label="附件"
                  required
                >
                  <button
                    type="button"
                    @click="
                      uploadFile(
                        {
                          processId: allData.maintainBO.processId,
                          schedule: allData.maintainBO.schedule,
                        },
                        8
                      )
                    "
                    :disabled="item.lock"
                    style="margin: 0 10px 0 0"
                  >
                    上传文件
                  </button>
                  <span
                    @click="
                      download(
                        allData.maintainBO.table.protocolFileBO.fileId,
                        false
                      )
                    "
                    class="link"
                    style="margin: 0"
                    >{{
                      allData.maintainBO.table.protocolFileBO.fileName
                    }}</span
                  >
                </baseFormItem>
                <baseFormItem
                  label="定期检查第三方网络安全责任落实情况周期(月)"
                  required
                >
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.checkCycle"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem label="第三方网信安措施效果评估周期(月)" required>
                  <input
                    type="text"
                    v-model="allData.maintainBO.table.evaluateCycle"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem label="第三方网信安措施效果评估结果 " required>
                  <textarea
                    rows="5"
                    v-model="allData.maintainBO.table.evaluateResult"
                    :disabled="item.lock"
                  />
                </baseFormItem>
                <baseFormItem label="备注" required>
                  <textarea
                    rows="5"
                    v-model="allData.maintainBO.table.remark"
                    :disabled="item.lock"
                  />
                </baseFormItem>
              </baseForm>
            </div>
          </div>
        </div>

        <h4>会议记要</h4>
        <button
          v-show="allData[nowKey + 'BO'].archiveVisible"
          :disabled="stepData[step - 1].lock"
          @click="openMettingDialog('新增会议记要')"
          class="major"
        >
          新增会议记要
        </button>
        <baseTable :tableData="allData[nowKey + 'BO'].conferenceBOList">
          <baseCol prop="conferenceName" label="会议名称" />
          <baseCol prop="fileName" label="会议文件">
            <template #button="props">
              <span @click="download(props.row.fileId, false)" class="link">
                {{ props.row.fileName }}
              </span>
            </template>
          </baseCol>
          <baseCol prop="status" label="评审状态">
            <template #button="props">
              {{ props.row.status | statusFilter }}
            </template>
          </baseCol>
          <baseCol prop="hostName" label="主持人员" />
          <baseCol prop="dept" label="参会部门" />
          <baseCol prop="person" label="参会人员" />
          <baseCol prop="conferenceTime" label="会议日期" />
          <baseCol prop="createPersonName" label="上传人" />
          <baseCol prop="updateTime" label="上传时间" />
          <baseCol label="操作">
            <template #button="props">
              <button
                v-if="props.row.editVisible"
                @click="openMettingDialog('编辑会议记要', props.row)"
                :disabled="stepData[step - 1].lock"
              >
                修改
              </button>
              <button
                v-if="props.row.examineVisible"
                @click="openExamine(props.row, true)"
              >
                评审
              </button>
              <button
                v-if="props.row.deleteVisible"
                class="remove"
                @click="removeMeeting(props.row)"
                :disabled="stepData[step - 1].lock"
              >
                删除
              </button>
            </template>
          </baseCol>
        </baseTable>

        <template v-if="allData[nowKey + 'BO'].fileBOList">
          <h4>相关文件</h4>
          <baseTable :tableData="allData[nowKey + 'BO'].fileBOList">
            <baseCol prop="type" label="类型" />
            <baseCol prop="name" label="附件名">
              <template #button="props">
                <span @click="download(props.row.fileId, false)" class="link">
                  {{ props.row.name }}
                </span>
              </template>
            </baseCol>
            <baseCol prop="size" label="文件大小" />
            <baseCol prop="status" label="评审状态">
              <template #button="props">
                {{ props.row.status | statusFilter }}
              </template>
            </baseCol>
            <baseCol prop="examineName" label="评审人" />
            <baseCol prop="uploadName" label="上传人" />
            <baseCol prop="uploadTime" label="上传时间" />
            <baseCol label="操作">
              <template #button="props">
                <button
                  v-show="props.row.uploadVisible"
                  @click="uploadFile(props.row, 1)"
                >
                  上传
                </button>
                <button
                  v-show="props.row.examineVisible"
                  @click="openExamine(props.row)"
                >
                  评审
                </button>
                <button
                  v-show="props.row.deleteVisible"
                  class="remove"
                  @click="removeFile(props.row.fileId)"
                >
                  删除文档
                </button>
              </template>
            </baseCol>
          </baseTable>
        </template>
        <template v-else>
          <h4>初验相关文件</h4>
          <baseTable :tableData="allData[nowKey + 'BO'].firstFileBOList">
            <baseCol prop="type" label="类型" />
            <baseCol prop="name" label="附件名">
              <template #button="props">
                <span @click="download(props.row.fileId, false)" class="link">
                  {{ props.row.name }}
                </span>
              </template>
            </baseCol>
            <baseCol prop="size" label="文件大小" />
            <baseCol prop="status" label="评审状态">
              <template #button="props">
                {{ props.row.status | statusFilter }}
              </template>
            </baseCol>
            <baseCol prop="examineName" label="评审人" />
            <baseCol prop="uploadName" label="上传人" />
            <baseCol prop="uploadTime" label="上传时间" />
            <baseCol label="操作">
              <template #button="props">
                <button
                  v-show="props.row.uploadVisible"
                  @click="uploadFile(props.row, 1)"
                >
                  上传
                </button>
                <button
                  v-show="props.row.examineVisible"
                  @click="openExamine(props.row)"
                >
                  评审
                </button>
                <button
                  v-show="props.row.deleteVisible"
                  class="remove"
                  @click="removeFile(props.row.fileId)"
                >
                  删除文档
                </button>
              </template>
            </baseCol>
          </baseTable>
          <h4>终验相关文件</h4>
          <baseTable :tableData="allData[nowKey + 'BO'].finalFileBOList">
            <baseCol prop="type" label="类型" />
            <baseCol prop="name" label="附件名">
              <template #button="props">
                <span @click="download(props.row.fileId, false)" class="link">
                  {{ props.row.name }}
                </span>
              </template>
            </baseCol>
            <baseCol prop="size" label="文件大小" />
            <baseCol prop="status" label="评审状态">
              <template #button="props">
                {{ props.row.status | statusFilter }}
              </template>
            </baseCol>
            <baseCol prop="examineName" label="评审人" />
            <baseCol prop="uploadName" label="上传人" />
            <baseCol prop="uploadTime" label="上传时间" />
            <baseCol label="操作">
              <template #button="props">
                <button
                  v-show="props.row.uploadVisible"
                  @click="uploadFile(props.row, 1)"
                >
                  上传
                </button>
                <button
                  v-show="props.row.examineVisible"
                  @click="openExamine(props.row)"
                >
                  评审
                </button>
                <button
                  v-show="props.row.deleteVisible"
                  class="remove"
                  @click="removeFile(props.row.fileId)"
                >
                  删除文档
                </button>
              </template>
            </baseCol>
          </baseTable>
        </template>
      </article>
    </main>

    <!-- 上传文件input -->
    <input type="file" ref="flowFile" @change="upload($event)" />

    <footer>
      <span><em>*</em>归档后当前节点内容不再编辑</span>
      <div>
        <button v-show="step > 1" @click="cutStep">
          <svg-icon icon-class="previous" />上一步
        </button>
        <button v-show="step < stepData.length" @click="addStep">
          <svg-icon icon-class="next" />下一步
        </button>
        <button
          v-show="stepData[step - 1].lock && allData[nowKey + 'BO'].editVisible"
          @click="edit"
        >
          <svg-icon icon-class="edit" />编辑
        </button>
        <button
          v-show="
            !stepData[step - 1].lock && allData[nowKey + 'BO'].saveVisible
          "
          @click="save"
        >
          <svg-icon icon-class="save" />保存
        </button>
        <button v-show="allData[nowKey + 'BO'].archiveVisible" @click="finish">
          <svg-icon icon-class="sure" />归档
        </button>
        <button
          v-if="step === 3 && allData.constructionBO.evaluatVisible"
          @click="openDialogReckon"
        >
          安全评估
        </button>
      </div>
    </footer>

    <!-- 评审弹出框 -->
    <baseDialog :visible.sync="examineDialog">
      <template #title>项目评审</template>
      <div v-if="rowInfo.examineEnable" class="btn">
        <button @click="examineFileDialog = true">
          <svg-icon icon-class="add" />新增评审
        </button>
        <button @click="passExamine">
          <svg-icon icon-class="sure" />确认通过
        </button>
      </div>
      <baseTable :tableData="examineTabelData">
        <baseCol prop="examineFileName" label="评审文件">
          <template #button="props">
            <span @click="download(props.row.id, true)" class="link">
              {{ props.row.examineFileName }}
            </span>
          </template>
        </baseCol>
        <baseCol prop="examineSummary" label="评审结论" />
        <baseCol prop="examinePerson" label="评审人" />
        <baseCol prop="createTime" label="评审时间" />
      </baseTable>
      <br />
    </baseDialog>
    <!-- 新增评审文件 -->
    <baseDialog
      :visible.sync="examineFileDialog"
      class="examine-file"
      @closed="closedExamineFileDialog"
    >
      <template #title>新增评审</template>
      <div class="review-item">
        <label><em>*</em>评审报告</label>
        <button @click="uploadFile(null, 2)" style="margin-right: 5px">
          点击上传评审报告
        </button>
        {{ rowInfo.examineFileName }}
      </div>
      <div class="review-item">
        <label><em>*</em>评审建议</label>
        <textarea
          v-model="examineSummary"
          rows="5"
          placeholder="请填写评审建议"
        ></textarea>
      </div>
      <div class="review-btn">
        <button @click="addExamine">
          <svg-icon icon-class="edit" />提交建议
        </button>
      </div>
    </baseDialog>
    <!-- 会议记要弹出框 -->
    <baseDialog :visible.sync="meetingDialog" @closed="closedMeeting">
      <template #title>{{ meetingDialogTitle }}</template>
      <baseForm ref="mettingForm" :form="meetingForm" :rules="meetingRules">
        <baseFormItem label="会议名称" prop="conferenceName" required>
          <input type="text" v-model="meetingForm.conferenceName" />
        </baseFormItem>
        <baseFormItem label="主持人员" prop="hostName" required>
          <input type="text" v-model="meetingForm.hostName" />
        </baseFormItem>
        <baseFormItem label="会议时间" prop="conferenceTime" required>
          <input type="date" v-model="meetingForm.conferenceTime" />
        </baseFormItem>
        <baseFormItem label="参会部门" prop="orgId" required>
          <label v-for="(item, index) in meetingDepartment" :key="index">
            <input
              type="checkbox"
              v-model="meetingForm.orgId"
              :id="item.id"
              :value="item.id"
            />
            {{ item.orgName }}
          </label>
        </baseFormItem>

        <baseFormItem label="参会人员" prop="perString" required>
          <textarea rows="5" v-model="meetingForm.perString"></textarea>
          <div style="color: #ff4949">*以顿号(、)进行分隔</div>
        </baseFormItem>
        <baseFormItem label="会议文件" prop="fileName" required>
          <button type="button" @click="uploadFile(allData[nowKey + 'BO'], 3)">
            点击上传
          </button>
          {{ meetingForm.fileName }}
        </baseFormItem>
        <button type="button" @click="saveMeeting">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
    <!-- 建设流程中编辑的弹出框 -->
    <baseDialog :visible.sync="buildDialog">
      <template #title>编辑</template>
      <baseForm ref="flowBuildForm" :form="buildForm" :rules="buildRules">
        <baseFormItem label="序号">
          <input type="text" v-model="buildForm.serialNumber" />
        </baseFormItem>
        <baseFormItem label="设备名称" prop="deviceName" required>
          <input type="text" v-model="buildForm.deviceName" />
        </baseFormItem>
        <baseFormItem label="设备类型" prop="deviceSort" required>
          <select v-model="buildForm.deviceSort">
            <option value="服务器">服务器</option>
            <option value="网络设备">网络设备</option>
            <option value="安全设备">安全设备</option>
            <option value="web应用系统">web应用系统</option>
            <option value="其他">其他</option>
          </select>
        </baseFormItem>
        <baseFormItem label="设备厂家/型号">
          <input type="text" v-model="buildForm.deviceType" />
        </baseFormItem>
        <baseFormItem label="机房位置">
          <input type="text" v-model="buildForm.position" />
        </baseFormItem>
        <baseFormItem label="机柜编号">
          <input type="text" v-model="buildForm.cabinetNumber" />
        </baseFormItem>
        <baseFormItem
          v-if="buildForm.deviceSort === '服务器'"
          key="systemVersion1"
          label="操作系统版本"
          prop="systemVersion"
          required
        >
          <input type="text" v-model="buildForm.systemVersion" />
        </baseFormItem>
        <baseFormItem v-else key="systemVersion2" label="操作系统版本">
          <input type="text" v-model="buildForm.systemVersion" />
        </baseFormItem>
        <baseFormItem label="中间件版本">
          <input type="text" v-model="buildForm.midVersion" />
        </baseFormItem>
        <baseFormItem label="数据库版本">
          <input type="text" v-model="buildForm.dbVersion" />
        </baseFormItem>
        <baseFormItem label="私网IP地址">
          <input type="text" v-model="buildForm.privateAddress" disabled />
        </baseFormItem>
        <baseFormItem label="DCN网地址">
          <input type="text" v-model="buildForm.dcnAddress" disabled />
        </baseFormItem>
        <baseFormItem label="公网IP地址">
          <input type="text" v-model="buildForm.publicAddress" disabled />
        </baseFormItem>
        <baseFormItem label="应用WEB URL地址">
          <input type="text" v-model="buildForm.url" />
        </baseFormItem>
        <baseFormItem label="端口">
          <input type="text" v-model="buildForm.port" />
        </baseFormItem>
        <baseFormItem label="备注">
          <input type="text" v-model="buildForm.remark" />
        </baseFormItem>
        <button type="button" @click="buildSave">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
    <!-- 安全评估 -->
    <baseDialog :visible.sync="dialogReckon" top="0" width="80%">
      <template #title>工程项目概况</template>
      <baseForm
        ref="reckonForm"
        :form="reckonForm"
        :rules="reckonRules"
        class="reckon-form"
      >
        <div class="piece">
          <b>归属的网络单元名称</b>
          <div
            v-for="(item, index) in reckonForm.netItemBOList"
            :key="index"
            class="reckon-on-row"
          >
            <baseFormItem
              label="网络单元名称"
              :prop="'netItemBOList.' + index + '.systemName'"
              :rule="[
                {
                  required: true,
                  message: '请输入网络单元名称',
                  trigger: 'blur',
                },
              ]"
              required
            >
              <input
                type="text"
                v-model="reckonForm.netItemBOList[index].systemName"
              />
            </baseFormItem>
            <baseFormItem
              label="安全保护等级标准"
              :prop="'netItemBOList.' + index + '.level'"
              :rule="[
                {
                  required: true,
                  message: '请选择安全保护等级标准',
                  trigger: 'change',
                },
              ]"
              required
            >
              <select v-model="reckonForm.netItemBOList[index].level">
                <option
                  v-for="(item, index) in enumList['安全保护等级标准']"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
            </baseFormItem>
            <svg-icon
              v-if="reckonForm.netItemBOList.length > 1"
              icon-class="close"
              @click="removeList('netItemBOList', index)"
            />
          </div>
          <button
            type="button"
            @click="addList('netItemBOList', { systemName: '', level: '' })"
            style="margin-left: 12%"
          >
            新增
          </button>
        </div>
        <div class="piece pan">
          <baseFormItem label="网络/系统类型" prop="type" required>
            <select v-model="reckonForm.type">
              <option
                v-for="(item, index) in enumList['网络/系统类型']"
                :key="index"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </baseFormItem>
        </div>
        <div class="piece pan">
          <b>受评估项目建设情况</b>
          <baseFormItem label="主体建设规模" prop="mainScale" required>
            <textarea
              cols="30"
              rows="5"
              v-model="reckonForm.mainScale"
            ></textarea>
          </baseFormItem>
          <baseFormItem label="网络安全配套建设规模" prop="netScale" required>
            <textarea
              cols="30"
              rows="5"
              v-model="reckonForm.netScale"
            ></textarea>
          </baseFormItem>
        </div>
        <div class="piece reckon-on-row">
          <b>工程建设部门</b>
          <baseFormItem
            label="部门名称"
            :prop="'buildOrg.orgName'"
            :rule="[
              {
                required: true,
                message: '请输入部门名称',
                trigger: 'blur',
              },
            ]"
            required
          >
            <input type="text" v-model="reckonForm.buildOrg.orgName" />
          </baseFormItem>
          <baseFormItem
            label="项目负责人"
            :prop="'buildOrg.personName'"
            :rule="[
              {
                required: true,
                message: '请输入项目负责人',
                trigger: 'blur',
              },
            ]"
            required
          >
            <input type="text" v-model="reckonForm.buildOrg.personName" />
          </baseFormItem>
          <baseFormItem label="通信地址">
            <input type="text" v-model="reckonForm.buildOrg.address" />
          </baseFormItem>
          <baseFormItem
            label="联系电话"
            :prop="'buildOrg.tel'"
            :rule="[
              {
                required: true,
                message: '请输入联系电话',
                trigger: 'blur',
              },
            ]"
            required
          >
            <input type="text" v-model="reckonForm.buildOrg.tel" />
          </baseFormItem>
          <baseFormItem label="电子邮件">
            <input type="text" v-model="reckonForm.buildOrg.email" />
          </baseFormItem>
        </div>
        <div class="piece reckon-on-row">
          <b>工程服务单位</b>
          <baseFormItem
            label="部门名称"
            :prop="'serviceOrg.orgName'"
            :rule="[
              {
                required: true,
                message: '请输入部门名称',
                trigger: 'blur',
              },
            ]"
            required
          >
            <input type="text" v-model="reckonForm.serviceOrg.orgName" />
          </baseFormItem>
          <baseFormItem
            label="项目负责人"
            :prop="'serviceOrg.personName'"
            :rule="[
              {
                required: true,
                message: '请输入项目负责人',
                trigger: 'blur',
              },
            ]"
            required
          >
            <input type="text" v-model="reckonForm.serviceOrg.personName" />
          </baseFormItem>
          <baseFormItem label="通信地址">
            <input type="text" v-model="reckonForm.serviceOrg.address" />
          </baseFormItem>
          <baseFormItem
            label="联系电话"
            :prop="'serviceOrg.tel'"
            :rule="[
              {
                required: true,
                message: '请输入联系电话',
                trigger: 'blur',
              },
            ]"
            required
          >
            <input type="text" v-model="reckonForm.serviceOrg.tel" />
          </baseFormItem>
          <baseFormItem label="电子邮件">
            <input type="text" v-model="reckonForm.serviceOrg.email" />
          </baseFormItem>
        </div>
        <div class="piece">
          <b>评估单位基本情况</b>
          <div
            v-for="(item, index) in reckonForm.personBOList"
            :key="index"
            class="reckon-on-row"
          >
            <baseFormItem
              label="姓名"
              :prop="'personBOList.' + index + '.name'"
              :rule="[
                {
                  required: true,
                  message: '请输入姓名',
                  trigger: 'blur',
                },
              ]"
              required
            >
              <input
                type="text"
                v-model="reckonForm.personBOList[index].name"
              />
            </baseFormItem>
            <baseFormItem
              label="职务(岗位)"
              :prop="'personBOList.' + index + '.post'"
              :rule="[
                {
                  required: true,
                  message: '请输入职务(岗位)',
                  trigger: 'blur',
                },
              ]"
              required
            >
              <input
                type="text"
                v-model="reckonForm.personBOList[index].post"
              />
            </baseFormItem>
            <svg-icon
              v-if="reckonForm.personBOList.length > 1"
              icon-class="close"
              @click="removeList('personBOList', index)"
            />
          </div>
          <button
            type="button"
            @click="addList('personBOList', { name: '', post: '' })"
            style="margin-left: 12%"
          >
            新增
          </button>
        </div>
        <div class="piece reckon-on-row">
          <b>系统日志安全检查</b>
          <baseFormItem label="日志是否完善" prop="logState" required>
            <label>
              <input type="radio" v-model="reckonForm.logState" value="是" />
              是
            </label>
            <label>
              <input type="radio" v-model="reckonForm.logState" value="否" />
              否
            </label>
          </baseFormItem>
        </div>
        <div class="piece reckon-on-row">
          <b>账号安全检查情况</b>
          <baseFormItem label="弱口令账号数" prop="psdNumber" required>
            <input type="text" v-model="reckonForm.psdNumber" />
          </baseFormItem>
          <baseFormItem label="无主账号" prop="hostNumber" required>
            <input type="text" v-model="reckonForm.hostNumber" />
          </baseFormItem>
        </div>
        <div class="piece pan">
          <baseFormItem
            label="安全保障设施防护能力评估情况"
            prop="securityState"
            required
          >
            <textarea
              cols="30"
              rows="5"
              v-model="reckonForm.securityState"
            ></textarea>
          </baseFormItem>
        </div>
        <baseFormItem
          label="漏洞扫描情况"
          prop="imgPath"
          required
          style="margin-left: -13.7%; width: 109.7%"
        >
          <button type="button" @click="uploadFile(null, 7)">点击上传</button>
          <span v-if="reckonForm.imgPath">
            {{
              reckonForm.imgPath.slice(reckonForm.imgPath.lastIndexOf('\\') + 1)
            }}
          </span>
        </baseFormItem>
        <button type="button" @click="saveReckon">
          <svg-icon icon-class="save" />保存
        </button>
      </baseForm>
    </baseDialog>
  </div>
</template>

<script>
import {
  getProcessById,
  saveInitiate,
  archiveSchedule,
  saveDesign,
  saveAccept,
  saveMaintain,
  saveConference,
  deleteConference,
  getConferenceById,
  saveConstruction,
  getCity,
} from '@api/process'
import {
  getDeviceList,
  saveDevice,
  deleteDeviceById,
  importDevice,
} from '@api/device'
import {
  getFlawReportList,
  previewFlaw,
  reviewByFileId,
  deleteFlaw,
  passFlawByProcessId,
} from '@api/flawCommon'
import { getBaseOnlineAndPenetration } from '@api/reportCommon'
import {
  uploadFile,
  deleteFile,
  getExamineList,
  saveSuggestion,
  confirm,
  previewFile,
} from '@api/file'
import { preview } from '@api/sftp'
import { getOrgPersonByIds, getProcessOrgNodeTree } from '@api/systemOrgNode'
import { getDictionaryValue } from '@api/dictionary'
import { downloadTemplate } from '@api/template'
import { getFirmManageAll } from '@api/firmManage'
import {
  createReportEvaluation,
  uploadImg,
  getEnumList,
  checkConstruction,
} from '@api/reportEvaluation'
import { orgTree } from '@/assets/mixin/common'

export default {
  name: 'FlowForm',
  mixins: [orgTree],
  filters: {
    statusFilter(val) {
      switch (val) {
        case null:
          return '未审核'
        case 1:
          return '整改中'
        case 2:
          return '通过'
      }
    },
  },
  props: {
    row: {
      type: Object,
    },
  },
  data() {
    const fileNameRule = function (form) {
      if (form.fileName === '') return false
      else return true
    }
    return {
      step: 1,
      stepData: [
        { txt: '', status: '', visible: '', lock: true, key: 'initiate' },
        { txt: '', status: '', visible: '', lock: true, key: 'design' },
        { txt: '', status: '', visible: '', lock: true, key: 'construction' },
        { txt: '', status: '', visible: '', lock: true, key: 'accept' },
        { txt: '', status: '', visible: '', lock: true, key: 'maintain' },
      ],
      allData: {},
      rowInfo: {}, // table当前row的数据
      cityData: {}, // 转维的城市数据
      examineDialog: false,
      examineTabelData: [],
      examineFileDialog: false,
      examineSummary: '', // 评审结论
      constructionData: {}, // 建设流程字典数据
      constructionTable: [], // 建设页面表格数据
      FlawTable: [], // 建设页面漏洞表格数据
      baseLine: [], // 建设页面基线数据
      seep: [], // 建设页面渗透数据
      meetingDialog: false,
      meetingDialogTitle: '',
      meetingForm: {
        processId: '',
        schedule: '',
        conferenceName: '',
        hostName: '',
        conferenceTime: '',
        orgId: [],
        perIds: [],
        perString: '',
        fileId: '',
        fileName: '',
        filePath: '',
        fileSize: '',
      },
      meetingRules: {
        conferenceName: [
          { required: true, message: '请输入会议名称', trigger: 'blur' },
        ],
        hostName: [
          { required: true, message: '请输入主持人员', trigger: 'blur' },
        ],
        conferenceTime: [
          { required: true, message: '请输入会议时间', trigger: 'blur' },
        ],
        orgId: [
          { required: true, message: '请选择参会部门', trigger: 'change' },
        ],
        perString: [
          { required: true, message: '请输入参会人员', trigger: 'blur' },
        ],
        fileName: [{ other: fileNameRule, message: '请上传会议文件' }],
      },
      meetingDepartment: [],
      meetingStaffSearch: '',
      meetingStaff: [],
      buildDialog: false,
      buildForm: {
        id: '',
        processId: '',
        serialNumber: '',
        deviceName: '',
        deviceSort: '',
        deviceType: '',
        position: '',
        cabinetNumber: '',
        systemVersion: '',
        midVersion: '',
        dbVersion: '',
        privateAddress: '',
        dcnAddress: '',
        publicAddress: '',
        url: '',
        port: '',
        remark: '',
      },
      buildRules: {
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
        deviceSort: [
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        systemVersion: [
          { required: true, message: '请输入操作系统版本', trigger: 'change' },
        ],
      },
      dialogReckon: false,
      enumList: {}, // 网络/系统类型，安全保护等级标准
      reckonForm: {
        netItemBOList: [{ systemName: '', level: '' }],
        type: '',
        mainScale: '',
        netScale: '',
        buildOrg: {
          address: '',
          email: '',
          orgName: '',
          personName: '',
          tel: '',
        },
        serviceOrg: {
          address: '',
          email: '',
          orgName: '',
          personName: '',
          tel: '',
        },
        personBOList: [{ name: '', post: '' }],
        psdNumber: '',
        hostNumber: '',
        securityState: '',
        imgPath: '',
      },
      reckonRules: {
        type: [
          { required: true, message: '请输入网络/系统类型', trigger: 'blur' },
        ],
        mainScale: [
          { required: true, message: '请输入主体建设规模', trigger: 'blur' },
        ],
        netScale: [
          {
            required: true,
            message: '请输入网络安全配套建设规模',
            trigger: 'blur',
          },
        ],
        logState: [
          {
            required: true,
            message: '请选择日志是否完善',
            trigger: 'change',
          },
        ],
        psdNumber: [
          {
            required: true,
            message: '请输入弱口令账号数',
            trigger: 'blur',
          },
        ],
        hostNumber: [
          {
            required: true,
            message: '请输入无主账号',
            trigger: 'blur',
          },
        ],
        securityState: [
          {
            required: true,
            message: '请输入安全保障设施防护能力评估情况',
            trigger: 'blur',
          },
        ],
        imgPath: [
          {
            required: true,
            message: '请上传漏洞扫描情况',
            trigger: 'change',
          },
        ],
      },
    }
  },
  computed: {
    // 当前内容在stepData中key值
    nowKey() {
      return this.stepData[this.step - 1].key
    },
    // 当前选中的参会人员
    meetingStaffChecked() {
      return this.meetingStaff.filter((item) =>
        this.meetingForm.perIds.includes(item.id)
      )
    },
  },
  created() {
    document.addEventListener('visibilitychange', this.visibilityFun)
    this.init(true)
    getDictionaryValue().then((res) => {
      this.constructionData = res.data
    })
    // 建设流程数据
    this.initConstruction()
    this.initFlawRepor()
    this.initBaseLineAndSeep(1)
    this.initBaseLineAndSeep(2)
    // 获取所有厂商列表
    getFirmManageAll().then((res) => {
      this.constructionVendor = res.data
    })
    // 获取转维节点影响范围的城市信息
    getCity().then((res) => {
      this.cityData = res.data
    })
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.visibilityFun)
  },
  methods: {
    init(ifSetStep) {
      getProcessById(this.row.processId).then((res) => {
        // 缓存数据
        if (this.allData.initiateBO) {
          let cachData = {
            initiateBO: {
              org: this.allData.initiateBO.org,
              type: this.allData.initiateBO.type,
              resOrg: this.allData.initiateBO.resOrg,
            },
            designBO: {
              org: this.allData.designBO.org,
              principal: this.allData.designBO.principal,
              tel: this.allData.designBO.tel,
              email: this.allData.designBO.email,
              address: this.allData.designBO.address,
            },
            constructionBO: {
              firmId: this.allData.constructionBO.firmId,
              buildOrg: this.allData.constructionBO.buildOrg,
              contractOrg: this.allData.constructionBO.contractOrg,
            },
            acceptBO: {
              buildOrg: this.allData.acceptBO.buildOrg,
              contractOrg: this.allData.acceptBO.contractOrg,
              summary: this.allData.acceptBO.summary,
            },
            maintainBO: {
              maintainOrg: this.allData.maintainBO.maintainOrg,
              maintainTrader: this.allData.maintainBO.maintainTrader,
            },
          }
          this.allData = res.data
          for (const key in cachData) {
            this.allData[key] = Object.assign(
              {},
              this.allData[key],
              cachData[key]
            )
          }
        } else this.allData = res.data
        // 组合数据
        this.stepData.map((item) => {
          item.txt = this.allData[item.key + 'BO'].schedule
          item.visible = this.allData[item.key + 'Visible']
          item.status = this.allData[item.key + 'BO'].status
        })
        // 去除无权限的
        this.stepData = this.stepData.filter((item) => item.visible)
        // 调到进行中的步骤
        if (ifSetStep) {
          this.step =
            parseInt(
              this.stepData
                .map((item, index) => {
                  if (item.status === '进行中') return index
                })
                .join('')
            ) + 1 || 1
        }
      })
    },
    addStep() {
      this.step++
    },
    cutStep() {
      this.step--
    },
    edit() {
      this.stepData[this.step - 1].lock = false
    },
    // 每个流程的保存逻辑
    save() {
      switch (this.stepData[this.step - 1].key) {
        case 'initiate':
          saveInitiate(this.allData.initiateBO).then((res) => {
            this.$message({ content: res.message, type: 'success' })
            this.init()
          })
          break
        case 'design':
          saveDesign(this.allData.designBO).then((res) => {
            this.$message({ content: res.message, type: 'success' })
            this.init()
          })
          break
        case 'construction':
          saveConstruction(this.allData.constructionBO).then((res) => {
            this.$message({ content: res.message, type: 'success' })
            this.init()
          })
          break
        case 'accept':
          saveAccept(this.allData.acceptBO).then((res) => {
            this.$message({ content: res.message, type: 'success' })
            this.init()
          })
          break
        case 'maintain':
          saveMaintain(this.allData.maintainBO).then((res) => {
            this.$message({ content: res.message, type: 'success' })
            this.init()
          })
          break
      }
      this.stepData[this.step - 1].lock = true
    },
    // 归档
    finish() {
      this.$confirm('确认归档？', '提示').then(() => {
        archiveSchedule(
          this.row.processId,
          this.allData[this.nowKey + 'BO'].schedule
        ).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
          // 设计流程归档时刷新
          if (this.step === 2) {
            this.initConstruction()
            this.initFlawRepor()
            this.initBaseLineAndSeep(1)
            this.initBaseLineAndSeep(2)
          }
        })
      })
    },
    // type: 1.相关文件, 2.评审文件, 3.会议文件 4.设计.签证 5.漏洞
    // 6.导入资产
    uploadFile(info, type) {
      if (info) this.rowInfo = JSON.parse(JSON.stringify(info))
      switch (type) {
        case 2:
          this.rowInfo.isExamineFile = true
          break
        case 3:
          this.rowInfo.type = '会议文件'
          break
        case 4:
          this.rowInfo = this.allData.designBO.visa
          break
        case 5:
          this.rowInfo.processId = info.processId
          this.rowInfo.schedule = info.schedule
          this.rowInfo.type = '漏洞扫描报告'
          break
        case 6:
          this.rowInfo.type = '导入资产'
          break
        case 7:
          this.rowInfo.type = '安全评估'
          break
        case 8:
          this.rowInfo.type = '保密协议'
          break
      }
      this.$refs.flowFile.dispatchEvent(new MouseEvent('click'))
    },
    upload(e) {
      if (this.rowInfo.type === '导入资产') {
        let formData = new FormData()
        formData.append('file', e.target.files[0])
        formData.append('processId', this.rowInfo.processId)
        importDevice(formData).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.initConstruction()
          this.initFlawRepor()
          this.initBaseLineAndSeep(1)
          this.initBaseLineAndSeep(2)
        })
      } else if (this.rowInfo.type === '安全评估') {
        let formData = new FormData()
        formData.append('file', e.target.files[0])
        formData.append('processId', this.row.processId)
        uploadImg(formData).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.reckonForm.imgPath = res.data
          this.$refs.reckonForm.validate()
        })
      } else {
        let formData = new FormData()
        formData.append('file', e.target.files[0])
        formData.append('fileId', this.rowInfo.fileId)
        formData.append('processId', this.rowInfo.processId)
        formData.append('schedule', this.rowInfo.schedule)
        formData.append('type', this.rowInfo.type)
        formData.append('isExamineFile', this.rowInfo.isExamineFile || false)
        let temName = e.target.files[0].name
        let temSize = e.target.files[0].size
        uploadFile(formData).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          if (!this.rowInfo.isExamineFile && this.rowInfo.type !== '保密协议')
            this.init()
          else {
            this.rowInfo.examineFilePath = res.data
            this.rowInfo.examineFileName = temName
            this.rowInfo.examineFileSize = temSize
          }
          this.$set(this.rowInfo) // set rowInfo,设定评审后的内容
          // 会议文件
          if (this.rowInfo.type === '会议文件') {
            this.meetingForm.fileName = temName
            this.meetingForm.filePath = res.data
            this.meetingForm.fileSize = temSize
          }
          // 保密协议
          if (this.rowInfo.type === '保密协议') {
            this.allData.maintainBO.table.protocolFileBO.fileName = temName
            this.allData.maintainBO.table.protocolFileBO.filePath = res.data
            this.allData.maintainBO.table.protocolFileBO.fileSize = temSize
          }
        })
      }
      this.$refs.flowFile.value = null
    },
    // 下载文件
    download(id, isExamineFile, ifInit) {
      previewFile(id, isExamineFile).then(() => {
        if (ifInit) this.init()
      })
    },
    // 下载资产模板
    downloadTem() {
      downloadTemplate(2)
    },
    // 下载漏洞文件
    downloadFlaw(fileId) {
      previewFlaw(fileId).then(() => {
        this.initFlawRepor()
      })
    },
    // 基线、渗透
    downloadBaseSeepFlaw(path) {
      preview(path)
    },
    // 删除文件
    removeFile(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteFile(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    // 删除漏洞文件
    removeFlawFile(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteFlaw(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.initFlawRepor()
        })
      })
    },
    // 评审table列表
    openExamine(info) {
      this.rowInfo = info
      getExamineList(info.fileId).then((res) => {
        this.examineTabelData = res.data
        this.examineDialog = true
      })
    },
    // 新增评审
    addExamine() {
      if (!this.examineSummary || !this.rowInfo.examineFileName) {
        this.$message({ content: '请填写完整', type: 'warning' })
        return
      }
      saveSuggestion({
        ...this.rowInfo,
        examineSummary: this.examineSummary,
        fileId: this.rowInfo.fileId,
      }).then(() => {
        getExamineList(this.rowInfo.fileId).then((res) => {
          this.examineTabelData = res.data
        })
        this.examineFileDialog = false
      })
    },
    closedExamineFileDialog() {
      this.rowInfo.examineFileName = ''
      this.examineSummary = ''
    },
    // 通过评审
    passExamine() {
      this.$confirm('确认通过？', '提示').then(() => {
        confirm(this.rowInfo.fileId).then((res) => {
          this.init()
          this.$message({ content: res.message, type: 'success' })
          this.examineDialog = false
        })
      })
    },
    // 建设页面表格
    initConstruction() {
      getDeviceList(this.row.processId).then((res) => {
        this.constructionTable = res.data
      })
    },
    // 建设页面漏洞表格
    initFlawRepor() {
      getFlawReportList(this.row.processId).then((res) => {
        this.FlawTable = res.data
      })
    },
    // 建设页面基线表格
    initBaseLineAndSeep(type) {
      getBaseOnlineAndPenetration(this.row.processId, type).then((res) => {
        if (type === 1) this.baseLine = res.data
        else if (type === 2) this.seep = res.data
      })
    },
    visibilityFun() {
      if (!document.hidden) {
        this.initFlawRepor()
        this.initBaseLineAndSeep(1)
        this.initBaseLineAndSeep(2)
      }
    },
    // 跳新页面
    toNewPage(type, processId, status, deviceId, assetInfo, fileId) {
      const newPage = this.$router.resolve({
        path: '/reportform',
        query: {
          type: type,
          processId: processId,
          status: status,
          deviceId: deviceId,
          assetInfo: assetInfo,
          fileId: fileId,
        },
      })
      window.open(newPage.href, '_blank')
    },
    // 转维添加ip
    addMaintainIp() {
      this.allData.maintainBO.ipList.push('')
    },
    // 会议记要弹出框
    openMettingDialog(type, info) {
      this.meetingDialogTitle = type
      // 数组扁平化
      function flat(array) {
        let res = []
        function loop(array) {
          res = res.concat(array)
          array.forEach((item) => {
            if (item.nextNodes) loop(item.nextNodes)
          })
        }
        loop(array)
        return res
      }
      getProcessOrgNodeTree(this.row.processId).then((res) => {
        this.meetingDepartment = flat(res.data)
      })
      // this.meetingDepartment = flat(this.systemOrgNodeTree)
      if (info) {
        getConferenceById(info.id).then((res) => {
          getOrgPersonByIds({ orgIds: res.data.orgId }).then((res) => {
            this.meetingStaff = res.data
          })
          this.meetingForm = res.data
        })
      }
      this.meetingDialog = true
    },
    closedMeeting() {
      Object.assign(this.$data.meetingForm, this.$options.data().meetingForm)
      this.meetingStaff = []
      this.$refs.mettingForm.clearErr()
    },
    saveMeeting() {
      if (!this.$refs.mettingForm.validate()) return
      this.meetingForm.processId = this.allData[this.nowKey + 'BO'].processId
      this.meetingForm.schedule = this.allData[this.nowKey + 'BO'].schedule
      saveConference(this.meetingForm).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.init()
        this.meetingDialog = false
      })
    },
    // 删除会议文件
    removeMeeting(info) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteConference(info.id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
        })
      })
    },
    // 漏洞申请复评
    review(id) {
      reviewByFileId(id).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.initFlawRepor()
      })
    },
    // 漏洞通过
    passFlaw(id) {
      this.$confirm('确认通过？', '提示').then(() => {
        passFlawByProcessId(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.initFlawRepor()
        })
      })
    },
    openBuild(info) {
      this.buildForm = JSON.parse(JSON.stringify(info))
      this.buildDialog = true
    },
    buildSave() {
      if (!this.$refs.flowBuildForm.validate()) return
      saveDevice(this.buildForm).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.initConstruction()
        this.buildDialog = false
      })
    },
    removeBuild(id) {
      this.$confirm('确认删除？', '提示').then(() => {
        deleteDeviceById(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.initConstruction()
          this.initFlawRepor()
          this.initBaseLineAndSeep(1)
          this.initBaseLineAndSeep(2)
        })
      })
    },
    openDialogReckon() {
      checkConstruction(this.row.processId).then(() => {
        getEnumList().then((res) => {
          this.enumList = res.data
          this.dialogReckon = true
        })
      })
    },
    addList(key, obj) {
      this.reckonForm[key].push(obj)
    },
    removeList(key, index) {
      this.reckonForm[key].splice(index, 1)
    },
    saveReckon() {
      if (!this.$refs.reckonForm.validate()) return
      this.reckonForm.processId = this.row.processId
      createReportEvaluation(this.reckonForm).then((res) => {
        this.$message({ content: res.message, type: 'success' })
        this.dialogReckon = false
        this.init()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.flow-form {
  height: calc(100vh - 45px - 80px);
  h1 {
    height: 5%;
    color: #045fc9;
    text-align: center;
  }
  .detail {
    height: 5%;
    display: flex;
    justify-content: space-around;
  }
  main {
    display: flex;
    height: 80%;
    overflow-y: auto;
    nav {
      margin-right: 20px;
      margin-top: 10px;
      overflow-y: scroll;
      overflow-x: hidden;
      .step {
        height: 70px;
        display: flex;
        align-items: center;
        position: relative;
        .txt {
          width: 80px;
          text-align: right;
          font-weight: bold;
        }
        .cyc {
          width: 23px;
          height: 20px;
          margin-left: 10px;
          border-radius: 50%;
          background: #ccc;
          position: relative;
        }
        .archive {
          position: absolute;
          top: 50px;
          font-size: 12px;
          width: 80px;
          color: #158ae7;
          text-align: right;
        }
      }
      .step:not(:first-child) {
        .cyc {
          &::before {
            content: '';
            background: #ccc;
            width: 2px;
            height: 48px;
            position: absolute;
            top: -49px;
            left: 9px;
          }
        }
      }
      .ing > .cyc {
        background: #13cf97;
      }
      .finish > .cyc {
        background: #43acff;
      }
      .active > .cyc {
        background: #045fc9;
      }
    }
    nav::-webkit-scrollbar {
      display: none;
    }
    article {
      width: calc(100% - 40px);
      padding: 0 20px 20px 20px;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fff;
      .title {
        box-shadow: 0 2px 3px #ccc;
        font-weight: bold;
        background: #158ae7;
        padding: 0 15px;
        height: 35px;
        line-height: 35px;
        color: #fff;
        margin: 0 -20px;
      }
      .content {
        .items {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin: 20px auto 10px auto;
          padding: 20px;
          background: #e7f3fd;
          .item {
            padding: 2px 0;
            width: 33.3%;
            display: flex;
            box-sizing: border-box;
            align-items: center;
            label {
              text-align: right;
              width: 30%;
              margin-right: 2%;
              em {
                color: #ff4949;
                margin-right: 5px;
              }
            }
            input,
            select {
              width: 65%;
            }
            button {
              height: 30px;
              margin-right: 5px;
              color: #158ae7;
              border: 1px solid #158ae7;
            }
            .visa {
              color: #158ae7;
              width: 200px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: block;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
          .item-w {
            width: 50%;
            label {
              width: 20%;
            }
            input,
            select {
              width: 72%;
            }
          }
        }
        div > .baseline {
          background: #f7fcfd;
          border: 1px solid #66cbd1;
          h5 {
            background: #66cbd1;
          }
        }
        div > .infiltration {
          background: #f3fdfa;
          border: 1px solid #6ce1bf;
          h5 {
            background: #6ce1bf;
          }
        }
        div > .loophole {
          background: #f9feff;
          border: 1px solid #5ce3f3;
          h5 {
            background: #5ce3f3;
          }
        }
        div > .report-wrap {
          margin: 20px 0;
          padding-bottom: 10px;
          h5 {
            padding: 5px 10px;
          }
          button {
            margin: 10px 5px 0 1%;
          }
          table {
            width: 98%;
            margin: 10px auto 15px auto;
            .info {
              margin: 2px 10px;
              display: flex;
              i {
                font-style: normal;
                width: 50%;
                &:first-child {
                  text-align: right;
                }
                &:last-child {
                  text-align: left;
                }
              }
            }
          }
          .big-label {
            /deep/ .form-item > label {
              flex: 3;
            }
          }
        }
        div > .assets-wrap {
          width: 100%;
          max-height: 500px;
          overflow: scroll;
          table {
            width: 2000px;
          }
        }
        .purchase {
          .purchase-items {
            margin: 0 auto 10px auto;
            background: #e5f4fc;
            padding: 20px;
            .purchase-list {
              display: flex;
              .item {
                width: 25%;
              }
              .item > label {
                margin-right: 5px;
              }
            }
            button {
              height: 30px;
              margin: 10px 5px 0 0;
              color: #0196e0;
              border: 1px solid #0196e0;
              &:hover {
                background: #0196e0;
                color: #fff;
              }
            }
            button.remove {
              height: 30px;
              margin: 5px 0;
              color: #ff4949;
              border: 1px solid #ff4949;
              &:hover {
                background: #ff4949;
                color: #fff;
              }
            }
          }
          > button {
            border: 1px solid #0196e0;
            color: #0196e0;
            &:hover {
              background-color: #0196e0;
              color: #fff;
            }
          }
        }
      }
      h4 {
        color: #045fc9;
        margin: 20px 0 10px 0;
      }
      button {
        margin-bottom: 10px;
      }
    }
  }
  footer {
    height: 10%;
    padding: 10px 0;
    span {
      margin-left: 130px;
      color: #666;
      font-size: 12px;
      em {
        color: #ff4949;
        margin-right: 5px;
      }
    }
    div,
    .btn {
      text-align: center;
    }
  }
  footer > div,
  .btn {
    padding-bottom: 15px;
    button {
      background: #045fc9;
      color: #fff;
      margin: 10px 10px 0 0;
      padding: 0 10px;
      &:hover {
        background: #0196e0;
      }
    }
  }
  .examine-file {
    .review-item {
      width: 80%;
      padding: 5px 0;
      display: flex;
      margin: 0 auto;
      align-items: center;
      text-align: center;
      label {
        width: 20%;
        text-align: right;
        margin: 0 10px 0 0;
        box-sizing: border-box;
        em {
          color: #ff4949;
          margin-right: 5px;
        }
      }
      div > input {
        width: 90%;
      }
      textarea {
        text-align: left;
        width: 80%;
      }
      button {
        margin-top: 0;
        height: 30px;
        color: #0196e0;
        background: transparent;
        border: 1px solid #0196e0;
        &:hover {
          color: #fff;
        }
      }
    }
    .review-btn {
      text-align: center;
    }
  }
  .metting-staff-checkbox {
    width: 100%;
    margin: 10px 0;
  }
  .metting-staff-checked {
    width: 100%;
    span {
      margin-right: 10px;
      display: inline-block;
    }
  }
  .reckon-form {
    .piece {
      border-bottom: 1px solid #cbcbcb;
      margin-bottom: 10px;
      padding-bottom: 10px;
    }
    .pan {
      .form-gound {
        width: 109.7%;
        margin-left: -13.7%;
      }
    }
    b {
      width: 100%;
    }
    .reckon-on-row {
      display: flex;
      flex-flow: wrap;
      .form-gound {
        width: 48%;
      }
      svg {
        border: 1px solid #ff4949;
        border-radius: 50%;
        color: #ff4949;
        margin-left: 5px;
        margin-top: 13px;
      }
    }
  }
}
</style>
