import request from '@/utils/request'

/**
 * @description 归档进度
 */
export function archiveSchedule(id, projectSchedule) {
  return request({
    url: '/process/archiveSchedule',
    method: 'get',
    params: { id, projectSchedule },
  })
}

/**
 * @description 根据ID删除会议纪要
 */
export function deleteConference(id) {
  return request({
    url: '/process/deleteConference',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 建设节点：删除设备
 */
export function deleteDeviceById(id) {
  return request({
    url: '/process/deleteDeviceById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 根据ID获取会议纪要详细信息
 */
export function getConferenceById(id) {
  return request({
    url: '/process/getConferenceById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 建设节点：查询设备列表
 */
export function getDeviceList(processId) {
  return request({
    url: '/process/getDeviceList',
    method: 'get',
    params: { processId },
  })
}

/**
 * @description 根据ID获取整个流程信息
 */
export function getProcessById(id) {
  return request({
    url: '/process/getProcessById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 根据登录用户，流程条件和分页查询
 * @param startPage 页面编号
 * @param pageSize 页面大小
 * @param projectCode 项目编号
 * @param projectName 项目名称
 * @param facilitator 服务商
 * @param orgId 所属部门
 * @param type 必传参数，类型：0 所有；1 立项；2 设计；3 建设；4 初验；5 终验；6 转维；7 暂停；8 完成
 */
export function getProcessList(data) {
  return request({
    url: '/process/getProcessList',
    method: 'post',
    data,
  })
}

/**
 * @description 建设节点：导入设备
 */
export function importDevice(data) {
  return request({
    url: '/process/importDevice',
    method: 'post',
    data,
  })
}

/**
 * @description 漏洞通过：processId 流程ID
 */
export function passFlawByProcessId(processId) {
  return request({
    url: '/process/passFlawByProcessId',
    method: 'get',
    params: { processId },
  })
}

/**
 * @description 暂停项目：id 流程ID；pause 为true是暂停，为false是恢复；reason 暂停或恢复的原因
 */
export function pauseProcess(id, pause, reason) {
  return request({
    url: '/process/pauseProcess',
    method: 'get',
    params: { id, pause, reason },
  })
}

/**
 * @description 申请复评
 */
export function reviewByFileId(fileId) {
  return request({
    url: '/process/reviewByFileId',
    method: 'get',
    params: { fileId },
  })
}

/**
 * @description 保存终验
 * @param processId 流程ID
 * @param schedule 项目进度名称
 * @param summary 验收结论
 * @param fileBOList 相关资料
 * @param conferenceBOList 会议纪要
 * @param saveVisible 保存按钮是否可见
 * @param editVisible 编辑按钮是否可见
 * @param archiveVisible 归档按钮是否可见
 * @param conferenceVisible 新增会议纪要按钮是否可见
 * @param status 状态：未开始；进行中；完成；项目暂停
 */
export function saveAcceptFinal(data) {
  return request({
    url: '/process/saveAcceptFinal',
    method: 'post',
    data,
  })
}

/**
 * @description 保存初验
 * @param processId 流程ID
 * @param schedule 项目进度名称
 * @param summary 验收结论
 * @param fileBOList 相关资料
 * @param conferenceBOList 会议纪要
 * @param saveVisible 保存按钮是否可见
 * @param editVisible 编辑按钮是否可见
 * @param archiveVisible 归档按钮是否可见
 * @param conferenceVisible 新增会议纪要按钮是否可见
 * @param status 状态：未开始；进行中；完成；项目暂停
 */
export function saveAcceptFirst(data) {
  return request({
    url: '/process/saveAcceptFirst',
    method: 'post',
    data,
  })
}

/**
 * @description 保存会议纪要
 * @param id ID
 * @param processId 流程ID
 * @param schedule 项目进度
 * @param conferenceName 会议名称
 * @param hostName 主持人员
 * @param conferenceTime 会议时间
 * @param orgId 参会部门
 * @param perString 参会人员
 * @param fileId 会议文件ID（如实返回即可）
 * @param fileName 会议文件名称
 * @param filePath 会议文件上传路径
 * @param fileSize 会议文件大小
 */
export function saveConference(data) {
  return request({
    url: '/process/saveConference',
    method: 'post',
    data,
  })
}

/**
 * @description 保存设计
 * @param processId 流程ID
 * @param schedule 项目进度名称
 * @param org 设计单位
 * @param fileBOList 相关资料
 * @param principal 责任人
 * @param tel 联系方式
 * @param email 邮箱
 * @param visa 变更签证
 * @param conferenceBOList 会议纪要
 * @param saveVisible 保存按钮是否可见
 * @param editVisible 编辑按钮是否可见
 * @param archiveVisible 归档按钮是否可见
 * @param conferenceVisible 新增会议纪要按钮是否可见
 * @param status 状态：未开始；进行中；完成；项目暂停
 */
export function saveDesign(data) {
  return request({
    url: '/process/saveDesign',
    method: 'post',
    data,
  })
}

/**
 * @description 建设节点：保存设备
 * @param id ID
 * @param processId 流程ID
 * @param importName 导入人姓名
 * @param serialNumber 序号
 * @param deviceName 设备名称
 * @param deviceType 设备厂家/型号
 * @param position 机房位置
 * @param cabinetNumber 机柜编号
 * @param systemVersion 操作系统版本
 * @param midVersion 中间件版本
 * @param dbVersion 数据库版本
 * @param privateAddress 私网IP地址
 * @param dcnAddress DCN网地址
 * @param publicAddress 公网IP地址
 * @param url 应用WEB URL地址
 * @param port 端口
 * @param remark 备注
 * @param deleteVisible 删除按钮是否可见
 * @param editVisible 编辑按钮是否可见
 */
export function saveDevice(data) {
  return request({
    url: '/process/saveDevice',
    method: 'post',
    data,
  })
}

/**
 * @description 保存立项
 * @param processId 流程ID
 * @param schedule 项目进度名称
 * @param fileBOList 相关资料
 * @param org 需求单位
 * @param type 支出方式：1 成本；2 资本
 * @param conferenceBOList 会议纪要
 * @param saveVisible 保存按钮是否可见
 * @param editVisible 编辑按钮是否可见
 * @param archiveVisible 归档按钮是否可见
 * @param conferenceVisible 新增会议纪要按钮是否可见
 * @param status 状态：未开始；进行中；完成；项目暂停
 */
export function saveInitiate(data) {
  return request({
    url: '/process/saveInitiate',
    method: 'post',
    data,
  })
}

/**
 * @description 保存转维
 * @param processId 流程ID
 * @param schedule 项目进度名称
 * @param description 转维说明
 * @param fileBOList 相关资料
 * @param ipList IP地址
 * @param conferenceBOList 会议纪要
 * @param saveVisible 保存按钮是否可见
 * @param editVisible 编辑按钮是否可见
 * @param archiveVisible 归档按钮是否可见
 * @param conferenceVisible 新增会议纪要按钮是否可见
 * @param status 状态：未开始；进行中；完成；项目暂停
 */
export function saveMaintain(data) {
  return request({
    url: '/process/saveMaintain',
    method: 'post',
    data,
  })
}
