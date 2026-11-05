<template><StudioRecords module="award" :config="config" /></template>
<script setup name="StudioResearch">
import StudioRecords from '../shared/StudioRecords.vue'
const config = {
  "label": "教研成果",
  "fields": [
    {
      "key": "title",
      "label": "成果名称",
      "max": 200,
      "required": true
    },
    {
      "key": "category",
      "label": "成果类型",
      "max": 100
    },
    {
      "key": "description",
      "label": "成果介绍",
      "max": 2000,
      "type": "textarea",
      "wide": true
    }
  ],
  "nameKey": "title",
  "nameLabel": "成果名称",
  "columns": [
    {
      "key": "category",
      "label": "成果类型"
    }
  ]
}
</script>
