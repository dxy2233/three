import request from '@/utils/request'

/**
 * @description 根据ID删除项目备案信息:type
 */
export function deleteReport(fileId) {
  return request({
    url: '/report/deleteReport',
    method: 'get',
    params: { fileId }
  })
}

/**
 * @description 项目备案条件和分页查询
 * @param startPage 页面编号
 * @param pageSize 页面大小
 * @param projectCode 项目编号
 * @param projectName 项目名称
 * @param processNode 当前节点:0 全部 1 立项 2 设计 3 建设 4 初验 5 终验 6 转维 7 暂停 8 完成
 */
export function getReportList(data) {
  return request({
    url: '/report/getReportList',
    method: 'post',
    data
  })
}

/**
 * @description 上传报告
 */
export function uploadReport(data) {
  return request({
    url: '/report/uploadReport',
    method: 'post',
    data
  })
}
