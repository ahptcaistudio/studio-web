import axios from 'axios'

// 公开页自己显示加载失败和重试，不触发后台登录弹窗或全局错误提示。
const publicRequest = axios.create({ baseURL: import.meta.env.VITE_APP_BASE_API, timeout: 10000 })

/**
 * 读取人工智能工作室公开展示页内容。
 * 公开页不依赖登录态，避免访客浏览时携带过期 Token。
 */
export async function getPublicStudio(signal) {
  const response = await publicRequest({
    url: '/front/studio',
    method: 'get',
    signal
  })
  if (response.data?.code !== 200 || !response.data?.data || response.data.data.available === false) {
    throw new Error('工作室内容暂时无法加载')
  }
  return response.data
}
