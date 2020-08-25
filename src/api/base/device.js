import request from '@/utils/request'

/**
 * @description 建设节点：删除设备
 */
export function deleteDeviceById(id) {
  return request({
    url: '/device/deleteDeviceById',
    method: 'get',
    params: { id },
  })
}

/**
 * @description 建设节点：导出设备
 */
export function downloadDevice(processId) {
  return request({
    url: '/device/downloadDevice',
    method: 'get',
    responseType: 'blob',
    params: { processId },
  })
}

/**
 * @description 通过设备deviceId获取当前资产
 */
export function getAsstesByDeviceId(deviceId) {
  return request({
    url: '/device/getAsstesByDeviceId',
    method: 'get',
    params: { deviceId },
  })
}

/**
 * @description 根据ID获取设备资产信息列表type:1 基线 2 渗透 0 全部
 */
export function getDeviceAssetsById(processId, type) {
  return request({
    url: '/device/getDeviceAssetsById',
    method: 'get',
    params: { processId, type },
  })
}

/**
 * @description 建设节点：查询设备列表
 */
export function getDeviceList(processId) {
  return request({
    url: '/device/getDeviceList',
    method: 'get',
    params: { processId },
  })
}

/**
 * @description 建设节点：导入设备
 */
export function importDevice(data) {
  return request({
    url: '/device/importDevice',
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
 * @param deviceSort 设备类型
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
    url: '/device/saveDevice',
    method: 'post',
    data,
  })
}
