import request from '@/utils/request'

/**
 * @description 根据ID删除部门人员
 */
export function deleteOrgNodePersonById(personId) {
  return request({
    url: '/systemorgnode/deleteOrgNodePersonById',
    method: 'get',
    params: { personId },
  })
}

/**
 * @description 根据ID删除部门
 */
export function deleteSystemOrgNodeById(id) {
  return request({
    url: '/systemorgnode/deleteSystemOrgNodeById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 多部门人员信息查询
 * @param orgIds 部门Ids
 */
export function getOrgPersonByIds(data) {
  return request({
    url: '/systemorgnode/getOrgPersonByIds',
    method: 'post',
    data,
  })
}

/**
 * @description 部门人员信息条件和分页查询
 * @param startPage 页面编号
 * @param pageSize 页面大小
 * @param orgId 部门id
 * @param pageUp 开启分页，true 开启，false 关闭，默认不开启
 */
export function getOrgPersonPage(data) {
  return request({
    url: '/systemorgnode/getOrgPersonPage',
    method: 'post',
    data,
  })
}

/**
 * @description 流程管控获取部门树
 */
export function getProcessOrgNodeTree(processId) {
  return request({
    url: '/systemorgnode/getProcessOrgNodeTree',
    method: 'get',
    params: { processId },
  })
}

/**
 * @description 根据部门ID获取部门信息
 */
export function getSystemOrgById(id) {
  return request({
    url: '/systemorgnode/getSystemOrgById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 根据登录用户查询部门列表
 */
export function getSystemOrgNodeTree() {
  return request({
    url: '/systemorgnode/getSystemOrgNodeTree',
    method: 'get',
  })
}

/**
 * @description 根据运营商获取部门信息
 */
export function getSystemOrgNodeTreeById(orgId) {
  return request({
    url: '/systemorgnode/getSystemOrgNodeTreeById',
    method: 'get',
    params: { orgId },
  })
}

/**
 * @description 保存部门
 * @param id id
 * @param orgName 部门名称
 * @param orgCode 部门编码
 * @param orgType 部门类型
 * @param parentId 上级部门ID
 */
export function saveSystemOrgNode(data) {
  return request({
    url: '/systemorgnode/saveSystemOrgNode',
    method: 'post',
    data,
  })
}

/**
 * @description 保存部门人员
 * @param id 主键ID
 * @param orgId 部门id
 * @param name 姓名
 * @param sex 性别:0 ：女 1 ：男
 * @param idCard 身份证
 * @param phone 联系方式
 */
export function saveSystemOrgNodePerson(data) {
  return request({
    url: '/systemorgnode/saveSystemOrgNodePerson',
    method: 'post',
    data,
  })
}
