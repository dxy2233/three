import request from '@/utils/request'

/**
 * @description 根据漏洞信息id删除相关信息
 */
export function deleteFlawById(id) {
  return request({
    url: '/flaw/deleteFlawById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 导出漏洞信息的Word文档
 * @param id id
 * @param name 部门名称
 * @param ipAddr ip地址
 * @param operationUnit 运营单位
 * @param title 漏洞标题
 * @param leakType 漏洞类型
 * @param addTime 录入时间
 * @param hazardLevel 危害级别(0:低,1：中,2:高)
 * @param filler 填写人
 * @param repairTime 整改时间
 * @param editVisble 是否显示编辑按钮
 * @param repairVisble 是否显示整改按钮
 * @param deleteVisble 是否显示删除按钮
 * @param exportVisble 是否显示导出按钮
 * @param noticeVisble 是否显示通报按钮
 * @param sourceState 数据来源:0录入，1导入
 */
export function downloadWord(data) {
  return request({
    url: '/flaw/downloadWord',
    method: 'post',
    responseType: 'blob',
    data,
  })
}

/**
 * @description 漏洞附件上传
 */
export function flawAttachUpload(data) {
  return request({
    url: '/flaw/flawAttachUpload',
    method: 'post',
    data,
  })
}

/**
 * @description 根据ID获取漏洞信息
 */
export function getFlawById(id) {
  return request({
    url: '/flaw/getFlawById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 漏洞信息条件和分页查询
 * @param startPage 页面编号
 * @param pageSize 页面大小
 * @param projectName 项目名称
 * @param leakType 漏洞类型
 * @param hazardLevel 危害级别
 * @param title 漏洞标题
 * @param startTime 录入开始时间
 * @param endTime 录入结束时间
 * @param sourceState 数据来源:0录入，1导入
 */
export function getFlawPage(data) {
  return request({
    url: '/flaw/getFlawPage',
    method: 'post',
    data,
  })
}

/**
 * @description 漏洞导入
 */
export function importFlaw(data) {
  return request({
    url: '/flaw/importFlaw',
    method: 'post',
    data,
  })
}

/**
 * @description 整改漏洞
 */
export function repairFlaw(id) {
  return request({
    url: '/flaw/repairFlaw',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 保存漏洞信息
 * @param id 主键ID
 * @param projectId 项目Id
 * @param title 漏洞名称
 * @param hazardLevel 危害级别(0:低,1：中,2:高)
 * @param influencingProducts 影响系统
 * @param leakDescribe 漏洞描述
 * @param leakSolution 漏洞解决方案
 * @param leakType 漏洞类型（0：通用型漏洞）
 * @param flawLink 漏洞链接
 * @param referenceLink 参考链接
 * @param verificationInformation 验证信息（0未验证、1验证）
 * @param vendorPatch 厂商补丁
 * @param attachmentName 漏洞附件名称
 * @param attachmentUrl 漏洞附件地址
 */
export function saveFlaw(data) {
  return request({
    url: '/flaw/saveFlaw',
    method: 'post',
    data,
  })
}
