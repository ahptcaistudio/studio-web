<template><StudioSettings module="project" :config="config" /></template>
<script setup name="StudioProject">
import StudioSettings from '../shared/StudioSettings.vue'
const config = {
  "label": "企业项目",
  "fields": [
    {
      "key": "title",
      "label": "项目标题",
      "max": 200,
      "required": true
    },
    {
      "key": "englishName",
      "label": "项目英文名称",
      "max": 200
    },
    {
      "key": "label",
      "label": "项目标签",
      "max": 100
    },
    {
      "key": "description",
      "label": "项目介绍与合作理念",
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
      "label": "项目图片",
      "max": 500,
      "type": "image",
      "wide": true
    },
    {
      "key": "imageAlt",
      "label": "项目图片说明",
      "max": 200
    }
  ],
  "note": "独立维护企业级 AI 项目介绍与合作理念，可整体显示或隐藏。不与首屏共用内容。"
}
</script>
