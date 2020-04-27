import request from '@/utils/request'

/**
 * @description 根据ID删除服务商
 */
export function deleteFacilitatorById(id) {
  return request({
    url: '/facilitator/deleteFacilitatorById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 根据服务商员工id删除
 */
export function deleteFacilitatorPersonById(id) {
  return request({
    url: '/facilitator/deleteFacilitatorPersonById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 服务商信息和员工信息：用户管理
 */
export function getFacilitatorAndPerson() {
  return request({
    url: '/facilitator/getFacilitatorAndPerson',
    method: 'get',
  })
}

/**
 * @description 服务商名称列表
 */
export function getFacilitatorNameList() {
  return request({
    url: '/facilitator/getFacilitatorNameList',
    method: 'get',
  })
}

/**
 * @description 服务商信息条件和分页查询
 * @param startPage 页面编号
 * @param pageSize 页面大小
 * @param id 编号
 * @param name 供应商名称
 * @param orgId 部门id
 */
export function getInfoPage(data) {
  return request({
    url: '/facilitator/getInfoPage',
    method: 'post',
    data,
  })
}

/**
 * @description 服务商人员列表
 */
export function getPersonByFacilitatorId(facilitatorId) {
  return request({
    url: '/facilitator/getPersonByFacilitatorId',
    method: 'get',
    params: { facilitatorId },
  })
}

/**
 * @description 服务商资质上传
 */
export function qualificationUpload(data) {
  return request({
    url: '/facilitator/qualificationUpload',
    method: 'post',
    data,
  })
}

/**
 * @description 服务商信息保存
 * @param id 主键名称
 * @param name 供应商名称
 * @param startTime 服务开始时间：必填选项！
 * @param endTime 服务结束时间：必填选项！
 * @param qualification 资质是否符合:0：否 1：是
 * @param qualificationName 资质名称
 * @param qualificationPath 资质路径
 */
export function saveFacilitator(data) {
  return request({
    url: '/facilitator/saveFacilitator',
    method: 'post',
    data,
  })
}

/**
 * @description 服务商人员信息保存
 * @param id 人员管理ID
 * @param facilitatorId 供应商外键Id
 * @param name 姓名
 * @param sex 性别 0:女 1：男
 * @param idCard 身份证
 * @param practiceMode 联系方式
 */
export function saveFacilitatorPerson(data) {
  return request({
    url: '/facilitator/saveFacilitatorPerson',
    method: 'post',
    data,
  })
}
