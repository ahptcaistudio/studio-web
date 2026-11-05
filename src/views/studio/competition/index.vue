<template><StudioRecords module="competition" :config="config" /></template>
<script setup name="StudioCompetition">
import StudioRecords from '../shared/StudioRecords.vue'
const config = {
  "label": "竞赛记录",
  "fields": [
    {
      "key": "name",
      "label": "赛事名称",
      "max": 200,
      "required": true
    },
    {
      "key": "dateLabel",
      "label": "时间",
      "max": 50
    },
    {
      "key": "tier",
      "label": "赛事级别",
      "max": 100
    },
    {
      "key": "resultText",
      "label": "获奖结果",
      "max": 500
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
  "nameKey": "name",
  "nameLabel": "赛事名称",
  "columns": [
    {
      "key": "dateLabel",
      "label": "时间"
    },
    {
      "key": "tier",
      "label": "赛事级别"
    },
    {
      "key": "resultText",
      "label": "获奖结果"
    }
  ]
}
</script>
