import request from '@/utils/request'

/**
 * @description 下载模板：type（1 项目备案；2 资产清单）
 */
export function downloadTemplate(type) {
  return request({
    url: '/template/downloadTemplate',
    method: 'get',
    responseType: 'blob',
    params: { type },
  })
}

/**
 * @description 上传模板：type（1 项目备案；2 资产清单）
 */
export function uploadFile(data) {
  return request({
    url: '/template/uploadFile',
    method: 'post',
    data,
  })
}
