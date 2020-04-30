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
 * @description 下载漏洞扫描报告
 */
export function downloadFlaw(fileId) {
  return request({
    url: '/flawcommon/downloadFlaw',
    method: 'get',
    responseType: 'blob',
    params: { fileId },
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
