import { defineConfig } from 'vitepress'
import { lessons } from './theme/course-data.mjs'

export default defineConfig({
  lang: 'zh-CN', title: 'XRain 学习课', description: '从一条便签开始，学会 XRain 低代码建模、接口和应用交付。',
  srcDir: 'course', base: '/xrainTrain/', cleanUrls: true, lastUpdated: true,
  head: [['meta', { name: 'theme-color', content: '#167c72' }]],
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
    sidebarMenuLabel: '课程目录', returnToTopLabel: '返回顶部', skipToContentLabel: '跳到正文',
    darkModeSwitchLabel: '外观', darkModeSwitchTitle: '切换为深色', lightModeSwitchTitle: '切换为浅色',
    logo: '/mark.svg', siteTitle: 'XRain 学习课', outline: { level: [2, 3], label: '本页内容' },
    nav: [{ text: '开始学习', link: '/start' }, { text: '操作视频', link: '/platform-tour' }, { text: '能力地图', link: '/map' }, { text: '接口文档', link: '/reference/' }, { text: '学习记录', link: '/progress' }],
    sidebar: [
      { text: '先认识平台', items: [{ text: '跟着视频认识平台', link: '/platform-tour' }] },
      { text: '先做出一条便签', items: lessons.map(({ title, path }) => ({ text: title, link: path })) },
      { text: '按问题继续学', collapsed: false, items: [{ text: '平台能力地图', link: '/map' }, { text: '查询、视图与数据维护', link: '/topics/data' }, { text: '函数、事件与定时任务', link: '/topics/automation' }, { text: '集成、文件与消息', link: '/topics/integration' }, { text: 'AI 与 Workforce 综合练习', link: '/topics/workforce' }, { text: '安装与持续维护', link: '/topics/operations' }] },
      { text: '随时查阅', items: [{ text: '接口文档从哪里开始', link: '/reference/' }, { text: 'HTTP 记录与元数据', link: '/reference/http' }, { text: 'CLI、SDK 与应用包', link: '/reference/tools' }, { text: '按现象排错', link: '/help/errors' }, { text: '准备真实练习环境', link: '/help/environment' }, { text: '术语与来源', link: '/reference/glossary' }, { text: '资料总索引与适用版本', link: '/reference/sources' }] }
    ],
    search: { provider: 'local', options: { locales: { root: { translations: { button: { buttonText: '搜索课程', buttonAriaLabel: '搜索课程' }, modal: { displayDetails: '显示详情', resetButtonTitle: '清除搜索', backButtonTitle: '关闭搜索', noResultsText: '没有找到结果', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } } } } } } },
    socialLinks: [{ icon: 'github', link: 'https://github.com/xingshukeji/xrainTrain' }],
    docFooter: { prev: '上一节', next: '下一节' },
    lastUpdated: { text: '内容更新', formatOptions: { dateStyle: 'medium' } },
    footer: { message: '从一个小例子开始，把每一步真正弄明白。', copyright: 'XRain 学习课 · 课程源码可公开获取，平台源码不包含在本课程中' }
  }
})
