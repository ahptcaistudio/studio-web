import request from '@/utils/request'

const modules = new Set(['site', 'project', 'team', 'competition', 'award', 'platform'])
function endpoint(module) {
  if (!modules.has(module)) throw new Error('不支持的工作室模块')
  return `/system/studio/${module}`
}
export const listRecords = (module, params) => request({ url: `${endpoint(module)}/list`, method: 'get', params })
export const getRecord = (module, id) => request({ url: `${endpoint(module)}/${id}`, method: 'get' })
export const addRecord = (module, data) => request({ url: endpoint(module), method: 'post', data })
export const updateRecord = (module, data) => request({ url: endpoint(module), method: 'put', data })
export const deleteRecords = (module, ids) => request({ url: `${endpoint(module)}/${ids.join(',')}`, method: 'delete' })
export const discardStudioImages = data => request({ url: '/system/studio/images/discard', method: 'post', data })
