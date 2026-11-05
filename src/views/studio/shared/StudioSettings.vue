<template>
  <div class="app-container studio-settings" v-loading="loading">
    <h2>{{ config.label }}</h2>
    <p class="settings-note">{{ config.note }}</p>
    <el-alert v-if="loadError" title="配置加载失败，请重试。为避免覆盖数据，暂不能保存。" type="error" :closable="false" />
    <el-form v-else ref="formRef" :model="form" :rules="rules" label-position="top">
      <StudioFields :model="form" :fields="config.fields" :disabled="loading || draft.busy.value || !canEdit"
        @uploaded="draft.track" @removed="draft.removed" @upload-start="draft.pending.value++"
        @upload-end="draft.pending.value = Math.max(0, draft.pending.value - 1)" />
      <el-form-item v-if="module === 'project'" label="整体展示状态">
        <el-switch v-model="form.status" active-value="0" inactive-value="1" active-text="显示" inactive-text="隐藏"
          :disabled="draft.busy.value || !canEdit" />
        <p class="settings-note">隐藏会移除整个企业项目板块及图片占位，不影响首屏和平台设施。</p>
      </el-form-item>
      <el-button type="primary" :loading="draft.saving.value" :disabled="loading || draft.pending.value > 0 || !canEdit" @click="save">保存设置</el-button>
      <el-button :disabled="draft.busy.value" @click="reload">重新加载</el-button>
    </el-form>
    <el-button v-if="loadError" :disabled="loading" @click="reload">重试</el-button>
  </div>
</template>
<script setup>
import { getRecord, updateRecord } from '@/api/studio/modules'
import { checkPermi } from '@/utils/permission'
import { useStudioDraft } from './useStudioDraft'
import StudioFields from './StudioFields.vue'
const props = defineProps({ module: { type: String, required: true }, config: { type: Object, required: true } })
const { proxy } = getCurrentInstance()
const formRef = ref()
const loading = ref(false)
const loadError = ref(false)
const form = ref({ id: 1, status: '0' })
const draft = useStudioDraft(proxy, props.module)
const canEdit = computed(() => checkPermi([`studio:${props.module}:edit`]))
const rules = computed(() => Object.fromEntries(props.config.fields.filter(field => field.required)
  .map(field => [field.key, [{ required: true, message: `${field.label}不能为空`, trigger: 'blur' }]])))
function cleanRecord(row) {
  return { id: 1, status: props.module === 'site' ? '0' : row.status,
    ...Object.fromEntries(props.config.fields.map(field => [field.key, row[field.key] || ''])) }
}
async function reload() {
  if (draft.busy.value || loading.value) return
  loading.value = true
  try {
    await draft.discard()
    const response = await getRecord(props.module, 1)
    form.value = cleanRecord(response.data)
    loadError.value = false
    formRef.value?.clearValidate()
  } catch { loadError.value = true }
  finally { loading.value = false }
}
async function save() {
  if (loading.value || loadError.value || draft.busy.value || !canEdit.value) return
  if (!await formRef.value.validate().catch(() => false)) return
  draft.saving.value = true
  try {
    await updateRecord(props.module, cleanRecord(form.value))
    await draft.saved(form.value)
    proxy.$modal.msgSuccess('保存成功')
  } catch { /* 保留表单和图片，允许修正后重试 */ }
  finally { draft.saving.value = false }
}
onActivated(() => { if (!loading.value) reload() })
reload()
</script>
<style scoped>
.studio-settings { max-width: 1100px; }
h2 { margin-top: 0; font-size: 22px; }
.settings-note { width: 100%; color: var(--el-text-color-secondary); font-size: 13px; line-height: 1.7; }
</style>
