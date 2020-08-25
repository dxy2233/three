import request from '@/utils/request'

/**
 * @description 下载文件
 */
export function download(path) {
  return request({
    url: '/sftp/download',
    method: 'get',
    responseType: 'blob',
    params: { path },
  })
}

/**
 * @description 预览文件
 */
export function preview(path) {
  return request({
    url: '/sftp/preview',
    method: 'get',
    params: { path },
  })
}

/**
 * @description 上传文件到临时文件夹
 */
export function uploadTempFile(data) {
  return request({
    url: '/sftp/uploadTempFile',
    method: 'post',
    data,
  })
}
