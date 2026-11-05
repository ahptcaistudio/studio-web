<template>
  <div ref="pageRef" class="studio-page">
    <div class="studio-shell">
      <header class="masthead">
        <a class="site-identity" href="#top" aria-label="返回工作室首页" @click="closeMenu">
          <img class="site-icon" :src="studioIconUrl" width="36" height="36" alt="" aria-hidden="true" @error="logoFailed = true">
          <span class="site-copy">
            <strong>{{ studio.site.schoolName }}</strong>
            <small>{{ studio.site.department }}</small>
          </span>
        </a>

        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="studio-navigation"
          aria-label="打开页面导航"
          @click="menuOpen = !menuOpen"
        >
          <span></span>
          <span></span>
        </button>

        <nav id="studio-navigation" class="nav" :class="{ 'is-open': menuOpen }" aria-label="页面导航">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            :aria-current="activeSection === item.id ? 'location' : undefined"
            @click="closeMenu"
          >{{ item.label }}</a>
          <a class="nav-admin" href="/admin" @click="closeMenu">管理入口 <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="top">
        <div v-if="loadState !== 'ready'" class="load-notice" :class="{ 'load-notice-error': loadState === 'error' }"
          role="status" aria-live="polite">
          <span>{{ loadState === 'loading' ? '正在加载工作室内容…' : '未能获取工作室最新内容，团队成员、竞赛记录、教研成果、企业项目和平台设施暂时无法展示。请检查网络连接，点击“重新加载”再试一次；如果仍无法加载，请稍后重试或联系网站管理员。' }}</span>
          <button v-if="loadState === 'error'" type="button" @click="loadStudio">重新加载</button>
        </div>
        <section class="hero reveal" aria-labelledby="hero-title">
          <div class="hero-copy">
            <p class="kicker">
              <span class="kicker-line" aria-hidden="true"></span>
              {{ studio.hero.kicker }}
            </p>
            <h1 id="hero-title" class="hero-title">
              <span v-for="(line, index) in studio.hero.titleLines" :key="line">{{ line }}<i v-if="index === studio.hero.titleLines.length - 1" aria-hidden="true">.</i></span>
            </h1>
            <p class="hero-lede">{{ studio.hero.intro }}</p>

            <div class="io-block" role="figure" aria-label="工作室使命">
              <div class="io-line">
                <span class="io-key">prompt</span>
                <span class="io-value">{{ studio.hero.prompt }}</span>
              </div>
              <div class="io-line">
                <span class="io-key">context</span>
                <span class="io-value">{{ studio.hero.context }}</span>
              </div>
              <div class="io-line">
                <span class="io-key">output</span>
                <span class="io-value">{{ studio.hero.output }}<b class="cursor" aria-hidden="true">▍</b></span>
              </div>
            </div>
          </div>

          <aside class="hero-rail" aria-hidden="true">
            <p>{{ studio.hero.railText }}</p>
          </aside>

          <figure v-if="mediaUrl('hero')" class="media-figure hero-figure">
            <button type="button" class="media-frame media-frame-wide media-preview-trigger" :aria-label="`查看大图：${mediaAlt('hero', '工作室展示图')}`" @click="openMediaPreview('hero')">
              <img
                :src="mediaUrl('hero')"
                :alt="mediaAlt('hero', '人工智能工作室首屏展示图')"
                loading="eager" decoding="async" fetchpriority="high"
                @error="markMediaError('hero')"
              />
            </button>
            <figcaption class="media-caption">
              <span>{{ mediaTitle('hero', '工作室全景 · Overview') }}</span>
            </figcaption>
          </figure>
          <figure v-else class="media-figure hero-figure">
            <div class="media-frame media-frame-wide media-empty-frame" role="img" :aria-label="heroImagePlaceholder">
              <span>{{ heroImagePlaceholder }}</span>
            </div>
            <figcaption class="media-caption">
              <span>{{ mediaTitle('hero', '工作室全景 · Overview') }}</span>
            </figcaption>
          </figure>
        </section>

        <template v-if="loadState === 'ready'">
        <section class="stats reveal" aria-label="工作室关键数据">
          <article v-for="stat in studio.stats" :key="stat.id || stat.label" class="stat-item">
            <strong>{{ stat.value || '待补充' }}<small v-if="stat.unit">{{ stat.unit }}</small></strong>
            <span>{{ stat.label }}</span>
          </article>
        </section>

        <section id="team" class="content-section reveal" aria-labelledby="team-title">
          <header class="section-head">
            <div class="section-title">
              <span class="section-square" aria-hidden="true"></span>
              <h2 id="team-title">团队成员</h2>
            </div>
            <span class="section-en">Teaching &amp; Student Teams</span>
          </header>

          <div v-for="group in teamGroups" :key="group.key" class="team-group">
            <header class="team-group-head">
              <div class="team-group-title">
                <span class="team-group-rule" aria-hidden="true"></span>
                <h3>{{ group.title }}</h3>
              </div>
              <span class="team-group-en">{{ group.englishTitle }}</span>
            </header>

            <div v-if="group.members.length" class="roster">
              <article v-for="member in group.members" :key="member.id || member.name" class="member-card">
                <div class="member-card-layout">
                  <button v-if="memberImageUrl(member)" type="button" class="member-photo media-preview-trigger" :aria-label="`查看${member.name}的照片`" @click="openPreview(memberImageUrl(member), memberImageAlt(member))">
                    <img
                      :src="memberImageUrl(member)"
                      :alt="memberImageAlt(member)"
                      loading="lazy" decoding="async"
                      @error="markMediaError(memberMediaKey(member))"
                    />
                  </button>
                  <div v-else class="member-photo member-photo-empty" role="img" :aria-label="missingImageLabel(memberMediaKey(member), '照片待补充')">
                    <span>{{ missingImageLabel(memberMediaKey(member), '照片待补充') }}</span>
                  </div>

                  <div class="member-card-copy">
                    <div class="member-top">
                      <h4>{{ member.name }}</h4>
                    </div>
                    <p class="member-role">{{ member.role || '成员资料待补充' }}</p>
                    <p class="member-focus"><span>研究方向</span>{{ member.focus || '待补充' }}</p>
                  </div>
                </div>
              </article>
            </div>
            <p v-else class="team-empty-note">{{ group.title }}资料待补充</p>
          </div>
        </section>

        <section id="comp" class="content-section reveal" aria-labelledby="competition-title">
          <header class="section-head">
            <div class="section-title">
              <span class="section-square" aria-hidden="true"></span>
              <h2 id="competition-title">近期竞赛</h2>
            </div>
            <span class="section-en">Competition Records</span>
          </header>

          <div v-if="studio.competitions.length" class="competition-table competition-desktop" role="table" aria-label="近期学生竞赛获奖记录">
            <div class="competition-row competition-head" role="row">
              <span role="columnheader">时间</span>
              <span role="columnheader">赛事</span>
              <span role="columnheader">级别</span>
              <span role="columnheader">获奖</span>
            </div>
            <div v-for="record in studio.competitions" :key="record.id || record.name" class="competition-row" role="row">
              <span role="cell" class="competition-date">{{ record.date || '待补充' }}</span>
              <span role="cell" class="competition-name">{{ record.name }}</span>
              <span role="cell" class="competition-tier">{{ record.tier || '待补充' }}</span>
              <span role="cell" class="competition-result">{{ record.result || '待补充' }}</span>
            </div>
          </div>
          <div v-if="studio.competitions.length" class="competition-cards">
            <article v-for="record in studio.competitions" :key="record.id || record.name" class="competition-card">
              <p class="competition-card-date">{{ record.date || '时间待补充' }}</p>
              <h3>{{ record.name }}</h3>
              <dl>
                <div><dt>赛事级别</dt><dd>{{ record.tier || '待补充' }}</dd></div>
                <div><dt>获奖结果</dt><dd>{{ record.result || '待补充' }}</dd></div>
              </dl>
            </article>
          </div>
          <div v-else class="empty-note">
            <span class="empty-note-mark" aria-hidden="true">赛</span>
            <div>
              <strong>竞赛记录待补充</strong>
              <p>公开成果将由工作室管理员在后台发布。</p>
            </div>
          </div>

          <figure v-if="mediaUrl('competition')" class="media-figure competition-figure">
            <button type="button" class="media-frame media-frame-wide media-preview-trigger" :aria-label="`查看大图：${mediaAlt('competition', '竞赛照片')}`" @click="openMediaPreview('competition')">
              <img
                :src="mediaUrl('competition')"
                :alt="mediaAlt('competition', '工作室竞赛活动照片')"
                loading="lazy" decoding="async"
                @error="markMediaError('competition')"
              />
            </button>
            <figcaption class="media-caption">
              <span>{{ mediaTitle('competition', '竞赛高光时刻 · Competition') }}</span>
            </figcaption>
          </figure>
          <figure v-else class="media-figure competition-figure">
            <div class="media-frame media-frame-wide media-empty-frame" role="img" :aria-label="missingImageLabel('competition', '竞赛图片待补充')">
              <span>{{ missingImageLabel('competition', '竞赛图片待补充') }}</span>
            </div>
            <figcaption class="media-caption">
              <span>{{ mediaTitle('competition', '竞赛高光时刻 · Competition') }}</span>
            </figcaption>
          </figure>
        </section>

        <section id="award" class="content-section reveal" aria-labelledby="award-title">
          <header class="section-head">
            <div class="section-title">
              <span class="section-square" aria-hidden="true"></span>
              <h2 id="award-title">教研成果</h2>
            </div>
            <span class="section-en">Research &amp; Awards</span>
          </header>

          <div v-if="studio.awards.length" class="award-grid">
            <article v-for="award in studio.awards" :key="award.id || award.title" class="award-card">
              <p class="award-type">{{ award.type || '成果资料' }}</p>
              <h3>{{ award.title }}</h3>
              <p>{{ award.description || '成果介绍待补充。' }}</p>
            </article>
          </div>
          <div v-else class="empty-note">
            <span class="empty-note-mark" aria-hidden="true">研</span>
            <div>
              <strong>教研成果待补充</strong>
              <p>教学改革、科研项目和荣誉信息将在后台维护后展示。</p>
            </div>
          </div>
        </section>

        <section id="project" class="content-section reveal" aria-labelledby="project-title">
          <header class="section-head">
            <div class="section-title">
              <span class="section-square" aria-hidden="true"></span>
              <h2 id="project-title">企业项目与平台</h2>
            </div>
            <span class="section-en">Enterprise Projects &amp; Platforms</span>
          </header>

          <article v-if="studio.project.visible" class="project-band" :class="{ 'without-media': !mediaUrl('project') }">
            <div class="project-band-copy">
              <span class="band-accent" aria-hidden="true"></span>
              <p class="band-label">{{ studio.project.label }}</p>
              <h3>{{ studio.project.title }}<small>{{ studio.project.englishTitle }}</small></h3>
              <p class="band-description">{{ studio.project.description }}</p>
              <dl v-if="studio.project.details.length" class="band-details">
                <div v-for="detail in studio.project.details" :key="detail.label">
                  <dt>{{ detail.label }}</dt>
                  <dd>{{ detail.value || '待补充' }}</dd>
                </div>
              </dl>
            </div>
            <figure v-if="mediaUrl('project')" class="media-figure project-figure">
              <button type="button" class="media-frame media-frame-portrait media-preview-trigger" :aria-label="`查看大图：${mediaAlt('project', '企业项目展示图')}`" @click="openMediaPreview('project')">
                <img
                  :src="mediaUrl('project')"
                  :alt="mediaAlt('project', '企业级 AI 项目展示图')"
                  loading="lazy" decoding="async"
                  @error="markMediaError('project')"
                />
              </button>
              <figcaption class="media-caption">
                <span>{{ mediaTitle('project', '企业项目 · Enterprise Projects') }}</span>
              </figcaption>
            </figure>
            <figure v-else class="media-figure project-figure">
              <div class="media-frame media-frame-portrait media-empty-frame" role="img" :aria-label="missingImageLabel('project', '企业项目图片待补充')">
                <span>{{ missingImageLabel('project', '企业项目图片待补充') }}</span>
              </div>
              <figcaption class="media-caption">
                <span>{{ mediaTitle('project', '企业项目 · Enterprise Projects') }}</span>
              </figcaption>
            </figure>
          </article>

          <div v-if="studio.platforms.length" class="platform-grid">
            <article v-for="(platform, index) in studio.platforms" :key="platform.id || platform.title" class="platform-card">
              <figure v-if="mediaUrl(platform.mediaKey || `platform-${index}`)" class="media-figure">
                <button type="button" class="media-frame media-frame-platform media-preview-trigger" :aria-label="`查看${platform.title}大图`" @click="openMediaPreview(platform.mediaKey || `platform-${index}`)">
                  <img
                    :src="mediaUrl(platform.mediaKey || `platform-${index}`)"
                    :alt="mediaAlt(platform.mediaKey || `platform-${index}`, `${platform.title}展示图`)"
                    loading="lazy" decoding="async"
                    @error="markMediaError(platform.mediaKey || `platform-${index}`)"
                  />
                </button>
                <figcaption class="media-caption">
                  <span>{{ platform.imageTitle || platform.title }}</span>
                </figcaption>
              </figure>
              <figure v-else class="media-figure">
                <div class="media-frame media-frame-platform media-empty-frame" role="img" :aria-label="missingImageLabel(platform.mediaKey || `platform-${index}`, '图片待补充')">
                  <span>{{ missingImageLabel(platform.mediaKey || `platform-${index}`, '图片待补充') }}</span>
                </div>
                <figcaption class="media-caption">
                  <span>{{ platform.imageTitle || platform.title }}</span>
                </figcaption>
              </figure>
              <p class="platform-label">{{ platform.label || '开放平台' }}</p>
              <h3>{{ platform.title }}</h3>
              <p>{{ platform.description || '平台介绍待补充。' }}</p>
              <div v-if="platform.details?.length" class="platform-details">
                <span v-for="detail in platform.details" :key="detail.label"><b>{{ detail.label }}</b>{{ detail.value || '待补充' }}</span>
              </div>
            </article>
          </div>
        </section>
        </template>
        <div v-else-if="loadState === 'loading'" class="content-loading" aria-hidden="true">
          <div v-for="item in 4" :key="item" class="content-loading-block"><span></span><span></span><span></span></div>
        </div>
      </main>

      <footer class="footer">
        <p>© {{ currentYear }} {{ studio.site.schoolName }} · {{ studio.site.department }}</p>
        <a href="#top" aria-label="返回顶部">{{ studio.site.englishName }} <span aria-hidden="true">↑</span></a>
      </footer>
    </div>
    <el-dialog v-model="previewOpen" :title="previewAlt" width="min(92vw, 1100px)" append-to-body destroy-on-close class="studio-image-dialog">
      <p v-if="previewError" role="status">图片暂时无法加载，请关闭后重试。</p>
      <img v-else :src="previewUrl" :alt="previewAlt" class="studio-preview-image" decoding="async" @error="previewError = true" />
    </el-dialog>
  </div>
</template>

<script setup name="StudioFront">
import { getPublicStudio } from '@/api/front/studio'

const defaultStudioIconUrl = `${import.meta.env.BASE_URL}favicon.svg?v=2`
const logoFailed = ref(false)
const faviconLink = document.querySelector('link[rel="icon"]')
const originalFavicon = faviconLink?.getAttribute('href')
const originalFaviconType = faviconLink?.getAttribute('type')

const navItems = [
  { id: 'team', label: '团队', href: '#team' },
  { id: 'comp', label: '竞赛', href: '#comp' },
  { id: 'award', label: '教研', href: '#award' },
  { id: 'project', label: '项目与平台', href: '#project' }
]

const pageRef = ref(null)
const menuOpen = ref(false)
const activeSection = ref('team')
const mediaErrors = reactive({})
const loadState = ref('loading')
const previewOpen = ref(false)
const previewUrl = ref('')
const previewAlt = ref('图片预览')
const previewError = ref(false)
const heroImagePlaceholder = computed(() => loadState.value === 'loading' ? '图片加载中…'
  : loadState.value === 'error' ? '图片暂时无法加载' : missingImageLabel('hero', '首屏图片待补充'))
let loadController
const currentYear = new Date().getFullYear()
let revealObserver
let sectionObserver

function createFallbackStudio() {
  return {
    site: {
      schoolName: '安徽邮电职业技术学院',
      department: '人工智能工作室',
      englishName: 'AI INNOVATION STUDIO'
    },
    hero: {
      kicker: 'AI INNOVATION STUDIO',
      titleLines: ['人工智能', '工作室'],
      intro: '面向人工智能技术学习、实践与创新的开放展示空间。以真实问题为线索，记录教学、竞赛、教研与实践的持续发生。',
      prompt: '如何让人工智能成为学习与创造的伙伴？',
      context: '人工智能技术 · 智能体 · 多模态实践',
      output: '以赛促学 · 以研促教 · 真问题驱动 · 真代码交付',
      railText: '以赛促学 · 以研促教 · 真问题驱动 · 真代码交付'
    },
    stats: [
      { id: 'teachers', value: '待补充', unit: '', label: '核心教师' },
      { id: 'students', value: '待补充', unit: '', label: '学生成员' },
      { id: 'competitions', value: '待补充', unit: '', label: '竞赛成果' },
      { id: 'research', value: '待补充', unit: '', label: '教研成果' }
    ],
    team: [],
    competitions: [],
    awards: [],
    project: {
      visible: false,
      label: '企业级 AI 项目 · Enterprise AI',
      title: '企业级 AI 项目',
      englishTitle: 'Enterprise AI Projects',
      description: '以「真问题驱动、真代码交付」为核心理念，面向企业真实业务场景承接企业级 AI 项目，围绕需求分析、方案设计、工程实现与部署交付开展合作。',
      details: []
    },
    platforms: [
      {
        id: 'practice',
        label: '专业实践平台',
        title: 'AI 实验与实践平台',
        description: '围绕人工智能课程实践、项目训练和创新活动建设的开放平台，具体设施与开放信息待后台发布。',
        details: [
          { label: '位置', value: '待补充' },
          { label: '开放', value: '待补充' }
        ],
        mediaKey: 'platform-0',
        imageTitle: '实践平台 · Practice'
      },
      {
        id: 'partner',
        label: '合作平台',
        title: '校企协同基地',
        description: '连接学校、教师、学生与行业实践的协同空间，合作单位与项目内容待后台发布。',
        details: [
          { label: '合作单位', value: '待补充' },
          { label: '联合项目', value: '待补充' }
        ],
        mediaKey: 'platform-1',
        imageTitle: '协同基地 · Partner'
      }
    ],
    media: {}
  }
}

const studio = ref(createFallbackStudio())

const studioIconUrl = computed(() => !logoFailed.value && resolveImageUrl(studio.value.site.logoUrl)
  || defaultStudioIconUrl)

watch(() => studio.value.site.logoUrl, () => { logoFailed.value = false })
watch(studioIconUrl, url => {
  if (!faviconLink) return
  faviconLink.setAttribute('href', url)
  faviconLink.removeAttribute('type')
}, { immediate: true })

const teamGroups = computed(() => [
  { key: 'teacher', title: '教学团队', englishTitle: 'Teaching Team' },
  { key: 'student', title: '学生团队', englishTitle: 'Student Team' }
].map(group => ({
  ...group,
  members: studio.value.team.filter(member => teamGroupKey(member) === group.key)
})))

function normalizeStudio(payload = {}) {
  const fallback = createFallbackStudio()
  return {
    ...fallback,
    ...payload,
    site: { ...fallback.site, ...(payload.site || {}) },
    hero: { ...fallback.hero, ...(payload.hero || {}) },
    stats: Array.isArray(payload.stats) ? payload.stats : fallback.stats,
    team: normalizeTeam(payload.team),
    competitions: Array.isArray(payload.competitions) ? payload.competitions : fallback.competitions,
    awards: Array.isArray(payload.awards) ? payload.awards : fallback.awards,
    project: {
      ...fallback.project,
      ...(payload.project || {}),
      details: Array.isArray(payload.project?.details) ? payload.project.details : fallback.project.details
    },
    platforms: Array.isArray(payload.platforms) ? payload.platforms : fallback.platforms,
    media: payload.media || fallback.media
  }
}

function normalizeTeam(members) {
  const list = Array.isArray(members) ? members : []
  return list.map(member => ({
    ...member,
    group: teamGroupKey(member)
  }))
}

function teamGroupKey(member) {
  return member?.group === 'student' || member?.teamGroup === 'student' ? 'student' : 'teacher'
}

async function loadStudio() {
  loadController?.abort()
  const controller = new AbortController()
  loadController = controller
  loadState.value = 'loading'
  try {
    const response = await getPublicStudio(controller.signal)
    if (controller.signal.aborted) return
    studio.value = normalizeStudio(response.data)
    Object.keys(mediaErrors).forEach(key => delete mediaErrors[key])
    loadState.value = 'ready'
    await nextTick()
    observeSections()
  } catch {
    if (!controller.signal.aborted) loadState.value = 'error'
  }
}

function openPreview(url, alt) {
  if (!url) return
  previewUrl.value = url
  previewAlt.value = alt || '图片预览'
  previewError.value = false
  previewOpen.value = true
}

function openMediaPreview(key) {
  openPreview(mediaUrl(key), mediaAlt(key, mediaTitle(key, '工作室图片')))
}

function mediaUrl(key) {
  if (mediaErrors[key]) return ''
  const media = studio.value.media?.[key]
  if (typeof media === 'string') return resolveImageUrl(media)
  return resolveImageUrl(media?.url || media?.imageUrl || '')
}

function mediaAlt(key, fallback) {
  const media = studio.value.media?.[key]
  return media?.alt || media?.imageAlt || fallback
}

function mediaTitle(key, fallback) {
  const media = studio.value.media?.[key]
  return media?.title || fallback
}

function memberMediaKey(member) {
  return `team-member-${member.id || member.name || member.index || 'unknown'}`
}

function memberImageUrl(member) {
  if (!member?.imageUrl || mediaErrors[memberMediaKey(member)]) return ''
  return resolveImageUrl(member.imageUrl)
}

function memberImageAlt(member) {
  return member?.imageAlt || `${member?.name || '团队成员'}照片`
}

function resolveImageUrl(value) {
  if (!value || typeof value !== 'string') return ''
  const url = value.trim()
  if (/^(https?:|data:|blob:|\/\/)/.test(url)) return url

  const baseUrl = (import.meta.env.VITE_APP_BASE_API || '').replace(/\/$/, '')
  if (!baseUrl || url === baseUrl || url.startsWith(`${baseUrl}/`)) return url
  return `${baseUrl}/${url.replace(/^\/+/, '')}`
}

function markMediaError(key) {
  mediaErrors[key] = true
}

function missingImageLabel(key, fallback) {
  return mediaErrors[key] ? '图片加载失败' : fallback
}

function closeMenu() {
  menuOpen.value = false
}

function observeSections() {
  if (!revealObserver) {
    pageRef.value?.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'))
    return
  }
  pageRef.value?.querySelectorAll('.reveal:not(.is-visible)').forEach(element => revealObserver.observe(element))
  pageRef.value?.querySelectorAll('main section[id]').forEach(element => sectionObserver.observe(element))
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    loadStudio()
    observeSections()
    return
  }
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0 })

  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
  }, { rootMargin: '-18% 0px -62% 0px', threshold: 0 })

  observeSections()
  loadStudio()
})

onUnmounted(() => {
  if (faviconLink) {
    faviconLink.setAttribute('href', originalFavicon || defaultStudioIconUrl)
    if (originalFaviconType) faviconLink.setAttribute('type', originalFaviconType)
    else faviconLink.removeAttribute('type')
  }
  loadController?.abort()
  revealObserver?.disconnect()
  sectionObserver?.disconnect()
})
</script>

<style scoped lang="scss">
@use "../../assets/styles/studio-theme" as theme;

:global(.studio-image-dialog) {
  @include theme.tokens;
}

:global(html) {
  scroll-behavior: smooth;
  background: theme.$paper;
}

:global(body) {
  margin: 0;
  background: theme.$paper;
}

:global(*) {
  box-sizing: border-box;
}

.studio-page :focus-visible {
  outline: 2px solid var(--cobalt);
  outline-offset: 4px;
}

.studio-page {
  @include theme.tokens;
  // 使用本机字体，无字体网络请求或下载后的排版跳变。
  --sans: "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif;
  --serif: var(--sans);
  --serif-en: Georgia, "Times New Roman", serif;
  --mono: "Cascadia Code", "SFMono-Regular", Consolas, var(--sans), monospace;
  min-height: 100vh;
  overflow: hidden;
  color: var(--ink);
  background: var(--paper);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.85;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.studio-shell {
  width: min(100%, 1500px);
  margin: 0 auto;
  padding: 0 64px;
}

.masthead {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0 20px;
  border-bottom: 1px solid var(--hair);
  background: var(--paper-translucent);
  backdrop-filter: blur(14px);
}

.site-identity {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 13px;
  color: inherit;
  text-decoration: none;
}

.site-icon {
  display: block;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  object-fit: contain;
}

.site-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1.35;
}

.site-copy strong {
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.11em;
}

.site-copy small {
  color: var(--slate);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav a {
  position: relative;
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  color: var(--slate);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-decoration: none;
  transition: color 180ms ease;
}

.nav a::after {
  position: absolute;
  right: 0.2em;
  bottom: 7px;
  left: 0;
  height: 1px;
  content: "";
  background: var(--cobalt);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 180ms ease;
}

.nav a:hover,
.nav a[aria-current="location"] {
  color: var(--cobalt);
}

.nav a:hover::after,
.nav a[aria-current="location"]::after {
  transform: scaleX(1);
  transform-origin: left;
}

.nav .nav-admin {
  gap: 8px;
  margin-left: 8px;
  padding: 0 13px;
  border: 1px solid var(--hair);
  color: var(--ink);
  letter-spacing: 0.08em;
}

.nav .nav-admin::after {
  display: none;
}

.nav .nav-admin:hover {
  border-color: var(--cobalt);
  color: var(--cobalt);
}

.menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  border: 1px solid var(--hair);
  color: var(--ink);
  background: transparent;
}

.menu-toggle span {
  width: 17px;
  height: 1px;
  background: currentColor;
}

main {
  display: block;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  gap: 0 32px;
  align-items: stretch;
  padding: 90px 0 72px;
}

.hero-copy {
  min-width: 0;
}

.kicker {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 28px;
  color: var(--cobalt);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.kicker-line {
  display: inline-block;
  width: 34px;
  height: 1px;
  background: var(--cobalt);
}

.hero-title {
  max-width: 840px;
  margin: 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: clamp(48px, 7vw, 92px);
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.hero-title span {
  display: block;
}

.hero-title i {
  color: var(--cobalt);
  font-family: var(--serif-en);
  font-style: normal;
}

.hero-lede {
  max-width: 690px;
  margin: 30px 0 0;
  color: var(--slate);
  font-size: 16px;
  line-height: 2;
}

.io-block {
  max-width: 740px;
  margin-top: 44px;
  border-top: 1px solid var(--hair);
  border-bottom: 1px solid var(--hair);
}

.io-line {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 16px;
  align-items: baseline;
  min-height: 54px;
  padding: 14px 0;
  border-bottom: 1px solid var(--hair);
}

.io-line:last-child {
  border-bottom: 0;
}

.io-key {
  color: var(--cobalt);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
}

.io-value {
  color: var(--ink);
  font-family: var(--serif);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.cursor {
  display: inline-block;
  margin-left: 5px;
  color: var(--cobalt);
  animation: cursor-blink 1.2s steps(2, jump-none) infinite;
}

.hero-rail {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 28px;
  padding: 0 0 0 32px;
  margin: 0;
  border-radius: 0;
  border-left: 1px solid var(--hair);
  background: transparent;
}

.hero-rail p {
  margin: 0;
  color: var(--slate);
  font-family: var(--serif);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.34em;
  line-height: 2.2;
  writing-mode: vertical-rl;
}

.media-figure {
  margin: 0;
}

.hero-figure {
  grid-column: 1 / -1;
  margin-top: 60px;
}

.media-frame {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--hair);
  background: var(--surface);
}

.media-frame-wide {
  aspect-ratio: 21 / 8;
}

.media-frame-portrait {
  aspect-ratio: 4 / 5;
  border-color: var(--border-on-dark);
  background: var(--surface-dark);
}

.media-frame-platform {
  aspect-ratio: 3 / 2;
}

.media-empty-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--slate);
  background: var(--surface);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  line-height: 1.6;
  text-align: center;
}

.media-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-photo {
  position: relative;
  width: 96px;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid var(--hair);
  background: var(--surface);
}

.member-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-photo-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: var(--slate);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  line-height: 1.5;
  text-align: center;
}

.media-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 10px;
  color: var(--slate);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.media-caption b {
  color: var(--cobalt);
  font-family: var(--serif);
  font-size: 14px;
  font-weight: 600;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--hair);
  border-bottom: 1px solid var(--hair);
}

.stat-item {
  min-height: 122px;
  padding: 25px 26px 23px 0;
  border-right: 1px solid var(--hair);
}

.stat-item:not(:first-child) {
  padding-left: 26px;
}

.stat-item:last-child {
  border-right: 0;
}

.stat-item strong {
  display: block;
  color: var(--ink);
  font-family: var(--serif-en), var(--serif);
  font-size: clamp(32px, 4vw, 54px);
  font-weight: 400;
  line-height: 1;
}

.stat-item strong small {
  margin-left: 4px;
  color: var(--cobalt);
  font-family: var(--serif);
  font-size: 17px;
}

.stat-item span {
  display: block;
  margin-top: 11px;
  color: var(--slate);
  font-size: 12px;
  letter-spacing: 0.12em;
}

.content-section {
  padding: 108px 0 0;
  scroll-margin-top: 95px;
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 28px;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--hair);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.section-square {
  width: 10px;
  height: 10px;
  background: var(--cobalt);
}

.section-title h2 {
  margin: 0;
  font-family: var(--serif);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 600;
  letter-spacing: 0.08em;
}

.section-en {
  color: var(--mist);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.competition-figure {
  margin-top: 34px;
}

.team-group {
  margin-top: 42px;
}

.team-group + .team-group {
  margin-top: 58px;
  padding-top: 34px;
  border-top: 1px solid var(--hair);
}

.team-group-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--hair);
}

.team-group-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-group-rule {
  width: 22px;
  height: 2px;
  background: var(--cobalt);
}

.team-group-title h3 {
  margin: 0;
  font-family: var(--serif);
  font-size: 25px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.team-group-en {
  color: var(--mist);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.roster {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 44px;
  margin-top: 36px;
}

.member-card {
  padding: 23px 0 25px;
  border-bottom: 1px solid var(--hair);
}

.team-empty-note {
  margin: 24px 0 0;
  color: var(--slate);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
}

.member-card-layout {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.member-top {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.member-card h4,
.award-card h3,
.platform-card h3 {
  margin: 0;
  font-family: var(--serif);
  font-weight: 600;
}

.member-card h4 {
  font-size: 23px;
  letter-spacing: 0.08em;
}

.member-role {
  margin: 7px 0 0;
  color: var(--slate);
  font-size: 13px;
}

.member-focus {
  margin: 14px 0 0;
  color: var(--ink);
  font-size: 13px;
}

.member-focus span {
  margin-right: 12px;
  color: var(--cobalt);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.competition-table {
  margin-top: 34px;
  border-top: 1px solid var(--hair);
}

.competition-row {
  display: grid;
  grid-template-columns: 92px minmax(0, 1.45fr) minmax(80px, 0.5fr) minmax(0, 1fr);
  gap: 18px;
  align-items: baseline;
  min-height: 62px;
  padding: 17px 0;
  border-bottom: 1px solid var(--hair);
  font-size: 13px;
}

.competition-head {
  min-height: 42px;
  padding: 10px 0;
  color: var(--mist);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.competition-date {
  color: var(--cobalt);
  font-family: var(--mono);
  font-size: 11px;
}

.competition-name {
  font-family: var(--serif);
  font-weight: 500;
}

.competition-tier {
  color: var(--cobalt);
}

.competition-result {
  color: var(--slate);
}

.competition-cards {
  display: none;
}

.media-preview-trigger {
  display: block;
  width: 100%;
  padding: 0;
  cursor: zoom-in;
  appearance: none;
  transition: border-color 180ms ease;
}

.member-photo.media-preview-trigger {
  width: 96px;
}

.media-preview-trigger:hover {
  border-color: var(--cobalt);
}

.studio-preview-image {
  display: block;
  width: 100%;
  max-height: 75vh;
  object-fit: contain;
}

.load-notice {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
  padding: 16px 20px;
  border: 1px solid var(--hair);
  font-size: 14px;
  background: var(--surface);
}

.load-notice-error {
  border-color: var(--accent-border);
}

.load-notice button {
  min-height: 44px;
  padding: 8px 18px;
  border: 1px solid var(--cobalt);
  color: var(--cobalt);
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.content-loading {
  display: grid;
  gap: 40px;
  margin-bottom: 60px;
}

.content-loading-block {
  padding: 24px 0;
  border-top: 1px solid var(--hair);
}

.content-loading-block span {
  display: block;
  height: 16px;
  margin-top: 18px;
  background: var(--surface);
  border-radius: 3px;
}

.content-loading-block span:first-child {
  width: 25%;
  height: 28px;
}

.content-loading-block span:last-child {
  width: 65%;
}

// 中文标题保持清晰字形，英文辅标题保留衬线风格。
.hero-title,
.section-title h2,
.team-group-title h3,
.member-card h4,
.project-band h3 {
  font-weight: 700;
  letter-spacing: 0.025em;
}

.hero-lede,
.band-description {
  line-height: 1.9;
}

.member-role,
.member-focus,
.competition-row,
.award-card > p:last-child,
.platform-card > p:not(.platform-label) {
  font-size: 15px;
  overflow-wrap: anywhere;
}

.section-en,
.team-group-en,
.media-caption,
.award-type,
.platform-label {
  font-size: 12px;
  letter-spacing: 0.06em;
}

.award-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 44px;
  margin-top: 14px;
}

.award-card {
  min-height: 210px;
  padding: 30px 0 28px;
  border-bottom: 1px solid var(--hair);
}

.award-type,
.platform-label,
.band-label {
  margin: 15px 0 8px;
  color: var(--cobalt);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.award-card h3 {
  font-size: 21px;
  letter-spacing: 0.04em;
}

.award-card > p:last-child {
  max-width: 520px;
  margin: 13px 0 0;
  color: var(--slate);
  font-size: 13px;
  line-height: 1.9;
}

.project-band {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(250px, 0.7fr);
  gap: 70px;
  margin-top: 34px;
  padding: 50px 54px 50px 50px;
  color: var(--text-on-dark);
  background: var(--dark);
}

.project-band-copy {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.band-accent {
  width: 34px;
  height: 2px;
  background: var(--accent-on-dark);
}

.band-label {
  margin-top: 25px;
  color: var(--accent-on-dark);
}

.project-band h3 {
  margin: 0;
  font-family: var(--serif);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.25;
}

.project-band h3 small {
  display: block;
  margin-top: 6px;
  color: var(--accent-on-dark);
  font-family: var(--serif-en), var(--sans);
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.16em;
}

.band-description {
  max-width: 600px;
  margin: 28px 0 0;
  color: var(--text-on-dark-muted);
  font-size: 14px;
  line-height: 2;
}

.band-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 32px;
  width: min(100%, 580px);
  margin: 34px 0 0;
  padding-top: 22px;
  border-top: 1px solid var(--border-on-dark);
}

.band-details div {
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr);
  gap: 10px;
}

.band-details dt {
  color: var(--accent-on-dark);
  font-family: var(--mono);
  font-size: 10px;
}

.band-details dd {
  margin: 0;
  color: var(--text-on-dark-muted);
  font-size: 12px;
}

.project-figure {
  align-self: center;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 52px 44px;
  margin-top: 58px;
}

.platform-card > p:not(.platform-label) {
  max-width: 540px;
  margin: 14px 0 0;
  color: var(--slate);
  font-size: 13px;
  line-height: 1.95;
}

.platform-card h3 {
  font-size: 26px;
  letter-spacing: 0.05em;
}

.platform-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 26px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--hair);
  color: var(--slate);
  font-size: 12px;
}

.platform-details b {
  margin-right: 8px;
  color: var(--cobalt);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
}

.empty-note {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 34px;
  padding: 28px 24px;
  border: 1px dashed var(--hair);
  background: var(--paper);
}

.empty-note-mark {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--cobalt);
  border: 1px solid var(--accent-border);
  font-family: var(--serif);
  font-size: 18px;
}

.empty-note strong {
  font-family: var(--serif);
  font-size: 17px;
  font-weight: 600;
}

.empty-note p {
  margin: 4px 0 0;
  color: var(--slate);
  font-size: 13px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 118px;
  padding: 26px 0 34px;
  border-top: 1px solid var(--hair);
  color: var(--slate);
  font-family: var(--sans);
  font-size: 12px;
  letter-spacing: 0.02em;
}

.footer p {
  margin: 0;
}

.footer a {
  color: var(--slate);
  text-decoration: none;
  transition: color 180ms ease;
}

.footer a:hover {
  color: var(--cobalt);
}

.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 650ms ease, transform 650ms cubic-bezier(0.2, 0.72, 0.2, 1);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes cursor-blink {
  0%, 46% { opacity: 1; }
  47%, 100% { opacity: 0; }
}

.project-band h3 {
  font-weight: 700;
  letter-spacing: 0.025em;
}

.award-card > p:last-child,
.platform-card > p:not(.platform-label) {
  font-size: 15px;
}

.award-type,
.platform-label {
  font-size: 12px;
  letter-spacing: 0.06em;
}

@media (max-width: 1000px) {
  .studio-shell {
    padding: 0 36px;
  }

  .hero {
    padding-top: 72px;
  }

  .project-band {
    gap: 36px;
    padding: 38px;
  }
}

@media (max-width: 760px) {
  .studio-shell {
    padding: 0 20px;
  }

  .masthead {
    padding: 16px 0;
  }

  .site-copy strong {
    max-width: 220px;
    font-size: 11px;
    letter-spacing: 0.06em;
  }

  .menu-toggle {
    display: flex;
  }

  .nav {
    position: absolute;
    top: calc(100% + 1px);
    right: 0;
    left: 0;
    display: none;
    align-items: stretch;
    flex-direction: column;
    gap: 0;
    padding: 8px 0 16px;
    border-bottom: 1px solid var(--hair);
    background: var(--paper-menu);
    box-shadow: 0 18px 24px var(--menu-shadow);
  }

  .nav.is-open {
    display: flex;
  }

  .nav a {
    padding: 0 20px;
  }

  .nav a::after {
    right: 20px;
    bottom: 4px;
    left: 20px;
  }

  .nav .nav-admin {
    margin: 8px 20px 0;
    padding: 0 13px;
  }

  .hero {
    display: block;
    padding: 66px 0 52px;
  }

  .hero-title {
    font-size: clamp(44px, 14vw, 68px);
  }

  .hero-lede {
    font-size: 14px;
  }

  .io-line {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 10px;
  }

  .io-value {
    font-size: 14px;
  }

  .hero-rail {
    display: none;
  }

  .hero-figure {
    margin-top: 42px;
  }

  .media-frame-wide {
    aspect-ratio: 16 / 9;
  }

  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-item,
  .stat-item:not(:first-child) {
    min-height: 105px;
    padding: 20px 16px;
    border-right: 1px solid var(--hair);
  }

  .stat-item:nth-child(2n) {
    border-right: 0;
  }

  .stat-item:nth-child(-n + 2) {
    border-bottom: 1px solid var(--hair);
  }

  .content-section {
    padding-top: 76px;
    scroll-margin-top: 76px;
  }

  .section-head {
    align-items: flex-end;
    gap: 12px;
  }

  .section-en {
    max-width: 120px;
    text-align: right;
    line-height: 1.4;
  }

  .team-group-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .team-group-en {
    padding-left: 34px;
  }

  .roster,
  .award-grid,
  .platform-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .competition-desktop {
    display: none;
  }

  .competition-cards {
    display: grid;
    gap: 16px;
    margin-top: 28px;
  }

  .competition-card {
    min-width: 0;
    padding: 22px 20px;
    border: 1px solid var(--hair);
    background: var(--paper);
    overflow-wrap: anywhere;
  }

  .competition-card-date {
    margin: 0 0 10px;
    color: var(--cobalt);
    font-family: var(--mono);
    font-size: 13px;
  }

  .competition-card h3 {
    margin: 0;
    font-size: 19px;
    line-height: 1.6;
  }

  .competition-card dl {
    display: grid;
    gap: 12px;
    margin: 18px 0 0;
    padding-top: 16px;
    border-top: 1px solid var(--hair);
  }

  .competition-card dl div {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 14px;
    font-size: 14px;
  }

  .competition-card dt {
    color: var(--slate);
  }

  .competition-card dd {
    margin: 0;
  }

  .project-band {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 32px 24px 28px;
  }

  .project-figure {
    width: min(100%, 300px);
  }

  .band-details {
    gap: 16px 12px;
  }

  .band-details div {
    grid-template-columns: 52px minmax(0, 1fr);
    gap: 5px;
  }

  .footer {
    align-items: flex-start;
    flex-direction: column;
    margin-top: 82px;
    gap: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto;
  }

  .reveal,
  .reveal.is-visible,
  .cursor,
  .nav a::after,
  .nav a {
    transform: none;
    animation: none;
    transition: none;
  }

  .reveal {
    opacity: 1;
  }
}
</style>
