import request from '@/utils/request'

/**
 * @description 导入项目备案信息
 */
export function import(data) {
  return request({
    url: '/excel/import',
    method: 'post',
    data
  })
}
