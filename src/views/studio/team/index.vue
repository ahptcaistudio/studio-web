<template><StudioRecords module="team" :config="config" /></template>
<script setup name="StudioMember">
import StudioRecords from '../shared/StudioRecords.vue'
const config = {
  "label": "团队成员",
  "fields": [
    {
      "key": "name",
      "label": "成员姓名",
      "max": 200,
      "required": true
    },
    {
      "key": "role",
      "label": "成员角色",
      "max": 200
    },
    {
      "key": "teamGroup",
      "label": "团队分组",
      "max": 20,
      "required": true,
      "options": [
        {
          "label": "教学团队",
          "value": "teacher"
        },
        {
          "label": "学生团队",
          "value": "student"
        }
      ],
      "default": "teacher"
    },
    {
      "key": "focus",
      "label": "研究方向",
      "max": 500,
      "wide": true
    },
    {
      "key": "imageUrl",
      "label": "成员照片",
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
  "nameLabel": "成员姓名",
  "columns": [
    {
      "key": "role",
      "label": "成员角色"
    },
    {
      "key": "teamGroup",
      "label": "团队分组"
    }
  ]
}
</script>
