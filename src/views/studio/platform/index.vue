<template><StudioRecords module="platform" :config="config" /></template>
<script setup name="StudioPlatform">
import StudioRecords from '../shared/StudioRecords.vue'
const config = {
  "label": "平台设施",
  "fields": [
    {
      "key": "title",
      "label": "平台名称",
      "max": 200,
      "required": true
    },
    {
      "key": "category",
      "label": "平台分类",
      "max": 100
    },
    {
      "key": "description",
      "label": "平台介绍",
      "max": 2000,
      "type": "textarea",
      "wide": true
    },
    {
      "key": "detailOneLabel",
      "label": "详情一标签",
      "max": 50
    },
    {
      "key": "detailOneValue",
      "label": "详情一内容",
      "max": 200
    },
    {
      "key": "detailTwoLabel",
      "label": "详情二标签",
      "max": 50
    },
    {
      "key": "detailTwoValue",
      "label": "详情二内容",
      "max": 200
    },
    {
      "key": "imageUrl",
      "label": "展示图片",
      "max": 500,
      "type": "image",
      "wide": true
    },
    {
      "key": "imageAlt",
      "label": "图片说明",
      "max": 200
    }
  ],
  "nameKey": "title",
  "nameLabel": "平台名称",
  "columns": [
    {
      "key": "category",
      "label": "平台分类"
    }
  ]
}
</script>
