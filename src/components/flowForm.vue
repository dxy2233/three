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
              <div class="item" style="flex: 2;">
                <label style="width: 15%;">变更签证</label>
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
            <div>
              <h4>基线检查报告</h4>
              <button
                v-if="baseLine.startVisble"
                @click="toNewPage(1, row.processId, 1)"
                :disabled="stepData[step - 1].lock"
                class="major"
                style="margin-right: 5px;"
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
                    <span>姓名：{{ props.row.reportBasicBO.nickName }} </span>
                    <span
                      >单位名称：{{ props.row.reportBasicBO.orgName }}
                    </span>
                    <span>联系方式：{{ props.row.reportBasicBO.phone }} </span>
                    <span
                      >填写时间：{{ props.row.reportBasicBO.uploadTime }}
                    </span>
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
                    <span
                      >姓名：{{ props.row.reviewReportBasicBO.nickName }}
                    </span>
                    <span
                      >单位名称：{{ props.row.reviewReportBasicBO.orgName }}
                    </span>
                    <span
                      >联系方式：{{ props.row.reviewReportBasicBO.phone }}
                    </span>
                    <span
                      >填写时间：{{ props.row.reviewReportBasicBO.uploadTime }}
                    </span>
                  </template>
                </baseCol>
                <baseCol label="操作">
                  <template #button="props">
                    <button
                      v-if="props.row.editVisble"
                      :disabled="stepData[step - 1].lock"
                      @click="
                        toNewPage(1, row.processId, 1, props.row.deviceId)
                      "
                    >
                      编辑
                    </button>
                    <button
                      v-if="props.row.reviewVisble"
                      :disabled="stepData[step - 1].lock"
                      @click="
                        toNewPage(1, row.processId, 2, props.row.deviceId)
                      "
                    >
                      复查
                    </button>
                  </template>
                </baseCol>
              </baseTable>
            </div>
            <!-- 渗透 -->
            <div>
              <h4>渗透测试报告</h4>
              <button
                v-if="seep.startVisble"
                @click="toNewPage(2, row.processId, 1)"
                :disabled="stepData[step - 1].lock"
                class="major"
                style="margin-right: 5px;"
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
                    <span>姓名：{{ props.row.reportBasicBO.nickName }} </span>
                    <span
                      >单位名称：{{ props.row.reportBasicBO.orgName }}
                    </span>
                    <span>联系方式：{{ props.row.reportBasicBO.phone }} </span>
                    <span
                      >填写时间：{{ props.row.reportBasicBO.uploadTime }}
                    </span>
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
                    <span
                      >姓名：{{ props.row.reviewReportBasicBO.nickName }}
                    </span>
                    <span
                      >单位名称：{{ props.row.reviewReportBasicBO.orgName }}
                    </span>
                    <span
                      >联系方式：{{ props.row.reviewReportBasicBO.phone }}
                    </span>
                    <span
                      >填写时间：{{ props.row.reviewReportBasicBO.uploadTime }}
                    </span>
                  </template>
                </baseCol>
                <baseCol label="操作">
                  <template #button="props">
                    <button
                      v-if="props.row.editVisble"
                      :disabled="stepData[step - 1].lock"
                      @click="
                        toNewPage(2, row.processId, 1, props.row.deviceId)
                      "
                    >
                      编辑
                    </button>
                    <button
                      v-if="props.row.reviewVisble"
                      :disabled="stepData[step - 1].lock"
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
            <div>
              <h4>漏洞扫描报告</h4>
              <button
                v-if="FlawTable.uploadVisible"
                :disabled="stepData[step - 1].lock"
                @click="toNewPage(3, row.processId)"
                class="major"
                style="margin-right: 5px;"
              >
                上传
              </button>
              <button
                v-if="FlawTable.passVisible"
                :disabled="stepData[step - 1].lock"
                @click="passFlaw(allData[nowKey + 'BO'].processId)"
                class="major"
              >
                通过
              </button>
              <baseTable :tableData="FlawTable.flawList">
                <baseCol prop="fileName" label="漏洞文件名">
                  <template #button="props">
                    <span
                      @click="downloadBaseSeepFlaw(props.row.filePath)"
                      class="link"
                    >
                      {{ props.row.fileName }}</span
                    >
                  </template>
                </baseCol>
                <baseCol prop="fileSize" label="文件大小" />
                <baseCol prop="highNum" label="高危数量" />
                <baseCol prop="mediumNum" label="中危数量" />
                <baseCol prop="lowNum" label="低危数量" />
                <baseCol prop="personName" label="上传人" />
                <baseCol prop="orgName" label="单位名称" />
                <baseCol prop="tel" label="联系方式" />
                <baseCol prop="uploadTime" label="上传时间" />
                <baseCol label="操作">
                  <template #button="props">
                    <button
                      v-show="props.row.downloadVisible"
                      @click="downloadFlaw(props.row.fileId)"
                    >
                      下载
                    </button>
                    <button
                      v-show="props.row.reviewVisible"
                      @click="review(props.row.fileId)"
                      :disabled="stepData[step - 1].lock"
                    >
                      申请复评
                    </button>
                    <button
                      v-show="props.row.deleteVisible"
                      class="remove"
                      @click="removeFlawFile(props.row.fileId)"
                      :disabled="stepData[step - 1].lock"
                    >
                      删除
                    </button>
                  </template>
                </baseCol>
              </baseTable>
            </div>
          </div>
          <!-- 初验 -->
          <div v-else-if="item.key === 'acceptFirst'" class="acceptance">
            <div>
              <label><em>*</em>验收结论</label>
              <textarea
                v-model="allData.acceptFirstBO.summary"
                rows="10"
                :disabled="item.lock"
              ></textarea>
            </div>
          </div>
          <!-- 终验 -->
          <div v-else-if="item.key === 'acceptFinal'" class="acceptance">
            <div>
              <label><em>*</em>验收结论</label>
              <textarea
                v-model="allData.acceptFinalBO.summary"
                rows="10"
                :disabled="item.lock"
              ></textarea>
            </div>
          </div>
          <!-- 转维 -->
          <div v-else-if="item.key === 'maintain'" class="transformation">
            <h4>IP地址</h4>
            {{ allData.maintainBO.ipList.join('，') }}
            <!-- <div
              v-for="(item2, index2) in allData.maintainBO.ipList"
              :key="index2"
            >
              <input
                type="text"
                v-model="allData.maintainBO.ipList[index2]"
                :disabled="item.lock"
              />
              <button
                @click="allData.maintainBO.ipList.splice(index2, 1)"
                :disabled="item.lock"
                class="remove"
              >
                删除
              </button>
            </div> -->
            <!-- <button @click="addMaintainIp" :disabled="item.lock">添加</button> -->
          </div>
        </div>

        <h4>会议记要</h4>
        <button
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
                :disabled="stepData[step - 1].lock"
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
                :disabled="stepData[step - 1].lock"
              >
                删除文档
              </button>
            </template>
          </baseCol>
        </baseTable>
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
        <button @click="uploadFile(null, 2)" style="margin-right: 5px;">
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
          <!-- <label v-for="(item, index) in meetingDepartment" :key="index">
            <input
              type="checkbox"
              v-model="meetingForm.orgId"
              :id="item.id"
              :value="item.id"
              @change="changeMettingOrg($event, item.id)"
            />
            {{ item.orgName }}
          </label> -->
        </baseFormItem>
        <!-- <baseFormItem label="参会人员" prop="perIds" required>
          <input type="text" v-model="meetingStaffSearch" />
          <div class="metting-staff-checkbox">
            <label
              v-show="item.name.includes(meetingStaffSearch)"
              v-for="(item, index) in meetingStaff"
              :key="index"
            >
              <input
                type="checkbox"
                v-model="meetingForm.perIds"
                :id="item.id"
                :value="item.id"
              />
              {{ item.name }}
            </label>
          </div>
          <div class="metting-staff-checked">
            <span v-for="(item, index) in meetingStaffChecked" :key="index">{{
              item.name
            }}</span>
          </div>
        </baseFormItem> -->
        <baseFormItem label="参会人员" prop="perString" required>
          <textarea rows="5" v-model="meetingForm.perString"></textarea>
          <div style="color: #ff4949;">*以顿号(、)进行分隔</div>
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
      <baseForm ref="flowBuildForm" :form="buildForm">
        <baseFormItem label="序号">
          <input type="text" v-model="buildForm.serialNumber" />
        </baseFormItem>
        <baseFormItem label="设备名称">
          <input type="text" v-model="buildForm.deviceName" />
        </baseFormItem>
        <baseFormItem label="设备类型">
          <input type="text" v-model="buildForm.deviceSort" />
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
        <baseFormItem label="操作系统版本">
          <input type="text" v-model="buildForm.systemVersion" />
        </baseFormItem>
        <baseFormItem label="中间件版本">
          <input type="text" v-model="buildForm.midVersion" />
        </baseFormItem>
        <baseFormItem label="数据库版本">
          <input type="text" v-model="buildForm.dbVersion" />
        </baseFormItem>
        <baseFormItem label="私网IP地址">
          <input type="text" v-model="buildForm.privateAddress" />
        </baseFormItem>
        <baseFormItem label="DCN网地址">
          <input type="text" v-model="buildForm.dcnAddress" />
        </baseFormItem>
        <baseFormItem label="公网IP地址">
          <input type="text" v-model="buildForm.publicAddress" />
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
  </div>
</template>

<script>
import {
  getProcessById,
  saveInitiate,
  archiveSchedule,
  saveDesign,
  saveAcceptFirst,
  saveAcceptFinal,
  saveMaintain,
  saveConference,
  deleteConference,
  getConferenceById,
} from '@/api/process'
import {
  getDeviceList,
  saveDevice,
  deleteDeviceById,
  importDevice,
} from '@/api/device'
import {
  getFlawReportList,
  downloadFlaw,
  reviewByFileId,
  deleteFlaw,
  passFlawByProcessId,
} from '@/api/flawCommon'
import { getBaseOnlineAndPenetration } from '@/api/reportCommon'
import {
  uploadFile,
  deleteFile,
  getExamineList,
  saveSuggestion,
  confirm,
  downloadFile,
} from '@/api/file'
import { download } from '@/api/sftp'
import { getOrgPersonByIds, getProcessOrgNodeTree } from '@/api/systemOrgNode'
import { getDictionaryValue } from '@/api/dictionary'
import { downloadTemplate } from '@/api/template'
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
        { txt: '', status: '', visible: '', lock: true, key: 'acceptFirst' },
        { txt: '', status: '', visible: '', lock: true, key: 'acceptFinal' },
        { txt: '', status: '', visible: '', lock: true, key: 'maintain' },
      ],
      allData: {},
      rowInfo: {}, // table当前row的数据
      examineDialog: false,
      examineTabelData: [],
      examineFileDialog: false,
      examineSummary: '', // 评审结论
      constructionData: {}, // 建设流程字典数据
      constructionTable: [], // 建设页面表格数据
      constructionForm: {
        deviceName: '',
        deviceCode: '',
        deviceAlias: '',
        deviceType: '',
        network: '',
        machineName: '',
        deviceModel: '',
        detailAddress: '',
        bureauStation: '',
        area: '',
        ipAddress: '',
        localAttribute: '',
        manufacturer: '',
        enteringPersonnel: '',
        enteringStartTime: '',
        enteringEndTime: '',
      },
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
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.initFlawRepor()
        this.initBaseLineAndSeep(1)
        this.initBaseLineAndSeep(2)
      }
    })
    this.init(true)
    getDictionaryValue().then((res) => {
      this.constructionData = res.data
    })
    // 建设流程数据
    this.initConstruction()
    this.initFlawRepor()
    this.initBaseLineAndSeep(1)
    this.initBaseLineAndSeep(2)
  },
  methods: {
    init(ifSetStep) {
      getProcessById(this.row.processId).then((res) => {
        // 缓存数据
        let cachData
        if (this.allData.initiateBO) {
          cachData = {
            initiateBO: {
              org: this.allData.initiateBO.org,
              type: this.allData.initiateBO.type,
            },
            designBO: {
              org: this.allData.designBO.org,
              principal: this.allData.designBO.principal,
              tel: this.allData.designBO.tel,
              email: this.allData.designBO.email,
            },
            // constructionBO: {},
            acceptFirstBO: {
              summary: this.allData.acceptFirstBO.summary,
            },
            acceptFinalBO: {
              summary: this.allData.acceptFinalBO.summary,
            },
            // maintainBO: {}
          }
        }
        this.allData = res.data
        if (cachData) {
          for (const key in cachData) {
            this.allData[key] = Object.assign(
              {},
              this.allData[key],
              cachData[key]
            )
          }
        }
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
        case 'acceptFirst':
          saveAcceptFirst(this.allData.acceptFirstBO).then((res) => {
            this.$message({ content: res.message, type: 'success' })
            this.init()
          })
          break
        case 'acceptFinal':
          saveAcceptFinal(this.allData.acceptFinalBO).then((res) => {
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
          if (!this.rowInfo.isExamineFile) this.init()
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
        })
      }
      this.$refs.flowFile.value = null
    },
    // 下载文件
    download(id, isExamineFile, ifInit) {
      downloadFile(id, isExamineFile).then(() => {
        if (ifInit) this.init()
      })
    },
    // 下载资产模板
    downloadTem() {
      downloadTemplate(2)
    },
    // 下载漏洞文件
    downloadFlaw(fileId) {
      downloadFlaw(fileId)
    },
    // 基线、渗透、漏洞下载
    downloadBaseSeepFlaw(path) {
      download(path)
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
          this.init()
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
    // 跳新页面
    toNewPage(type, processId, status, deviceId) {
      const newPage = this.$router.resolve({
        path: '/reportform',
        query: {
          type: type,
          processId: processId,
          status: status,
          deviceId: deviceId,
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
        this.init()
      })
    },
    // 漏洞通过
    passFlaw(id) {
      this.$confirm('确认通过？', '提示').then(() => {
        passFlawByProcessId(id).then((res) => {
          this.$message({ content: res.message, type: 'success' })
          this.init()
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
        })
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
              margin-right: 3%;
              white-space: nowrap;
              em {
                color: #ff4949;
                margin-right: 5px;
              }
            }
            input,
            select {
              width: 67%;
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
        }
        div > .assets-wrap {
          width: 100%;
          max-height: 200px;
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
        .transformation {
          div {
            margin-bottom: 5px;
            input {
              position: relative;
              top: -2px;
              width: 30%;
            }
            button.remove {
              height: 30px;
              margin-left: 5px;
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
        .acceptance > div {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 0;
          label > em {
            margin-right: 5px;
            color: #ff4949;
          }
          textarea {
            border-radius: 3px;
            margin-left: 10px;
            width: 60%;
            border: 1px solid #ccc;
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
      table {
        padding: 10px 30px;
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
}
</style>
