import request from '@/utils/request'

/**
 * @description 查询所有菜单
 */
export function getMenuTree() {
  return request({
    url: '/menu/getMenuTree',
    method: 'get'
  })
}
