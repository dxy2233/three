import request from '@/utils/request'

/**
 * @description 评审：确认通过，fileId是被评审文件的ID
 */
export function confirm(fileId) {
  return request({
    url: '/file/confirm',
    method: 'get',
    params: { fileId },
  })
}

/**
 * @description 流程管控：删除文件
 */
export function deleteFile(fileId) {
  return request({
    url: '/file/deleteFile',
    method: 'get',
    params: { fileId },
  })
}

/**
 * @description 流程管理下载文件：isExamineFile 是否是评审文件
 */
export function downloadFile(fileId, isExamineFile) {
  return request({
    url: '/file/downloadFile',
    method: 'get',
    responseType: 'blob',
    params: { fileId, isExamineFile },
  })
}

/**
 * @description 根据相关文件的ID，获取该文件的评审列表
 */
export function getExamineList(fileId) {
  return request({
    url: '/file/getExamineList',
    method: 'get',
    params: { fileId },
  })
}

/**
 * @description 提交建议
 * @param id id
 * @param fileId 被评审文件的ID
 * @param examineFileName 评审文件名称
 * @param examineFilePath 评审文件上传路径
 * @param examineFileSize 评审文件大小
 * @param examineSummary 审核建议
 * @param examinePerson 评审人
 * @param createTime 评审时间
 */
export function saveSuggestion(data) {
  return request({
    url: '/file/saveSuggestion',
    method: 'post',
    data,
  })
}

/**
 * @description 流程管控：上传文件，fileId是文件ID，processId是流程ID，schedule，type是类型，isExamineFile 是否是评审文件
 */
export function uploadFile(data) {
  return request({
    url: '/file/uploadFile',
    method: 'post',
    data,
  })
}
