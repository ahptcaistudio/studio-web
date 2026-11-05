<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" @submit.prevent="search">
      <el-form-item label="关键词"><el-input v-model="query[config.nameKey]" clearable :placeholder="`搜索${config.nameLabel}`" @keyup.enter="search" /></el-form-item>
      <el-form-item label="状态"><el-select v-model="query.status" clearable placeholder="全部" style="width: 130px"><el-option label="显示" value="0" /><el-option label="隐藏" value="1" /></el-select></el-form-item>
      <el-form-item><el-button type="primary" @click="search">搜索</el-button><el-button @click="resetQuery">重置</el-button></el-form-item>
    </el-form>
    <el-button v-hasPermi="[`studio:${module}:add`]" type="primary" plain icon="Plus" @click="add">新增{{ config.label }}</el-button>
    <el-table v-loading="loading" :data="rows" class="record-table">
      <el-table-column label="序号" type="index" width="70" />
      <el-table-column :label="config.nameLabel" :prop="config.nameKey" min-width="180" show-overflow-tooltip />
      <el-table-column v-for="column in config.columns" :key="column.key" :label="column.label" :prop="column.key" min-width="120" show-overflow-tooltip>
        <template #default="scope">{{ column.key === 'teamGroup' ? (scope.row.teamGroup === 'student' ? '学生团队' : '教学团队') : scope.row[column.key] }}</template>
      </el-table-column>
      <el-table-column label="排序" prop="sortNum" width="80" />
      <el-table-column label="状态" width="90"><template #default="scope"><el-tag :type="scope.row.status === '0' ? 'success' : 'info'">{{ scope.row.status === '0' ? '显示' : '隐藏' }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="155" fixed="right"><template #default="scope">
        <el-button v-if="checkPermi([`studio:${module}:query`]) && checkPermi([`studio:${module}:edit`])" link type="primary" @click="edit(scope.row)">修改</el-button>
        <el-button v-hasPermi="[`studio:${module}:remove`]" link type="danger" @click="remove(scope.row)">删除</el-button>
      </template></el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="query.pageNum" v-model:limit="query.pageSize" @pagination="load" />
    <el-dialog v-model="open" :title="`${form.id ? '修改' : '新增'}${config.label}`" width="min(900px, 94vw)" append-to-body destroy-on-close
      :close-on-click-modal="false" :close-on-press-escape="!draft.busy.value" :show-close="!draft.busy.value" @close="draft.discard">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <StudioFields :model="form" :fields="config.fields" :disabled="draft.busy.value || !canWrite" @uploaded="draft.track" @removed="draft.removed"
          @upload-start="draft.pending.value++" @upload-end="draft.pending.value = Math.max(0, draft.pending.value - 1)" />
        <el-row :gutter="20"><el-col :xs="24" :sm="12"><el-form-item label="排序"><el-input-number v-model="form.sortNum" :min="0" :max="9999" :disabled="draft.busy.value" /></el-form-item></el-col>
          <el-col :xs="24" :sm="12"><el-form-item label="展示状态"><el-radio-group v-model="form.status" :disabled="draft.busy.value"><el-radio value="0">显示</el-radio><el-radio value="1">隐藏</el-radio></el-radio-group></el-form-item></el-col></el-row>
      </el-form>
      <template #footer><el-button :disabled="draft.busy.value" @click="open = false">取消</el-button><el-button type="primary" :loading="draft.saving.value" :disabled="draft.pending.value > 0 || !canWrite" @click="save">保存</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { listRecords, getRecord, addRecord, updateRecord, deleteRecords } from '@/api/studio/modules'
import { useStudioDraft } from './useStudioDraft'
import { checkPermi } from '@/utils/permission'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import StudioFields from './StudioFields.vue'
const props = defineProps({ module: { type: String, required: true }, config: { type: Object, required: true } })
const { proxy } = getCurrentInstance()
const query = reactive({ pageNum: 1, pageSize: 10, status: '' })
const rows = ref([]), total = ref(0), loading = ref(false), open = ref(false), form = ref({}), formRef = ref()
const draft = useStudioDraft(proxy, props.module)
const canWrite = computed(() => checkPermi([`studio:${props.module}:${form.value.id ? 'edit' : 'add'}`]))
const rules = computed(() => Object.fromEntries(props.config.fields.filter(field => field.required)
  .map(field => [field.key, [{ required: true, message: `${field.label}不能为空`, trigger: ['blur', 'change'] }]])))
function record(row = {}) {
  return { id: row.id, status: row.status || '0', sortNum: row.sortNum ?? 0,
    ...Object.fromEntries(props.config.fields.map(field => [field.key, row[field.key] ?? field.default ?? ''])) }
}
async function load() {
  loading.value = true
  try { const result = await listRecords(props.module, { ...query }); rows.value = result.rows; total.value = result.total }
  catch { /* 使用统一请求错误提示 */ }
  finally { loading.value = false }
}
function search() { query.pageNum = 1; load() }
function resetQuery() { query[props.config.nameKey] = ''; query.status = ''; search() }
function add() { form.value = record(); open.value = true }
async function edit(row) {
  try { const result = await getRecord(props.module, row.id); form.value = record(result.data); open.value = true }
  catch { /* 不打开空表单 */ }
}
async function save() {
  if (draft.busy.value || !canWrite.value || !await formRef.value.validate().catch(() => false)) return
  draft.saving.value = true
  try {
    const body = record(form.value)
    await (body.id ? updateRecord(props.module, body) : addRecord(props.module, body))
    await draft.saved(body)
    open.value = false
    proxy.$modal.msgSuccess('保存成功')
    load()
  } catch { /* 保存失败保留内容和图片 */ }
  finally { draft.saving.value = false }
}
async function remove(row) {
  try {
    await proxy.$modal.confirm(`确认删除${props.config.label}“${row[props.config.nameKey]}”？`)
    await deleteRecords(props.module, [row.id])
    proxy.$modal.msgSuccess('删除成功')
    if (rows.value.length === 1 && query.pageNum > 1) query.pageNum--
    load()
  } catch { /* 取消或删除失败，不改变页面数据 */ }
}
function closeDraft() {
  if (!draft.busy.value) { open.value = false; form.value = {} }
}
onBeforeRouteLeave(closeDraft)
onBeforeRouteUpdate(closeDraft)
onDeactivated(closeDraft)
onActivated(() => { if (!loading.value) load() })
load()
</script>
<style scoped>.record-table { margin-top: 16px; }</style>
