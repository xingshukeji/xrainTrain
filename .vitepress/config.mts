import { defineConfig } from 'vitepress'
import { lessons } from './theme/course-data.mjs'

export default defineConfig({
  lang: 'zh-CN', title: '苏宏助为', description: '苏州苏宏助为智能科技有限公司 · XRain 与 Workforce 产品、企业 AI 解决方案、官方开发文档、SDK、课程与 AI 技能。',
  srcDir: 'course', base: '/xrainTrain/', cleanUrls: true, lastUpdated: true,
  srcExclude: ['public/**'],
  head: [
    ['meta', { name: 'theme-color', content: '#167c72' }],
    ['link', { rel: 'describedby', href: '/xrainTrain/llms.txt' }]
  ],
  sitemap: { hostname: 'https://xingshukeji.github.io/xrainTrain/' },
  transformHead({ pageData }) {
    if (pageData.relativePath === '404.md') return []
    const site = 'https://xingshukeji.github.io/xrainTrain/'
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '')
    const url = new URL(path, site).href
    const organization = { '@type': 'Organization', '@id': `${site}#organization`, name: '苏宏助为', legalName: '苏州苏宏助为智能科技有限公司', url: 'https://www.atlas-xrain.com/' }
    const product = path === 'products/xrain' ? 'XRain' : path === 'products/workforce' ? 'XRain Workforce' : undefined
    const page = { '@type': path === 'contact' ? 'ContactPage' : 'WebPage', '@id': url, url, name: pageData.title,
      description: pageData.description, inLanguage: 'zh-CN', isPartOf: { '@id': `${site}#website` }, publisher: { '@id': organization['@id'] },
      ...(product ? { mainEntity: { '@id': `${url}#product` } } : {}) }
    return [
      ['link', { rel: 'alternate', type: 'text/markdown', href: `/xrainTrain/text/${pageData.relativePath}` }],
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: `${pageData.title} | 苏宏助为` }],
      ['meta', { property: 'og:description', content: pageData.description || 'XRain 与 Workforce 官方产品和开发资料' }],
      ['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': [
        organization, { '@type': 'WebSite', '@id': `${site}#website`, url: site, name: '苏宏助为 · XRain 与 Workforce 官方产品和开发资料', publisher: { '@id': organization['@id'] } }, page,
        ...(product ? [{ '@type': 'SoftwareApplication', '@id': `${url}#product`, name: product, url, applicationCategory: 'BusinessApplication', creator: { '@id': organization['@id'] } }] : [])
      ] }).replaceAll('<', '\\u003c')]
    ]
  },
  markdown: {
    lineNumbers: false,
    config(md) {
      const renderLink = md.renderer.rules.link_open!
      md.renderer.rules.link_open = (tokens, index, options, env, self) => {
        const href = tokens[index].attrGet('href') || ''
        const rendered = renderLink(tokens, index, options, env, self)
        if (!href.startsWith('/downloads/')) return rendered
        const filename = href.split('/').pop()!
        tokens[index].attrSet('download', filename === 'note-source.json' ? 'source.json' : filename)
        return self.renderToken(tokens, index, options)
      }
    }
  },
  themeConfig: {
    sidebarMenuLabel: '内容目录', returnToTopLabel: '返回顶部', skipToContentLabel: '跳到正文',
    darkModeSwitchLabel: '外观', darkModeSwitchTitle: '切换为深色', lightModeSwitchTitle: '切换为浅色',
    logo: '/mark.svg', siteTitle: '苏宏助为', outline: { level: [2, 3], label: '本页内容' },
    nav: [{ text: '产品', link: '/products/' }, { text: '解决方案', link: '/solutions' }, { text: '开发者文档', link: '/developers/' }, { text: '学习课程', link: '/learn' }, { text: '联系我们', link: '/contact' }],
    sidebar: {
      '/products/': [{ text: '产品与技术', items: [
        { text: '产品总览', link: '/products/' }, { text: 'XRain 业务应用平台', link: '/products/xrain' },
        { text: 'XRain Workforce', link: '/products/workforce' }, { text: '开发者文档', link: '/developers/' }, { text: '联系我们', link: '/contact' }
      ] }],
      '/developers/': [{ text: '开始开发', items: [
        { text: '开发者文档', link: '/developers/' }, { text: '连接已有系统，无需重新建模', link: '/developers/integration' },
        { text: '官方 SDK', link: '/developers/sdk' }, { text: '官方 AI 技能', link: '/developers/skills' }
      ] }, { text: '指南与参考', items: [
        { text: 'AI 开发指南', link: '/ai/' }, { text: '完整便签案例', link: '/ai/note-case' },
        { text: 'HTTP API', link: '/reference/http' }, { text: 'CLI 与应用包', link: '/reference/tools' },
        { text: '全部开发专题', link: '/ai/reference' }, { text: '错误与版本', link: '/ai/troubleshooting' },
        { text: '人员学习课程', link: '/learn' }, { text: '联系我们', link: '/contact' }
      ] }],
      '/ai/': [
        { text: 'AI 开发资料', items: [
          { text: 'AI 开发入口', link: '/ai/' },
          { text: '平台能力与扩展选择', link: '/ai/platform' },
          { text: '从需求到可验证结果', link: '/ai/development' },
          { text: '完整便签开发案例', link: '/ai/note-case' },
          { text: '开发资料目录', link: '/ai/reference' },
          { text: '错误、版本与当前环境', link: '/ai/troubleshooting' }
        ] },
        { text: '配套资源', items: [
          { text: '产品与技术', link: '/products/' },
          { text: '开发者文档与 SDK', link: '/developers/' },
          { text: '人员学习课程', link: '/learn' },
          { text: 'HTTP、SDK 与 CLI', link: '/reference/' },
          { text: '公开技能仓库', link: 'https://github.com/xingshukeji/skills-hub' },
          { text: 'AI 文本索引', link: 'https://xingshukeji.github.io/xrainTrain/llms.txt' },
          { text: '联系我们', link: '/contact' }
        ] }
      ],
      '/': [
      { text: '学习入口', items: [{ text: '人员学习', link: '/learn' }, { text: '学习记录', link: '/progress' }, { text: 'AI 开发资料', link: '/ai/' }] },
      { text: '先认识平台', items: [{ text: '跟着视频认识平台', link: '/platform-tour' }] },
      { text: '先做出一条便签', items: lessons.map(({ title, path }) => ({ text: title, link: path })) },
      { text: '按问题继续学', collapsed: false, items: [{ text: '平台能力地图', link: '/map' }, { text: '查询、视图与数据维护', link: '/topics/data' }, { text: '函数、事件与定时任务', link: '/topics/automation' }, { text: '集成、文件与消息', link: '/topics/integration' }, { text: 'AI 与 Workforce 综合练习', link: '/topics/workforce' }, { text: '安装与持续维护', link: '/topics/operations' }] },
      { text: '随时查阅', items: [{ text: '接口文档从哪里开始', link: '/reference/' }, { text: 'HTTP 记录与元数据', link: '/reference/http' }, { text: 'CLI、SDK 与应用包', link: '/reference/tools' }, { text: '按现象排错', link: '/help/errors' }, { text: '准备真实练习环境', link: '/help/environment' }, { text: '术语与来源', link: '/reference/glossary' }, { text: '资料总索引与适用版本', link: '/reference/sources' }] }
      ]
    },
    search: { provider: 'local', options: { locales: { root: { translations: { button: { buttonText: '搜索资料', buttonAriaLabel: '搜索资料' }, modal: { displayDetails: '显示详情', resetButtonTitle: '清除搜索', backButtonTitle: '关闭搜索', noResultsText: '没有找到结果', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } } } } } } },
    socialLinks: [{ icon: 'github', link: 'https://github.com/xingshukeji/xrainTrain' }],
    docFooter: { prev: '上一节', next: '下一节' },
    lastUpdated: { text: '内容更新', formatOptions: { dateStyle: 'medium' } },
    footer: { message: '<a href="/xrainTrain/products/">产品</a> · <a href="/xrainTrain/developers/">开发者文档</a> · <a href="/xrainTrain/contact">联系我们</a> · <a href="https://www.atlas-xrain.com/">品牌官网</a>', copyright: '苏州苏宏助为智能科技有限公司 · XRain / XRain Workforce' }
  }
})
