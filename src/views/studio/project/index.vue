<template><StudioRecords module="project" :config="config" /></template>
<script setup name="StudioProject">
import StudioRecords from '../shared/StudioRecords.vue'

const config = {
  label: '企业合作资讯',
  nameKey: 'title',
  nameLabel: '资讯标题',
  fields: [
    { key: 'title', label: '资讯标题', max: 200, required: true },
    { key: 'partner', label: '合作单位', max: 200 },
    { key: 'dateLabel', label: '发布日期', max: 50, help: '建议使用 YYYY-MM-DD，例如 2026-11-09。' },
    { key: 'label', label: '资讯分类', max: 100 },
    { key: 'description', label: '资讯正文', max: 2000, type: 'textarea', wide: true, help: '前台列表自动截取开头作为摘要，点击标题可查看完整正文。' },
    { key: 'imageUrl', label: '资讯配图', type: 'image', wide: true },
    { key: 'imageAlt', label: '图片说明', max: 200 }
  ],
  columns: [
    { key: 'partner', label: '合作单位' },
    { key: 'dateLabel', label: '发布日期' },
    { key: 'label', label: '资讯分类' }
  ]
}
</script>
