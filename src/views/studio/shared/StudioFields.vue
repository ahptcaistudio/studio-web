<template>
  <el-row :gutter="20">
    <el-col v-for="field in fields" :key="field.key" :xs="24" :sm="field.wide ? 24 : 12">
      <el-form-item :label="field.label" :prop="field.key">
        <image-upload v-if="field.type === 'image'" v-model="model[field.key]" :limit="1" :disabled="disabled" :upload-label="`上传${field.label}`"
          :file-type="field.fileTypes || ['png', 'jpg', 'jpeg']" :action="field.uploadAction || '/system/studio/images/upload'"
          :data="{ module: module || field.module }"
          @uploaded="$emit('uploaded', $event)" @removed="$emit('removed', $event)"
          @upload-start="$emit('upload-start')" @upload-end="$emit('upload-end')" />
        <el-select v-else-if="field.options" v-model="model[field.key]" :disabled="disabled" style="width: 100%">
          <el-option v-for="option in field.options" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
        <el-input v-else v-model="model[field.key]" :type="field.type === 'textarea' ? 'textarea' : 'text'"
          :rows="4" :maxlength="field.max || 200" show-word-limit :disabled="disabled" />
        <div v-if="field.help" class="field-help">{{ field.help }}</div>
      </el-form-item>
    </el-col>
  </el-row>
</template>
<script setup>
defineProps({ model: { type: Object, required: true }, fields: { type: Array, required: true }, disabled: Boolean, module: String })
defineEmits(['uploaded', 'removed', 'upload-start', 'upload-end'])
</script>
<style scoped>
.field-help { width: 100%; margin-top: 6px; color: var(--el-text-color-secondary); font-size: 12px; line-height: 1.6; }
</style>
