import request from '@/utils/request'

/**
 * @description 删除漏洞
 */
export function deleteFlaw(fileId) {
  return request({
    url: '/flawcommon/deleteFlaw',
    method: 'get',
    params: { fileId },
  })
}

/**
 * @description 获取项目漏洞详情
 * @param startPage 页面编号
 * @param pageSize 页面大小
 * @param projectName 项目名称
 * @param dutyUserName 项目当前责任人
 * @param orgId 单位id
 */
export function getFlawDetailInfoPage(data) {
  return request({
    url: '/flawcommon/getFlawDetailInfoPage',
    method: 'post',
    data,
  })
}

/**
 * @description 获取漏洞详情列表
 */
export function getFlawListByFileId(fileId, pageSize, startPage) {
  return request({
    url: '/flawcommon/getFlawListByFileId',
    method: 'get',
    params: { fileId, pageSize, startPage },
  })
}

/**
 * @description 根据流程节点获取漏洞详情列表
 * @param startPage 页面编号
 * @param pageSize 页面大小
 * @param processId 流程id
 */
export function getFlawListByProcessId(data) {
  return request({
    url: '/flawcommon/getFlawListByProcessId',
    method: 'post',
    data,
  })
}

/**
 * @description 获取漏洞扫描报告
 */
export function getFlawReportList(processId) {
  return request({
    url: '/flawcommon/getFlawReportList',
    method: 'get',
    params: { processId },
  })
}

/**
 * @description 漏洞通过：processId 流程ID
 */
export function passFlawByProcessId(processId) {
  return request({
    url: '/flawcommon/passFlawByProcessId',
    method: 'get',
    params: { processId },
  })
}

/**
 * @description 预览漏洞扫描报告
 */
export function previewFlaw(fileId) {
  return request({
    url: '/flawcommon/previewFlaw',
    method: 'get',
    params: { fileId },
  })
}

/**
 * @description 申请复评
 */
export function reviewByFileId(fileId) {
  return request({
    url: '/flawcommon/reviewByFileId',
    method: 'get',
    params: { fileId },
  })
}

/**
 * @description 上传漏洞扫描报告
 */
export function uploadFlawReport(data) {
  return request({
    url: '/flawcommon/uploadFlawReport',
    method: 'post',
    data,
  })
}
