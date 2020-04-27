import request from '@/utils/request'

/**
 * @description 根据ID删除项目备案信息
 */
export function deleteReport(fileId) {
  return request({
    url: '/reportcommon/deleteReport',
    method: 'get',
    params: { fileId },
  })
}

/**
 * @description 获取渗透测试
 */
export function getPenetrationByProjectId(projectId, status) {
  return request({
    url: '/reportcommon/getPenetrationByProjectId',
    method: 'get',
    params: { projectId, status },
  })
}

/**
 * @description 获取项目基线
 */
export function getProjectReport(projectId, status) {
  return request({
    url: '/reportcommon/getProjectReport',
    method: 'get',
    params: { projectId, status },
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
    url: '/reportcommon/getReportList',
    method: 'post',
    data,
  })
}

/**
 * @description 渗透整改完成
 */
export function reformPenetration(penetrationId) {
  return request({
    url: '/reportcommon/reformPenetration',
    method: 'get',
    params: { penetrationId },
  })
}

/**
 * @description 项目基线保存
 * @param projectId 项目id
 * @param childData 基线数据
 * @param status 状态 ：初查 1 ， 复查 2
 */
export function saveBaseline(data) {
  return request({
    url: '/reportcommon/saveBaseline',
    method: 'post',
    data,
  })
}

/**
 * @description 保存渗透
 * @param penetrationId 渗透id
 * @param projectId 项目ID
 * @param leakTitle 漏洞名称
 * @param hazardLevel 危害级别
 * @param cevNum CVE 编号
 * @param leakAddress 漏洞地址
 * @param leakHazardDesc 漏洞危害说明
 * @param reformDesc 整改建议
 * @param imgs 图片地址
 */
export function savePenetration(data) {
  return request({
    url: '/reportcommon/savePenetration',
    method: 'post',
    data,
  })
}

/**
 * @description 上传报告
 */
export function uploadReport(data) {
  return request({
    url: '/reportcommon/uploadReport',
    method: 'post',
    data,
  })
}
