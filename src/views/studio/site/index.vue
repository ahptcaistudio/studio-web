<template><StudioSettings module="site" :config="config" /></template>
<script setup name="StudioSite">
import StudioSettings from '../shared/StudioSettings.vue'
const config = {
  "label": "基础设置",
  "fields": [
    {
      "key": "schoolName",
      "label": "学校名称",
      "max": 200,
      "required": true
    },
    {
      "key": "studioName",
      "label": "工作室名称",
      "max": 200,
      "required": true
    },
    {
      "key": "englishName",
      "label": "英文名称",
      "max": 200
    },
    {
      "key": "kicker",
      "label": "首屏小标题",
      "max": 200
    },
    {
      "key": "intro",
      "label": "首屏介绍",
      "max": 2000,
      "type": "textarea",
      "wide": true
    },
    {
      "key": "prompt",
      "label": "Prompt",
      "max": 500,
      "wide": true
    },
    {
      "key": "contextText",
      "label": "Context",
      "max": 500,
      "wide": true
    },
    {
      "key": "outputText",
      "label": "Output",
      "max": 500,
      "wide": true
    },
    {
      "key": "heroImageUrl",
      "label": "首屏图片",
      "max": 500,
      "type": "image",
      "wide": true
    },
    {
      "key": "heroImageAlt",
      "label": "首屏图片说明",
      "max": 200
    },
    {
      "key": "logoUrl",
      "label": "网站图标",
      "fileTypes": ["svg"],
      "uploadAction": "/system/studio/images/upload-icon",
      "max": 500,
      "type": "image",
      "wide": true,
      "help": "同时用于前台左上角和浏览器标签页。仅支持 SVG，建议使用正方形纯矢量图标，留空使用默认图标。"
    }
  ],
  "note": "维护学校、工作室名称、首屏文案和网站图标。固定配置无需新增、排序或删除。"
}
</script>
