import request from '@/utils/request'

/**
 * @description test1
 */
export function 1() {
  return request({
    url: '/test/1',
    method: 'get',
  })
}

/**
 * @description test10
 */
export function 10(data) {
  return request({
    url: '/test/10',
    method: 'post',
    data,
  })
}

/**
 * @description test3
 */
export function 3() {
  return request({
    url: '/test/3',
    method: 'get',
  })
}

/**
 * @description test5
 */
export function 5() {
  return request({
    url: '/test/5',
    method: 'get',
  })
}

/**
 * @description test7
 * @param age 
 * @param name 
 */
export function 7(data) {
  return request({
    url: '/test/7',
    method: 'post',
    data,
  })
}

/**
 * @description test8
 */
export function 8() {
  return request({
    url: '/test/8',
    method: 'get',
  })
}

/**
 * @description test9
 */
export function 9() {
  return request({
    url: '/test/9',
    method: 'get',
  })
}

/**
 * @description testc
 */
export function c() {
  return request({
    url: '/test/c',
    method: 'get',
  })
}

/**
 * @description testhtml
 */
export function html(data) {
  return request({
    url: '/test/html',
    method: 'post',
    data,
  })
}

/**
 * @description test4
 */
export function securityReport() {
  return request({
    url: '/test/securityReport',
    method: 'get',
  })
}

/**
 * @description testzip
 */
export function zip(data) {
  return request({
    url: '/test/zip',
    method: 'post',
    data,
  })
}
