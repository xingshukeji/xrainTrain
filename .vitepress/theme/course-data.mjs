export const lessons = [
  { id: 'g0', title: 'G0 · 我的第一条便签', path: '/start', outcome: '保存并重新读到一条真实便签', minutes: 15 },
  { id: 'b1', title: 'B1 · 定义与记录', path: '/basics/model', outcome: '分清对象、字段和记录', minutes: 12 },
  { id: 'b2', title: 'B2 · 找到并读懂接口', path: '/basics/api', outcome: '独立找到读取接口的合同', minutes: 15 },
  { id: 'b3', title: 'B3 · 读写与查询', path: '/basics/data', outcome: '修改同一条记录并按条件查询', minutes: 20 },
  { id: 'b4', title: 'B4 · 每次认识一种字段', path: '/basics/fields', outcome: '分清标签、保存值和引用 ID', minutes: 15 },
  { id: 'b5', title: 'B5 · 身份与权限', path: '/basics/access', outcome: '定位登录后仍然无权的原因', minutes: 12 },
  { id: 'b6', title: 'B6 · 修改定义与版本', path: '/basics/version', outcome: '核对安装版本并保留原有记录', minutes: 15 },
  { id: 'b7', title: 'B7 · 出错后继续', path: '/basics/debug', outcome: '从实际返回选择下一项检查', minutes: 15 }
]
export const lessonIds = lessons.map(lesson => lesson.id)
