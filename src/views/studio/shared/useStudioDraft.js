import { ref, computed, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { discardStudioImages } from '@/api/studio/modules'
import useUserStore from '@/store/modules/user'

// 草稿只记录本标签页、当前账号上传的资源；后端检查跨表引用后即时清理。
export function useStudioDraft(proxy, module) {
  const saving = ref(false)
  const pending = ref(0)
  const busy = computed(() => saving.value || pending.value > 0)
  const key = `studio-module-draft:${useUserStore().id}:${module}`
  let stored = []
  try { stored = JSON.parse(sessionStorage.getItem(key) || '[]') } catch { /* 不依赖本地存储可用性 */ }
  const drafts = new Set(Array.isArray(stored) ? stored.filter(item => typeof item === 'string') : [])
  function persist() {
    try { sessionStorage.setItem(key, JSON.stringify([...drafts])) } catch { /* 保留内存集合 */ }
  }
  async function discard(resources = [...drafts]) {
    if (!Array.isArray(resources)) resources = [...drafts]
    if (!resources.length) return
    try {
      await discardStudioImages(resources)
      resources.forEach(resource => drafts.delete(resource))
      persist()
    } catch {
      proxy.$modal.msgWarning('未使用图片清理失败，文件仍保留，请检查后端日志。')
    }
  }
  function track(resource) { drafts.add(resource); persist() }
  function removed(resource) { if (drafts.has(resource)) discard([resource]) }
  async function saved(record) {
    // 已保存引用从草稿移除，剩余的取消上传立即清理。
    Object.entries(record).filter(([name]) => name.endsWith('Url')).forEach(([, resource]) => drafts.delete(resource))
    persist()
    await discard()
  }
  async function leave() {
    if (busy.value) { proxy.$modal.msgWarning('请等待上传或保存完成。'); return false }
    await discard()
  }
  onBeforeRouteLeave(leave)
  onBeforeRouteUpdate(leave)
  onBeforeUnmount(() => { discard() })
  discard()
  return { saving, pending, busy, discard, track, removed, saved }
}
